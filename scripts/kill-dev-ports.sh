#!/usr/bin/env bash
# macOS / Linux: завершить процессы, слушающие указанные TCP-порты.
# Использование: npm run kill-ports
#            или: bash scripts/kill-dev-ports.sh 8080 8766

set -u

ports=("$@")
if [ ${#ports[@]} -eq 0 ]; then
  ports=(8080 8081 8082 8765 8766 3000 5173 5174)
fi

for p in "${ports[@]}"; do
  pids=$(lsof -ti ":$p" 2>/dev/null || true)
  if [ -z "$pids" ]; then
    echo "Порт $p: слушатель жоқ"
    continue
  fi
  echo "Порт $p: PID $pids — тоқтату…"
  kill -15 $pids 2>/dev/null || true
  sleep 0.2
  pids2=$(lsof -ti ":$p" 2>/dev/null || true)
  if [ -n "$pids2" ]; then
    kill -9 $pids2 2>/dev/null || true
  fi
  if lsof -ti ":$p" >/dev/null 2>&1; then
    echo "Порт $p: әлі бос емес"
  else
    echo "Порт $p: босатылды"
  fi
done
