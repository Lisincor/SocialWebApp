package com.heartmatch.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.heartmatch.entity.Message;
import com.heartmatch.repository.MessageRepository;
import com.heartmatch.dto.MessageRequest;
import com.heartmatch.dto.MessageResponse;
import com.heartmatch.entity.Conversation;
import com.heartmatch.repository.ConversationRepository;
import com.heartmatch.entity.ConversationMember;
import com.heartmatch.repository.ConversationMemberRepository;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;
    private final ConversationRepository conversationRepository;
    private final ConversationMemberRepository memberRepository;
    private final ConversationService conversationService;

    /**
     * 发送消息
     */
    @Transactional
    public MessageResponse sendMessage(Long senderId, MessageRequest request) {
        // 验证用户是否在会话中
        ConversationMember member = memberRepository.selectOne(
            new LambdaQueryWrapper<ConversationMember>()
                .eq(ConversationMember::getConversationId, request.getConversationId())
                .eq(ConversationMember::getUserId, senderId)
        );
        if (member == null) {
            throw new RuntimeException("不在该会话中");
        }

        // 创建消息
        Message message = new Message();
        message.setUid(UUID.randomUUID().toString().replace("-", ""));
        message.setConversationId(request.getConversationId());
        message.setSenderId(senderId);
        message.setType(request.getType());
        message.setContent(request.getContent());
        message.setMediaUrl(request.getMediaUrl());
        message.setDuration(request.getDuration());
        message.setBurnAfterRead(request.getBurnAfterRead() != null ? request.getBurnAfterRead() : false);
        message.setIsRecalled(false);
        messageRepository.insert(message);

        // 更新会话的最后消息
        Conversation conversation = conversationRepository.selectById(request.getConversationId());
        if (conversation != null) {
            conversation.setLastMessageId(message.getId());
            conversation.setLastMessageAt(message.getCreatedAt());
            conversationRepository.updateById(conversation);
        }

        return conversationService.convertToMessageResponse(message, senderId);
    }

    /**
     * 获取消息列表
     */
    public Page<MessageResponse> getMessages(Long userId, Long conversationId, int page, int size) {
        // 验证用户是否在会话中
        ConversationMember member = memberRepository.selectOne(
            new LambdaQueryWrapper<ConversationMember>()
                .eq(ConversationMember::getConversationId, conversationId)
                .eq(ConversationMember::getUserId, userId)
        );
        if (member == null) {
            throw new RuntimeException("不在该会话中");
        }

        // 分页查询消息
        Page<Message> messagePage = new Page<>(page, size);
        LambdaQueryWrapper<Message> queryWrapper = new LambdaQueryWrapper<Message>()
            .eq(Message::getConversationId, conversationId)
            .eq(Message::getIsRecalled, false)
            .orderByDesc(Message::getCreatedAt);

        Page<Message> resultPage = messageRepository.selectPage(messagePage, queryWrapper);

        // 转换结果
        Page<MessageResponse> responsePage = new Page<>(resultPage.getCurrent(), resultPage.getSize(), resultPage.getTotal());
        responsePage.setRecords(resultPage.getRecords().stream()
            .map(msg -> conversationService.convertToMessageResponse(msg, userId))
            .toList());

        return responsePage;
    }

    /**
     * 撤回消息
     */
    @Transactional
    public void recallMessage(Long userId, Long messageId) {
        Message message = messageRepository.selectById(messageId);
        if (message == null) {
            throw new RuntimeException("消息不存在");
        }

        // 只有发送者可以撤回，且2分钟内可撤回
        if (!message.getSenderId().equals(userId)) {
            throw new RuntimeException("只能撤回自己的消息");
        }

        if (message.getCreatedAt().plusMinutes(2).isBefore(LocalDateTime.now())) {
            throw new RuntimeException("消息已超过2分钟，无法撤回");
        }

        message.setIsRecalled(true);
        messageRepository.updateById(message);
    }

    /**
     * 焚毁消息（阅后即焚）
     */
    @Transactional
    public void burnMessage(Long userId, Long messageId) {
        Message message = messageRepository.selectById(messageId);
        if (message == null) {
            throw new RuntimeException("消息不存在");
        }

        // 只有接收者可以焚毁消息
        // 这里需要查询会话成员来确认
        ConversationMember member = memberRepository.selectOne(
            new LambdaQueryWrapper<ConversationMember>()
                .eq(ConversationMember::getConversationId, message.getConversationId())
                .eq(ConversationMember::getUserId, userId)
        );
        if (member == null) {
            throw new RuntimeException("不在该会话中");
        }

        // 如果是自己发的消息或不是阅后即焚的消息，不能焚毁
        if (!message.getSenderId().equals(userId) && message.getBurnAfterRead() != null && message.getBurnAfterRead()) {
            // 接收者查看后标记已读，同时触发焚毁
            message.setBurnedAt(LocalDateTime.now());
            messageRepository.updateById(message);
        }
    }

    /**
     * 标记消息已读
     */
    @Transactional
    public void markMessageAsRead(Long userId, Long conversationId) {
        ConversationMember member = memberRepository.selectOne(
            new LambdaQueryWrapper<ConversationMember>()
                .eq(ConversationMember::getConversationId, conversationId)
                .eq(ConversationMember::getUserId, userId)
        );
        if (member == null) {
            throw new RuntimeException("不在该会话中");
        }

        // 更新最后阅读时间
        member.setLastReadAt(LocalDateTime.now());
        memberRepository.updateById(member);

        // 标记所有未读消息为已读
        messageRepository.update(null,
            new com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper<Message>()
                .eq(Message::getConversationId, conversationId)
                .ne(Message::getSenderId, userId)
                .isNull(Message::getReadAt)
                .set(Message::getReadAt, LocalDateTime.now())
        );
    }
}
