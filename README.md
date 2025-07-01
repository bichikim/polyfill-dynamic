# Polyfill Dynamic

사용자의 브라우저 User-Agent를 분석하여 해당 브라우저에 필요한 polyfill만 동적으로 생성하고 제공하는 API 서버입니다.

## 주요 기능

- **동적 Polyfill 생성**: User-Agent 분석을 통해 브라우저별 필요한 polyfill만 선별
- **최적화된 번들링**: esbuild를 사용하여 minified된 polyfill 스크립트 제공
- **RESTful API**: 간단한 HTTP 요청으로 polyfill 스크립트 획득
- **Core-js 기반**: 신뢰할 수 있는 core-js polyfill 라이브러리 사용

## 기술 스택

- **Runtime**: Node.js
- **Language**: TypeScript
- **Web Framework**: hyper-express
- **Polyfill Library**: core-js
- **Bundler**: esbuild
- **Browser Detection**: browserslist-useragent

## 설치 및 실행

### 의존성 설치
```bash
pnpm install
```

### 개발 모드 실행
```bash
pnpm dev
```

### 프로덕션 빌드 및 실행
```bash
pnpm build
pnpm start
```

## API 사용법

### GET /api/v1/polyfill.js

User-Agent 헤더를 기반으로 최적화된 polyfill 스크립트를 반환합니다.

**요청 예시:**
```bash
curl -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" \
     http://localhost:3000/api/v1/polyfill.js
```

**응답:**
- Content-Type: `application/javascript`
- 해당 브라우저에 필요한 polyfill이 번들링된 minified JavaScript 코드

### 웹페이지에서 사용
```html
<script src="http://localhost:3000/api/v1/polyfill.js"></script>
```

## 작동 원리

1. **User-Agent 분석**: 요청 헤더의 User-Agent를 파싱하여 브라우저와 버전 정보 추출
2. **Polyfill 목록 생성**: core-js-compat을 사용하여 해당 브라우저에 필요한 polyfill 목록 결정
3. **스크립트 생성**: 필요한 core-js 모듈들을 import하는 스크립트 생성
4. **번들링**: esbuild로 ES5 호환 IIFE 형태로 번들링 및 최적화
5. **응답**: 최적화된 JavaScript 코드를 클라이언트에 전달

## 개발 스크립트

- `pnpm dev`: 개발 모드 (파일 변경 감지 및 자동 재시작)
- `pnpm build`: 프로덕션 빌드
- `pnpm start`: 빌드된 파일 실행
- `pnpm eslint`: 코드 린팅
- `pnpm eslint:fix`: 린팅 에러 자동 수정

## 라이센스

MIT 