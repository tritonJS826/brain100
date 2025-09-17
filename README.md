# brain100

## 🚀 Quick Start

1. Install dependencies:
```bash
pnpm install
```

2. Set up environment variables:
```bash
./useEnvs.sh local
```

3. Start databases and nginx in containers:
```bash
docker-compose -f local.docker-compose.yml up
```

4. Run database migrations:
```bash
pnpm run general:prisma:migrate
```

5. Start the application:
```bash
pnpm start
```


- Frontend: http://localhost:5174  
- Backend API: http://localhost:8000/general  
- Grafana: http://localhost:5173/grafana/login  
