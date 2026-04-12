# Quickstart Guide — Home Assistant Add-on Template

## Prerequisites

- VS Code with **Dev Containers** extension
- Docker Desktop
- Git

---

## Setup (DevContainer)

```bash
# 1. Clone the repository
git clone https://github.com/home-assistant/addons-example.git
cd ha-addons-example

# 2. Open in VS Code
code .
```

Then: **Command Palette** (`Ctrl+Shift+P`) → `Dev Containers: Reopen in Container`

The container builds automatically and `devcontainer_bootstrap` runs on first start:
- Installs backend + frontend dependencies
- Starts Home Assistant Supervisor
- Watches for Supervisor restarts and re-applies patches automatically

---

## Start Home Assistant

After the container is ready, start the Supervisor if it is not already running:

```bash
supervisor_run
```

Home Assistant is available at **http://localhost:7123**

---

## Patch the Supervisor

The DevContainer lacks systemd/dbus, so the Supervisor starts in an unhealthy state
(`docker_gateway_unprotected`). The patch script fixes this:

```bash
chmod +x ./patch_supervisor.sh && ./patch_supervisor.sh
```

Expected output:
```
[patch_supervisor] Patching diagnostics (dbus/agent error)...
  -> PATCHED
[patch_supervisor] Patching firewall (docker_gateway_unprotected)...
  -> PATCHED
[patch_supervisor] Restarting Supervisor...
[patch_supervisor] Done!
```

The script is idempotent — run it again any time after a Supervisor update or restart.
`devcontainer_bootstrap` watches for Supervisor restarts and re-patches automatically in the background.

> **Note:** Use `docker restart hassio_supervisor` to restart the Supervisor manually.
> `ha supervisor restart` recreates the container and loses the patches.

---

## Install the Add-on

1. Go to **Settings → Add-ons → Add-on Store** in Home Assistant
2. Find **Example add-on** under Local add-ons
3. Click **Install**

The Supervisor builds the image locally from the Dockerfile (no registry needed).
The add-on appears in the sidebar as **Example Dashboard** via Ingress.

---

## Useful Commands

```bash
# Rebuild and restart the add-on after code changes
ha apps rebuild --force local_example
ha apps start local_example

# View add-on logs
docker logs --follow addon_local_example

# Re-patch Supervisor after a restart
./patch_supervisor.sh
```

---

## Important Files

| File | Purpose |
|---|---|
| `example/config.yaml` | Add-on manifest (name, slug, ports, options) |
| `example/build.yaml` | Base image + build args per architecture |
| `example/Dockerfile` | Multi-stage build (React + FastAPI) |
| `example/backend/app/main.py` | FastAPI application entry point |
| `example/backend/app/ha_client.py` | Home Assistant WebSocket client |
| `example/frontend/src/App.tsx` | React app root |
| `example/frontend/src/api/client.ts` | Frontend API client (Ingress-aware) |
| `.devcontainer.json` | VS Code DevContainer config |
| `devcontainer_bootstrap` | Post-start setup + Supervisor monitor |
| `patch_supervisor.sh` | Supervisor patch for DevContainer |

---

## Troubleshooting

### Add-on install fails with `docker_gateway_unprotected`

Run `./patch_supervisor.sh` and try again.

### Add-on install fails with `403` / image pull error

The `image:` field is intentionally absent from `config.yaml` — local dev always
builds from the Dockerfile. If an `image:` line somehow ended up in `config.yaml`,
remove it.

### Add-on panel missing from sidebar

```bash
ha apps rebuild --force local_example
ha apps start local_example
```

### Port already in use

```bash
lsof -i :8000   # find process
kill -9 <PID>
```

---

## Creating a New Add-on from This Template

1. Rename the `example/` folder to your add-on name
2. Update `slug:`, `name:`, `version:` in `config.yaml`
3. Update `build.yaml` labels
4. Implement your backend + frontend
5. Push to GitHub → CI automatically builds and pushes
   `ghcr.io/<owner>/<slug>-{arch}` to GHCR (no extra config needed)

---

## Resources

- [Home Assistant Add-on Docs](https://developers.home-assistant.io/docs/add-ons/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/tutorial/)
- [React Documentation](https://react.dev/learn)
- [HA WebSocket API](https://developers.home-assistant.io/docs/api/websocket/)
- [TEMPLATE_GUIDE.md](./TEMPLATE_GUIDE.md) — Ingress routing, DevContainer patches, CI/CD details
