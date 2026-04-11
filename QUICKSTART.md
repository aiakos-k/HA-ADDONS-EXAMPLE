# Quickstart Guide — Home Assistant Add-on Template

Quick guide to get started with the modern add-on setup.

## ⚡ 5-Minute Setup (DevContainer)

### Prerequisites

- VS Code with **Remote Container Extension**
- Docker Desktop
- Git

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/home-assistant/addons-example.git
cd ha-addons-example

# 2. Open in VS Code
code .

# 3. Start the container
# Command Palette (Ctrl+Shift+P) →
# "Dev Container: Reopen in Container"
# → Wait until the container is built (1-2 min)

# 4. Start Home Assistant (terminal inside the container)
# Option A: Use a VS Code Task (Command Palette → "Run Task: Start Home Assistant")
# Option B: Run the command in the terminal
supervisor_run

# 5. Build & start the add-on (in a new terminal)
./dev.sh start:addon
```

**Done!** 🎉

- **Home Assistant**: http://localhost:7123
- **Add-on Dashboard**: In the HA sidebar → "Example Dashboard"
- Backend API (direct): http://localhost:8000
- Swagger Docs (direct): http://localhost:8000/docs

> The add-on is displayed via **Ingress** in the sidebar.
> If it doesn't appear, run `./dev.sh start:addon` again.

---

## 📱 Without DevContainer (Local)

If you don't want to use DevContainer:

```bash
# Start backend (Terminal 1)
cd example/backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py

# Start frontend (Terminal 2)
cd example/frontend
npm install
npm run dev
```

Frontend: http://localhost:3000
Backend: http://localhost:8000

---

## 🤔 First Steps

### Test the Backend

Open http://localhost:8000/docs to see the **Swagger API Docs**.

Try it out:

1. `GET /health` - Health Check
2. `GET /api/status` - Get status
3. Explore more endpoints

### Explore the Frontend

Open http://localhost:3000

The React Dashboard shows:

- Connection status to the backend
- Entity list
- Buttons for testing

### Modify Code

Backend & frontend run in **watch mode**:

- Backend: Edit `example/backend/app/*.py` → Auto reload
- Frontend: Edit `example/frontend/src/**` → Hot Module Reload

### Connect to Home Assistant

The add-on automatically connects to Home Assistant via:

```
ws://supervisor/core/websocket
```

Code: `example/backend/app/ha_client.py`

---

## 🛠️ Useful Development Commands

```bash
# In DevContainer or locally

# Setup (install everything)
./dev.sh setup

# Build frontend only
./dev.sh build:frontend

# Test backend only
./dev.sh start:backend

# Build Docker image
./dev.sh build:docker

# Start add-on (DevContainer)
./dev.sh start:addon

# View logs (DevContainer)
./dev.sh logs

# Clean up everything
./dev.sh clean
```

---

## 📂 Important Files

| File                                 | Purpose                     |
| ------------------------------------ | --------------------------- |
| `example/backend/main.py`           | FastAPI Application Entry   |
| `example/backend/app/ha_client.py`  | HA WebSocket Client         |
| `example/frontend/src/App.tsx`      | React App                   |
| `example/frontend/src/api/client.ts`| Frontend API Client         |
| `example/config.yaml`               | Add-on Configuration        |
| `.devcontainer.json`                | VS Code DevContainer Config |

---

## 🐛 Common Issues

### "DevContainer is not found"

→ Install the **Remote Container Extension** in VS Code

### Backend won't start

```bash
# Check if Python 3.11+ is installed
python3 --version

# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend shows nothing / 404 Not Found

```bash
# Is the backend running?
curl http://localhost:8000/health

# Rebuild frontend (important: vite.config.ts must have base: './')
cd example/frontend && npm run build

# Restart the add-on
./dev.sh start:addon
```

→ For details on Ingress routing see [TEMPLATE_GUIDE.md](./TEMPLATE_GUIDE.md)

```

> **Important:** Always use `docker restart hassio_supervisor`!
> - `ha supervisor restart` recreates the container → patches are lost
> - `pkill` causes a cascade → Docker daemon crashes

### "Port already in use"

```bash
# Port 8000 or 3000 is already in use
# Kill other processes or use different ports
lsof -i :8000  # Find process
kill -9 <PID>
```

---

## 🛠️ Supervisor Patch für DevContainer

**Wichtig:** Im DevContainer ist Home Assistant Supervisor oft "unhealthy" (`docker_gateway_unprotected`). Das blockiert Add-on-Installationen. Das ist ein bekanntes Problem, weil systemd/dbus im DevContainer fehlen.

**Lösung:**

1. Nach jedem Supervisor-Start/Update führe aus:

```bash
./patch_supervisor.sh
```

2. Das Script patched alle nötigen Stellen und startet den Supervisor neu. Danach kannst du Add-ons installieren und entwickeln.

**Warum?**
- Der Patch ist nach jedem Supervisor-Update/Neustart wieder weg (Container wird ersetzt)
- Das Script ist idempotent und kann beliebig oft ausgeführt werden
- Kein manuelles Suchen/Patchen mehr nötig

**Tipp:**
- Du kannst das Script auch in `dev.sh` als `patch:supervisor` einbinden oder einen VS Code Task anlegen

---

## 💡 Next Steps

1. **Fork the repository** — Create your own version
2. **Customize the README** — Describe your add-on
3. **Add features** — Extend the code
4. **Test in Home Assistant** — With real smart home devices
5. **Set up GitHub Actions** — Automated builds
6. **Publish** — Share with the community 🎉

---

## 📚 Additional Resources

- [Home Assistant Add-on Docs](https://developers.home-assistant.io/docs/add-ons/)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)
- [React Documentation](https://react.dev/learn)
- [WebSocket API Reference](https://developers.home-assistant.io/docs/api/websocket/)
- [TEMPLATE_GUIDE.md](./TEMPLATE_GUIDE.md) — Technical details on Ingress, routing, and DevContainer patches
- [React Documentation](https://react.dev/learn)
- [WebSocket API Reference](https://developers.home-assistant.io/docs/api/websocket/)

---

## 💡 Nächste Schritte

1. **Repository forken** - Deine eigene Version erstellen
2. **README anpassen** - Dein Add-on beschreiben
3. **Features hinzufügen** - Den Code erweitern
4. **In Home Assistant testen** - Mit echten Smart Home Devices
5. **GitHub Actions einrichten** - Automatische Builds
6. **Publishen** - In Community teilen 🎉

---

## 📖 Weiterführend

- [TEMPLATE_GUIDE.md](./TEMPLATE_GUIDE.md) — Technische Details zu Ingress, Routing und DevContainer-Patches
- [Home Assistant Add-on Docs](https://developers.home-assistant.io/docs/add-ons/)

---

**Viel Spaß bei der Entwicklung! 🚀**

Fragen? → [Community Forum](https://community.home-assistant.io/)
