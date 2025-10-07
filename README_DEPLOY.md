# 🚀 Brain100 Production Deployment Guide

## Overview

This guide describes how to deploy **Brain100** (backend, frontend, Nginx gateway, PostgreSQL, and automated SSL via Certbot) using **Docker Compose**.

Everything is automated — including:
- HTTPS setup via **Let’s Encrypt**
- Auto certificate renewal
- Safe Nginx reload after renewal
- Isolation between backend, frontend, and database

---

## 📁 Project Structure

```
brain100/
├── br-general-python/          # FastAPI backend
├── pt-web/                     # Frontend (Vue/React)
├── postgres/                   # PostgreSQL Dockerfile
├── gateway/
│   ├── nginx.conf              # Nginx reverse proxy config
│   ├── certs/                  # SSL certificates (mounted)
│   └── html/                   # Certbot challenge folder
├── docker-compose.yml          # Main deployment file
└── README_DEPLOY.md            # This guide
```

---

## ⚙️ Step 1. Prepare Environment

Ensure your server has:
- **Docker Engine** ≥ 24.x  
- **Docker Compose plugin** ≥ 2.20  
- **Ports 80 and 443 open**

Then, clone your project:
```bash
git clone https://github.com/<your-org>/brain100.git
cd brain100
```

---

## 🧱 Step 2. Configure DNS

Create or update DNS records:

| Type | Name | Value |
|------|------|--------|
| A | `brain100.help` | `<server_public_ip>` |
| A | `www.brain100.help` | `<server_public_ip>` |

Propagation may take a few minutes.

---

## 🔐 Step 3. Start Base Stack

Bring up all services except Certbot (for initial certificate creation):

```bash
docker compose up -d br-postgres-general br-general-python br-web br-gateway
```

Verify Nginx and app are running:

```bash
docker ps
```

Then confirm HTTP works:
```bash
curl -I http://brain100.help
```
→ should return `HTTP/1.1 301 Moved Permanently`

---

## 🪄 Step 4. Obtain Initial SSL Certificates

Run Certbot manually **once** to request certificates from Let’s Encrypt:

```bash
docker compose run --rm certbot certbot certonly   --webroot -w /usr/share/nginx/html   -d brain100.help -d www.brain100.help   --email admin@brain100.help --agree-tos --non-interactive
```

✅ Certificates will be generated in:
```
gateway/certs/live/brain100.help/
├── fullchain.pem
├── privkey.pem
├── chain.pem
```

---

## 🌐 Step 5. Enable HTTPS Gateway

Now restart Nginx to load SSL:

```bash
docker compose restart br-gateway
```

Verify HTTPS:

```bash
curl -vk https://brain100.help
```

You should see a successful TLS handshake with Let’s Encrypt certificate.

---

## 🔁 Step 6. Enable Automatic Renewal

Once SSL is confirmed working, start the Certbot service permanently:

```bash
docker compose up -d certbot
```

It will:
- Auto-renew every 12 hours
- Reload Nginx automatically if running
- Skip reload safely if Nginx is restarting

Check logs anytime:
```bash
docker compose logs -f certbot
```

---

## 🧰 Step 7. Verify Everything

Run the following checks:

```bash
docker compose ps
```
✅ All services should show as “Up”.

Check HTTPS certificate:
```bash
docker compose exec br-gateway openssl x509 -in /etc/letsencrypt/live/brain100.help/fullchain.pem -text -noout | grep "Not After"
```

---

## 🧹 Step 8. Renewal Simulation (Optional)

You can test renewal manually to confirm everything works:
```bash
docker compose exec certbot certbot renew --dry-run
```

Expected output:
```
Congratulations, all simulated renewals succeeded.
```

---

## 🧩 Troubleshooting

| Issue | Solution |
|--------|-----------|
| **Port 80/443 already in use** | Stop other web servers (Apache, old Nginx) |
| **“Nginx container not running” in Certbot logs** | Safe to ignore – it retries later |
| **SSL not loading** | Check that `/gateway/certs/live/brain100.help/` exists |
| **DNS not resolving** | Wait for propagation or use public DNS check tools |

---

## 🧾 Notes for DevOps

- Renewal logs are visible via `docker compose logs -f certbot`.
- Certificates are stored persistently in `gateway/certs` — keep this directory backed up.
- To manually renew certificates at any time:
  ```bash
  docker compose exec certbot certbot renew
  ```
- To force Nginx reload:
  ```bash
  docker exec nginx nginx -s reload
  ```

---

## ✅ Summary

| Component | Role | Status |
|------------|------|--------|
| Nginx (br-gateway) | HTTPS reverse proxy | ✅ |
| Certbot | SSL issuance + auto-renew | ✅ |
| FastAPI backend | API service | ✅ |
| PostgreSQL | Database | ✅ |
| Frontend | Web UI | ✅ |

---

## 📦 One-command Deployment (after setup)

Once certificates exist, everything can be launched in one step:
```bash
docker compose up -d --build
```

That’s it — Brain100 will run fully with HTTPS, renewal, and auto reload 🎯
