package com.heartmatch;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.heartmatch.repository")
public class ImServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ImServiceApplication.class, args);
    }
}
