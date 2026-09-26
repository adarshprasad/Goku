#!/usr/bin/env bash
# Native PostgreSQL on Fedora (no Docker). Run with: sudo bash scripts/fedora-postgres.sh
set -euo pipefail

DB_USER="${DB_USER:-tavaru}"
DB_PASS="${DB_PASS:-tavaru}"
DB_NAME="${DB_NAME:-tavaru}"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run: sudo bash scripts/fedora-postgres.sh"
  exit 1
fi

dnf install -y postgresql-server postgresql

if [[ ! -f /var/lib/pgsql/data/PG_VERSION ]]; then
  postgresql-setup --initdb
fi

systemctl enable --now postgresql

HBA=/var/lib/pgsql/data/pg_hba.conf
if [[ -f "$HBA" ]]; then
  sed -i -E 's/^(host[[:space:]]+all[[:space:]]+all[[:space:]]+127\.0\.0\.1\/32[[:space:]]+)(ident|peer|trust|md5|scram-sha-256)/\1scram-sha-256/' "$HBA"
  sed -i -E 's/^(host[[:space:]]+all[[:space:]]+all[[:space:]]+::1\/128[[:space:]]+)(ident|peer|trust|md5|scram-sha-256)/\1scram-sha-256/' "$HBA"
  if ! grep -qE '^host[[:space:]]+all[[:space:]]+all[[:space:]]+127\.0\.0\.1/32' "$HBA"; then
    printf '\nhost    all             all             127.0.0.1/32            scram-sha-256\n' >> "$HBA"
  fi
  systemctl reload postgresql
fi

# Role
if sudo -u postgres psql -tAc "SELECT 1 FROM pg_roles WHERE rolname='${DB_USER}'" | grep -q 1; then
  sudo -u postgres psql -c "ALTER ROLE ${DB_USER} WITH LOGIN PASSWORD '${DB_PASS}';"
else
  sudo -u postgres psql -c "CREATE ROLE ${DB_USER} LOGIN PASSWORD '${DB_PASS}';"
fi

# Database
if sudo -u postgres psql -tAc "SELECT 1 FROM pg_database WHERE datname='${DB_NAME}'" | grep -q 1; then
  sudo -u postgres psql -c "ALTER DATABASE ${DB_NAME} OWNER TO ${DB_USER};"
else
  sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME} OWNER ${DB_USER};"
fi

sudo -u postgres psql -d "$DB_NAME" -c "GRANT ALL ON SCHEMA public TO ${DB_USER};"
sudo -u postgres psql -d "$DB_NAME" -c "ALTER SCHEMA public OWNER TO ${DB_USER};"

echo
echo "Postgres is running. In ~/huduku/.env set:"
echo "DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@127.0.0.1:5432/${DB_NAME}"
echo
echo "Then as your normal user (not root):"
echo "  npx prisma db push"
echo "  npm run db:seed    # only if this database is empty"
