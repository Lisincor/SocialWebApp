# HeartMatch 心动匹配

A modern social dating application built with a microservices architecture. HeartMatch helps users discover connections, share moments, and find meaningful relationships through intelligent matching algorithms.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                         │
│                     http://localhost:5173                       │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    API Gateway (Spring Cloud)                   │
│                     http://localhost:8080                       │
│                     JWT Authentication                          │
└────┬──────┬──────┬──────┬──────┬──────┬──────┬────────┬───────┘
     │      │      │      │      │      │      │        │
     ▼      ▼      ▼      ▼      ▼      ▼      ▼        ▼
  User   Content  Match   IM    Video  Live   Pay
 Service Service Service Service Service Service Service
 (8081)  (8082)  (8083)  (8084) (8085) (8086) (8087)
```

## Tech Stack

### Backend
- **Framework**: Spring Boot 3.2, Spring Cloud Gateway
- **ORM**: MyBatis-Plus 3.5.5
- **Authentication**: JWT (JJWT 0.12.3)
- **Database**: MySQL 8.0 (7 separate databases)
- **Cache**: Redis 7.x

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand 5
- **HTTP Client**: Axios with interceptors

## Services

| Service | Port | Database | Description |
|---------|------|----------|-------------|
| gateway | 8080 | - | API Gateway, routing, JWT auth |
| user-service | 8081 | heartmatch_user | User registration, login, profiles |
| content-service | 8082 | heartmatch_content | Posts, feed, comments, topics |
| match-service | 8083 | heartmatch_match | Swipe matching, recommendations |
| im-service | 8084 | heartmatch_im | Instant messaging, conversations |
| video-service | 8085 | heartmatch_video | Short videos/Reels |
| live-service | 8086 | heartmatch_live | Live streaming |
| pay-service | 8087 | heartmatch_pay | VIP subscriptions, gifts |

## Quick Start

### Prerequisites
- Java 21+
- Node.js 18+
- Maven 3.8+
- Docker (for MySQL & Redis)

### 1. Start Infrastructure
```bash
docker-compose up -d
```

### 2. Start Backend Services
```bash
cd microservices
mvn spring-boot:run -pl gateway,user-service,content-service,match-service,im-service -DskipTests
```

Or start individual services:
```bash
mvn spring-boot:run -pl gateway -DskipTests      # API Gateway
mvn spring-boot:run -pl user-service -DskipTests # User Service
mvn spring-boot:run -pl content-service -DskipTests # Content Service
```

### 3. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

Access the app at http://localhost:5173

## Key Features

### Authentication
- Phone + SMS verification code login
- Account password login
- JWT tokens (24-hour expiry, stored in Redis)

### Feed & Content
- Photo/video posts with location tagging
- Topics/hashtags support
- Like, comment, share, and save functionality
- Recommendation algorithm:
  ```
  Score = (Interaction × 0.4) + (Relationship × 0.3) + (Freshness × 0.2) + (Popularity × 0.1)
  ```

### Matching
- Swipe right to like, left to skip
- Super like for special connections
- Mutual likes create a match
- Daily recommended matches

### Messaging
- Real-time chat with matched users
- Conversation history
- Message read status

## API Endpoints

All API calls go through the gateway at `/api/v1/`:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/login-sms` | POST | SMS login |
| `/api/v1/auth/login-account` | POST | Password login |
| `/api/v1/posts/feed` | GET | Get personalized feed |
| `/api/v1/posts/{id}/like` | POST | Like a post |
| `/api/v1/posts/{id}/comments` | GET/POST | Get/add comments |
| `/api/v1/matches/swipe` | POST | Record swipe action |
| `/api/v1/conversations` | GET | Get conversations |

## Project Structure

```
├── microservices/
│   ├── gateway/           # API Gateway
│   ├── user-service/      # User management
│   ├── content-service/   # Feed & posts
│   ├── match-service/     # Matching logic
│   ├── im-service/        # Messaging
│   ├── video-service/     # Video content
│   ├── live-service/      # Live streaming
│   └── pay-service/       # Payments
├── frontend/
│   ├── src/
│   │   ├── pages/         # Route pages
│   │   ├── components/     # Reusable components
│   │   ├── stores/         # Zustand stores
│   │   ├── services/       # API clients
│   │   └── hooks/          # Custom hooks
│   └── public/
├── docker-compose.yml      # MySQL + Redis
└── docs/                   # Technical docs
```

## Documentation

- [Technical Specification](./docs/heart-match-tech-spec.md) - Detailed architecture and API docs
- [Development Guide](./docs/DEVELOPMENT.md) - Development notes and bug fixes
- [Startup Guide](./docs/启动指南.md) - Step-by-step setup instructions

## License

MIT License
