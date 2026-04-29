package com.heartmatch.live;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.heartmatch.live.repository")
public class LiveServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(LiveServiceApplication.class, args);
    }
}
