# Home Assistant Add-on Repository - Modern Architecture

Ein modernes Blueprint-Repository für **Home Assistant Add-on Entwicklung** mit Best Practices.

Dieses Repository zeigt die moderne, empfohlene Architektur für HA-Add-ons:
- **Backend**: FastAPI + WebSocket Client zu Home Assistant
- **Frontend**: React + TypeScript + Zustand State Management
- **Integration**: Ingress UI + Multi-Stage Docker Build

[![Open your Home Assistant instance and show the add add-on repository dialog with a specific repository URL pre-filled.](https://my.home-assistant.io/badges/supervisor_add_addon_repository.svg)](https://my.home-assistant.io/redirect/supervisor_add_addon_repository/?repository_url=https%3A%2F%2Fgithub.com%2Fhome-assistant%2Faddons-example)

## 📚 Dokumentation

- [Home Assistant Add-on Developer Docs](https://developers.home-assistant.io/docs/add-ons)
- [WebSocket API Reference](https://developers.home-assistant.io/docs/api/websocket/)

## 🏗️ Add-ons in diesem Repository

### [Example Add-on](./example)

![Supports aarch64 Architecture][aarch64-shield]
![Supports amd64 Architecture][amd64-shield]

Modernes Home Assistant Add-on mit **FastAPI Backend**, **React Frontend** und **WebSocket Integration**.

**Features:**
- ✅ FastAPI REST API + WebSocket
- ✅ React 18 Dashboard
- ✅ TypeScript für Type-Safety
- ✅ Ingress UI Integration
- ✅ Multi-Stage Docker Build
- ✅ VS Code DevContainer
- ✅ Async Architecture

**Neue Benutzer?** → Siehe [QUICKSTART.md](./QUICKSTART.md)
**Technische Details?** → Siehe [TEMPLATE_GUIDE.md](./TEMPLATE_GUIDE.md)

## 🚀 Schnelleinstieg

### Mit VS Code DevContainer

```bash
# 1. Repository klonen
git clone <this-repository>
cd ha-addons-example

# 2. In VS Code öffnen
code .

# 3. Remote Container Extension öffnen
# Command Palette: "Dev Container: Reopen in Container"

# 4. Home Assistant starten (falls nicht automatisch gestartet)
supervisor_run

# 5. Supervisor patchen (nur beim ersten Start nötig)
chmod +x ./patch_supervisor.sh && ./patch_supervisor.sh

# 6. Add-on bauen und starten
ha apps rebuild --force local_example
ha apps start local_example
```

### Lokale Entwicklung ohne DevContainer

```bash
# Backend
cd example/backend
pip install -r requirements.txt
python main.py

# Frontend (in anderem Terminal)
cd example/frontend
npm install
npm run dev
```

Backend: http://localhost:8000
Frontend: http://localhost:3000

> **Im DevContainer** öffne http://localhost:7123 → Das Add-on erscheint in der **Seitenleiste**.

## 📁 Projektstruktur

```
ha-addons-example/
├── .devcontainer.json          # VS Code DevContainer Config
├── .github/
│   └── workflows/              # GitHub Actions (CI/CD)
├── example/                    # Example Add-on
│   ├── backend/                # FastAPI Backend
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   └── app/
│   │       ├── router.py
│   │       ├── models.py
│   │       └── ha_client.py
│   ├── frontend/               # React Frontend
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   └── src/
│   │       ├── api/
│   │       ├── store/
│   │       ├── hooks/
│   │       └── components/
│   ├── rootfs/                 # Runtime Files
│   │   └── etc/services.d/
│   ├── Dockerfile              # Multi-Stage Build
│   ├── config.yaml             # Add-on Config
│   ├── build.yaml              # Build Config
│   ├── CHANGELOG.md
│   └── DOCS.md
├── devcontainer_bootstrap      # Post-start setup + Supervisor monitor
├── patch_supervisor.sh         # Supervisor patch für DevContainer
├── LICENSE
└── repository.yaml             # Repository Config
```

## 🔧 Verwendete Technologien

### Backend
- **FastAPI** - Modernes Python Web Framework
- **Python 3.11+** - Aktuelle Python Version
- **aiohttp** - Async HTTP Client
- **Pydantic** - Data Validation
- **Uvicorn** - ASGI Server

### Frontend
- **React 18** - UI Framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Moderne Build Tool
- **Zustand** - State Management
- **Axios** - HTTP Client

### Infrastructure
- **Docker** - Containerization
- **Alpine Linux 3.20** - Leichte Base Image
- **Home Assistant** - Smart Home Platform
- **GitHub Actions** - CI/CD Pipeline

## 📖 Konfiguration anpassen

### Repository Einstellungen

1. Fork oder klone dieses Repository
2. Passe `repository.yaml` an deine Daten an:

```yaml
name: Mein Add-on Repository
url: https://github.com/username/my-addon-repo
maintainer: Dein Name
```

3. Rename `example/` directory zu deinem Add-on Namen
4. Update `example/config.yaml` — nur `slug:`, `name:` und `version:` anpassen:

```yaml
slug: my_addon              # Wichtig: muss Directory-Namen matchen
name: Mein Custom Add-on
version: "1.0.0"
```

> **Kein `image:` nötig.** Der CI-Builder trägt `ghcr.io/<owner>/<slug>-{arch}`
> automatisch ein beim Push zu GitHub.

5. Pushe zu deinem Repository
6. Aktiviere GitHub Actions unter Settings → Actions → General

## 🔌 API Integration

### Home Assistant WebSocket

Der HAClient stellt eine persistente Verbindung her:

```python
# backend/app/ha_client.py
client = HAClient()
await client.connect()  # Verbindung zu HA herstellen
```

### Service Calls

```javascript
// Frontend
haClient.callService('light', 'turn_on', {
  entity_id: 'light.living_room'
})
```

### Real-time Updates

WebSocket Updates werden automatisch zum Frontend gestreamt:

```json
{
  "type": "entity_update",
  "entity": {
    "entity_id": "sensor.temp",
    "state": "22.5"
  }
}
```

## 🧪 Testen

### Lokal testen

```bash
# Build Docker Image
docker build -t test_addon ./example

# Run in Docker
docker run --network="host" test_addon
```

### Im Home Assistant DevContainer

```bash
# Rebuild & Start Add-on
ha apps rebuild --force local_example
ha apps start local_example

# View Logs
docker logs --follow addon_local_example
```

## 📝 Weitere Schritte nach Setup

- [ ] Repository forken/klonen
- [ ] `repository.yaml` anpassen
- [ ] `example` directory umbenennen
- [ ] `config.yaml` aktualisieren
- [ ] GitHub Actions konfigurieren
- [ ] GitHub Container Registry Setup
- [ ] Dein First Add-on publishen! 🎉

## 🐛 Häufige Probleme

### Add-on startet nicht
```bash
docker logs addon_local_example
```

### Frontend wird nicht angezeigt / 404 Not Found
```bash
# Frontend muss mit relativen Pfaden gebaut werden (base: './' in vite.config.ts)
cd example/frontend
npm run build
```
→ Siehe [TEMPLATE_GUIDE.md](./TEMPLATE_GUIDE.md) für Details zum Ingress-Routing

### Add-on nicht in der Seitenleiste
```bash
# Add-on neu bauen und starten
ha apps rebuild --force local_example
ha apps start local_example
```

### WebSocket Verbindung fehlgeschlagen
- Im DevContainer: WebSocket läuft auf `supervisor` Hostname
- Nicht `localhost`!

## 📞 Support & Community

- [Home Assistant Community Forum](https://community.home-assistant.io/)
- [Home Assistant Discord](https://discord.gg/home-assistant)
- [Home Assistant GitHub Discussions](https://github.com/home-assistant/core/discussions)

## 📄 Lizenz

Apache License 2.0 - siehe [LICENSE](./LICENSE)

---

**Viel Spaß bei der Add-on Entwicklung! 🏠✨**

[aarch64-shield]: https://img.shields.io/badge/aarch64-yes-green.svg
[amd64-shield]: https://img.shields.io/badge/amd64-yes-green.svg
[armv7-shield]: https://img.shields.io/badge/armv7-yes-green.svg
