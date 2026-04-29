package com.heartmatch.config;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;

import java.nio.charset.StandardCharsets;

@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    private static final String[] WHITE_LIST = {
        "/api/v1/auth/send-code",
        "/api/v1/auth/login",
        "/api/v1/auth/register"
    };

    private final JwtParser jwtParser = Jwts.parser()
        .verifyWith(Keys.hmacShaKeyFor("heartmatch-secret-key-2024-must-be-at-least-256-bits-long-for-hs256".getBytes(StandardCharsets.UTF_8)))
        .build();

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        // 白名单放行
        for (String white : WHITE_LIST) {
            if (path.contains(white)) {
                return chain.filter(exchange);
            }
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);
        try {
            Claims claims = jwtParser.parseSignedClaims(token).getPayload();
            Long userId = claims.get("userId", Long.class);

            // 将userId添加到请求头，传递给下游服务
            ServerHttpRequest modifiedRequest = exchange.getRequest().mutate()
                .header("X-User-Id", String.valueOf(userId))
                .header("X-User-Token", token)
                .build();

            return chain.filter(exchange.mutate().request(modifiedRequest).build());
        } catch (JwtException e) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
    }

    @Override
    public int getOrder() {
        return -100;
    }
}