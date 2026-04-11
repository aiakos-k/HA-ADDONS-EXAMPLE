#!/bin/bash
set -e

# Patch Home Assistant Supervisor for DevContainer development
# This script disables the 'docker_gateway_unprotected' and diagnostics errors
# that block Add-on installation in DevContainer environments.
#
# Usage:
#   ./patch_supervisor.sh
#   # oder integriert in dev.sh als ./dev.sh patch:supervisor
#
# Kann beliebig oft ausgeführt werden. Nach jedem Supervisor-Update/Neustart erneut ausführen!

# Patch diagnostics (os-agent)
echo "[patch_supervisor] Patching diagnostics..."
docker exec hassio_supervisor python3 -c "\
path = '/usr/src/supervisor/supervisor/api/supervisor.py'\
with open(path, 'r') as f:\n    content = f.read()\nold = '        if ATTR_DIAGNOSTICS in body:\\n            self.sys_config.diagnostics = body[ATTR_DIAGNOSTICS]\\n            await self.sys_dbus.agent.set_diagnostics(body[ATTR_DIAGNOSTICS])'\
new = '        if ATTR_DIAGNOSTICS in body:\\n            self.sys_config.diagnostics = body[ATTR_DIAGNOSTICS]\\n            try:\\n                await self.sys_dbus.agent.set_diagnostics(body[ATTR_DIAGNOSTICS])\\n            except Exception:\\n                pass'\
if old in content:\n    with open(path, 'w') as f:\n        f.write(content.replace(old, new))\n    print('PATCHED')\nelse:\n    print('already patched or pattern changed')\
"

# Patch firewall (systemd)
echo "[patch_supervisor] Patching firewall..."
docker exec hassio_supervisor python3 -c "\
path = '/usr/src/supervisor/supervisor/host/firewall.py'\
with open(path, 'r') as f:\n    content = f.read()\nold = '            self.sys_resolution.add_unhealthy_reason(\\n                UnhealthyReason.DOCKER_GATEWAY_UNPROTECTED\\n            )'\
new = '            pass  # Skipped in DevContainer'\
if old in content:\n    with open(path, 'w') as f:\n        f.write(content.replace(old, new))\n    print('FIREWALL PATCHED')\nelse:\n    print('already patched or pattern changed')\
"

echo "[patch_supervisor] Restarting Supervisor..."
docker restart hassio_supervisor

echo "[patch_supervisor] Done. Supervisor ist jetzt gepatcht. Add-on Installation sollte funktionieren!"
