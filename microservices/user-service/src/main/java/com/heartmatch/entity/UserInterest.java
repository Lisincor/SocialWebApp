package com.heartmatch.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

@Data
@TableName("user_interest")
public class UserInterest {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;
    private Long tagId;
}