package com.heartmatch.live.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateLiveRequest {

    @NotBlank(message = "直播标题不能为空")
    private String title;

    private String coverUrl;

    @NotNull(message = "直播类型不能为空")
    @Min(value = 1, message = "直播类型非法")
    @Max(value = 3, message = "直播类型非法")
    private Integer type;
}
