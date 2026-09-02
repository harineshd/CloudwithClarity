# MedTrack Application Githubactions

A real 3-tier clinic appointment system, built to be run locally first and then deployed onto the
AWS lab architecture (VPC → EC2 → AMI → Launch Template → ALB → ASG → CloudWatch → Route 53).

```
Browser
   │
   ▼
[ Web tier ]      React (Vite build) served by Nginx, reverse-proxies /api
   │
   ▼
[ App tier ]      Node.js + Express REST API, JWT auth
   │
   ▼
[ DB tier ]       MySQL 8 (patients, doctors, appointments, users)
```

## Run it locally

Requires Docker and Docker Compose.

```bash
cd medtrack
docker compose up --build
```

This starts three containers:
- `mysql` — the DB tier, with a persistent volume
- `backend` — the app tier, on port 5000 (also exposed to host for debugging)
- `web` — the web tier, Nginx on port 8080, serving the built React app and proxying `/api/*` to `backend`

Once all three are healthy, open **http://localhost:8080**.

**Login:** `admin@medtrack.local` / `admin123` (auto-seeded on first boot, along with 4 doctors and
2 sample patients — see `backend/db/init.js`).

Schema is created automatically on backend startup. `database/schema.sql` is provided for reference
and for when you set up RDS manually in the cloud phase.

## Local dev without Docker (optional)

```bash
# Terminal 1 - MySQL only
docker compose up mysql

# Terminal 2 - backend
cd backend
cp .env.example .env   # edit DB_HOST=localhost
npm install
npm run dev

# Terminal 3 - frontend
cd frontend
npm install
npm run dev             # http://localhost:5173, proxies /api to :5000
```

## How this maps onto the cloud lab

| Local piece | Cloud equivalent |
|---|---|
| `web` container (Nginx + React build) | Web tier EC2 instances behind the **public ALB**, baked into a golden AMI |
| `backend` container (Node/Express) | App tier EC2 instances behind the **internal ALB**, baked into a golden AMI |
| `mysql` container | **RDS MySQL Multi-AZ** in the DB-private subnets |
| `GET /api/health` | Target group health check path for the app tier |
| `/healthz` on Nginx | Target group health check path for the web tier |
| `nginx/default.conf` proxy_pass target | Swap `http://backend:5000` for the internal ALB's DNS name |
| `docker-compose.yml` env vars | Move into instance user-data / SSM Parameter Store, not hardcoded in the AMI |
| `GET /api/stats` | Basis for a custom CloudWatch metric (e.g. push `scheduledAppointments` on an interval) |

When you bake the AMIs in Phase 3, the web-tier AMI is just "Nginx installed, this repo's
`frontend/dist` and `nginx/default.conf` in place." The app-tier AMI is "Node installed, this repo's
`backend/` in place, started via a process manager (pm2 or a systemd unit) instead of `node server.js`
directly." Same code, different host.

## Security notes carried over from the design

- The app tier never talks to the internet directly — only to MySQL/RDS.
- Passwords are bcrypt-hashed, never stored in plaintext.
- JWTs are required on every route except `/api/auth/login` and `/api/health`.
- `JWT_SECRET` and DB credentials are environment variables here for simplicity — in the cloud lab,
  move them into SSM Parameter Store or Secrets Manager and reference them from user-data instead of
  hardcoding.
