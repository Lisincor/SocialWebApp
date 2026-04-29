package com.heartmatch.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.heartmatch.entity.Conversation;
import com.heartmatch.entity.ConversationMember;
import com.heartmatch.entity.Message;
import com.heartmatch.repository.ConversationMemberRepository;
import com.heartmatch.repository.ConversationRepository;
import com.heartmatch.repository.MessageRepository;
import com.heartmatch.dto.ConversationResponse;
import com.heartmatch.dto.CreateConversationRequest;
import com.heartmatch.dto.MessageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository conversationRepository;
    private final ConversationMemberRepository memberRepository;
    private final MessageRepository messageRepository;

    /**
     * 获取用户的会话列表
     */
    public List<ConversationResponse> getConversations(Long userId) {
        // 查询用户参与的所有会话
        List<ConversationMember> memberships = memberRepository.selectList(
            new LambdaQueryWrapper<ConversationMember>()
                .eq(ConversationMember::getUserId, userId)
                .orderByDesc(ConversationMember::getUpdatedAt)
        );

        return memberships.stream().map(member -> {
            Conversation conversation = conversationRepository.selectById(member.getConversationId());
            if (conversation == null) return null;

            ConversationResponse response = new ConversationResponse();
            response.setId(conversation.getId());
            response.setUid(conversation.getUid());
            response.setType(conversation.getType());
            response.setName(conversation.getName());
            response.setAvatar(conversation.getAvatar());
            response.setLastMessageAt(conversation.getLastMessageAt());
            response.setIsMuted(member.getIsMuted());
            response.setIsPinned(member.getIsPinned());
            response.setCreatedAt(conversation.getCreatedAt());

            // 获取最后一条消息
            if (conversation.getLastMessageId() != null) {
                Message lastMessage = messageRepository.selectById(conversation.getLastMessageId());
                if (lastMessage != null) {
                    response.setLastMessage(convertToMessageResponse(lastMessage, userId));
                }
            }

            // 计算未读数
            long unreadCount = messageRepository.selectCount(
                new LambdaQueryWrapper<Message>()
                    .eq(Message::getConversationId, conversation.getId())
                    .ne(Message::getSenderId, userId) // 不计算自己发的消息
                    .gt(Message::getCreatedAt, member.getLastReadAt() != null ? member.getLastReadAt() : LocalDateTime.of(1970, 1, 1, 0, 0))
            );
            response.setUnreadCount((int) unreadCount);

            // 成员数量
            long memberCount = memberRepository.selectCount(
                new LambdaQueryWrapper<ConversationMember>()
                    .eq(ConversationMember::getConversationId, conversation.getId())
            );
            response.setMemberCount((int) memberCount);

            return response;
        }).collect(Collectors.toList());
    }

    /**
     * 创建会话
     */
    @Transactional
    public ConversationResponse createConversation(Long creatorId, CreateConversationRequest request) {
        // 创建会话
        Conversation conversation = new Conversation();
        conversation.setUid(UUID.randomUUID().toString().replace("-", ""));
        conversation.setType(request.getType());
        conversation.setName(request.getName());
        conversationRepository.insert(conversation);

        // 添加创建者为群主/成员
        ConversationMember creatorMember = new ConversationMember();
        creatorMember.setConversationId(conversation.getId());
        creatorMember.setUserId(creatorId);
        creatorMember.setRole(3); // 群主
        creatorMember.setIsMuted(false);
        creatorMember.setIsPinned(false);
        creatorMember.setLastReadAt(LocalDateTime.now());
        memberRepository.insert(creatorMember);

        // 添加其他成员
        if (request.getMemberIds() != null) {
            for (Long userId : request.getMemberIds()) {
                if (!userId.equals(creatorId)) {
                    ConversationMember member = new ConversationMember();
                    member.setConversationId(conversation.getId());
                    member.setUserId(userId);
                    member.setRole(1); // 普通成员
                    member.setIsMuted(false);
                    member.setIsPinned(false);
                    member.setLastReadAt(LocalDateTime.now());
                    memberRepository.insert(member);
                }
            }
        }

        ConversationResponse response = new ConversationResponse();
        response.setId(conversation.getId());
        response.setUid(conversation.getUid());
        response.setType(conversation.getType());
        response.setName(conversation.getName());
        response.setAvatar(conversation.getAvatar());
        response.setUnreadCount(0);
        response.setMemberCount(request.getMemberIds() != null ? request.getMemberIds().size() + 1 : 1);
        response.setCreatedAt(conversation.getCreatedAt());

        return response;
    }

    /**
     * 获取会话详情
     */
    public ConversationResponse getConversation(Long userId, Long conversationId) {
        Conversation conversation = conversationRepository.selectById(conversationId);
        if (conversation == null) return null;

        ConversationMember member = memberRepository.selectOne(
            new LambdaQueryWrapper<ConversationMember>()
                .eq(ConversationMember::getConversationId, conversationId)
                .eq(ConversationMember::getUserId, userId)
        );
        if (member == null) return null;

        ConversationResponse response = new ConversationResponse();
        response.setId(conversation.getId());
        response.setUid(conversation.getUid());
        response.setType(conversation.getType());
        response.setName(conversation.getName());
        response.setAvatar(conversation.getAvatar());
        response.setLastMessageAt(conversation.getLastMessageAt());
        response.setIsMuted(member.getIsMuted());
        response.setIsPinned(member.getIsPinned());
        response.setCreatedAt(conversation.getCreatedAt());

        // 获取最后一条消息
        if (conversation.getLastMessageId() != null) {
            Message lastMessage = messageRepository.selectById(conversation.getLastMessageId());
            if (lastMessage != null) {
                response.setLastMessage(convertToMessageResponse(lastMessage, userId));
            }
        }

        // 成员数量
        long memberCount = memberRepository.selectCount(
            new LambdaQueryWrapper<ConversationMember>()
                .eq(ConversationMember::getConversationId, conversation.getId())
        );
        response.setMemberCount((int) memberCount);

        return response;
    }

    /**
     * 标记会话已读
     */
    public void markAsRead(Long userId, Long conversationId) {
        ConversationMember member = memberRepository.selectOne(
            new LambdaQueryWrapper<ConversationMember>()
                .eq(ConversationMember::getConversationId, conversationId)
                .eq(ConversationMember::getUserId, userId)
        );
        if (member != null) {
            member.setLastReadAt(LocalDateTime.now());
            memberRepository.updateById(member);
        }
    }

    /**
     * 转换消息实体为响应DTO
     */
    public MessageResponse convertToMessageResponse(Message message, Long currentUserId) {
        MessageResponse response = new MessageResponse();
        response.setId(message.getId());
        response.setConversationId(message.getConversationId());
        response.setSenderId(message.getSenderId());
        response.setType(message.getType());
        response.setContent(message.getContent());
        response.setMediaUrl(message.getMediaUrl());
        response.setDuration(message.getDuration());
        response.setBurnAfterRead(message.getBurnAfterRead());
        response.setIsRecalled(message.getIsRecalled());
        response.setIsSelf(message.getSenderId().equals(currentUserId));
        response.setCreatedAt(message.getCreatedAt());

        // 计算消息状态
        if (message.getIsRecalled() != null && message.getIsRecalled()) {
            response.setStatus(4); // 已撤回
        } else if (message.getBurnedAt() != null) {
            response.setStatus(5); // 已焚毁
        } else if (message.getReadAt() != null && !message.getSenderId().equals(currentUserId)) {
            response.setStatus(3); // 已读
        } else {
            response.setStatus(2); // 已发送
        }

        return response;
    }
}
