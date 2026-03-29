#!/usr/bin/env bash
set -euo pipefail

CONTAINER="stack-postgres"
DB_NAME="stack"
DB_USER="postgres"
DB_PASS="password"
DB_PORT="5432"
DB_URL="postgresql://${DB_USER}:${DB_PASS}@localhost:${DB_PORT}/${DB_NAME}"

usage() {
  echo "Usage: $0 [up|down|reset|status]"
  echo "  up     — start postgres container and run migrations (default)"
  echo "  down   — stop and remove the container"
  echo "  reset  — down + up (fresh database)"
  echo "  status — show container status"
  exit 1
}

ensure_env() {
  if [ ! -f .env ]; then
    echo "DATABASE_URL=\"${DB_URL}\"" > .env
    echo "Created .env"
  fi
}

wait_for_postgres() {
  echo "Waiting for postgres..."
  for i in $(seq 1 20); do
    if docker exec "${CONTAINER}" pg_isready -U "${DB_USER}" -q 2>/dev/null; then
      echo "Postgres is ready."
      return 0
    fi
    sleep 1
  done
  echo "Timed out waiting for postgres." >&2
  exit 1
}

cmd_up() {
  ensure_env

  if docker ps -q --filter "name=^${CONTAINER}$" | grep -q .; then
    echo "Container '${CONTAINER}' is already running."
  elif docker ps -aq --filter "name=^${CONTAINER}$" | grep -q .; then
    echo "Starting existing container '${CONTAINER}'..."
    docker start "${CONTAINER}"
  else
    echo "Creating container '${CONTAINER}'..."
    docker run -d \
      --name "${CONTAINER}" \
      -e POSTGRES_USER="${DB_USER}" \
      -e POSTGRES_PASSWORD="${DB_PASS}" \
      -e POSTGRES_DB="${DB_NAME}" \
      -p "${DB_PORT}:5432" \
      postgres:16-alpine
  fi

  wait_for_postgres
  echo "Running migrations..."
  bun drizzle-kit migrate
  echo "Done. DATABASE_URL=${DB_URL}"
}

cmd_down() {
  if docker ps -aq --filter "name=^${CONTAINER}$" | grep -q .; then
    docker rm -f "${CONTAINER}"
    echo "Container '${CONTAINER}' removed."
  else
    echo "Container '${CONTAINER}' not found."
  fi
}

cmd_reset() {
  cmd_down
  cmd_up
}

cmd_status() {
  docker ps --filter "name=^${CONTAINER}$" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

case "${1:-up}" in
  up)     cmd_up ;;
  down)   cmd_down ;;
  reset)  cmd_reset ;;
  status) cmd_status ;;
  *)      usage ;;
esac
