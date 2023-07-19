<div align="center" style="padding-bottom: 20px">
    <h1>Beerdegu Frontend</h1>
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt=""/>&nbsp;
    <img src="https://img.shields.io/badge/Next.js-%23000000.svg?&style=for-the-badge&logo=next.js&logoColor=white" alt=""/>&nbsp;
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt=""/>&nbsp;
    <img src="https://img.shields.io/badge/Mantine-0081CB?style=for-the-badge&logo=mantine&logoColor=white" alt=""/>&nbsp;
    <img src="https://img.shields.io/badge/Vercel-%23000000.svg?&style=for-the-badge&logo=vercel&logoColor=white" alt=""/>&nbsp;
</div>

Beerdegu is a real-time web application meant for beer tasting sessions, when
you and your friends are rating every consumed beer (color, smell, taste etc.).

Backend repo: https://github.com/Alschn/Beerdegu

## Tools, libraries, frameworks

- `react`, `next` - frontend framework
- `mantine` - UI components library
- `@tabler/icons-react` - icons
- `@tanstack/react-query` - data fetching
- `zod` - validating schemas
- `react-infinite-scroll-component` - infinite scroll
- `react-use-websocket` - websocket client
- `react-beautiful-dnd` - drag n' drop
- `axios` + fetch - http clients
- `jsonwebtoken` - decoding json web tokens
- `msw`, `playwright-msw` - mocking http requests in tests
- `vitest`, `@vitest/ui`, `@vitest/coverage-c8` + `@testing-library/react` - unit and components tests
- `@playwright/test` - e2e tests
- `@playwright/experimental-ct-react` - components tests

## Setup

Create `.env` file with environment variables

```dotenv
API_URL="http://127.0.0.1:8000"
NEXT_PUBLIC_API_URL=${API_URL}
NEXT_PUBLIC_WEBSOCKETS_URL="ws://127.0.0.1:8000/ws"
```

### Development

Run development server

```shell
pnpm run dev
```

### Testing

Run unit tests - vitest

```shell
pnpm test
```

Run e2e tests - playwright

```shell
pnpm test-e2e
```

Run components tests - playwright-ct

```shell
pnpm test-ct
```

## Deployment

1. Import Git repository in Vercel dashboard
2. Add `API_URL`, `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_WEBSOCKETS_URL` env variables
3. Deploy the application
