#!/usr/bin/env bash
cd /var/www/verstack.io/verstack-ihm

# Variables d'env — adapte si tu veux
export NODE_ENV=production
export PORT=4000
export API_BASE_URL=http://127.0.0.1:3000

# Ta commande qui fonctionne déjà à la main
node dist/verstack-ihm/server/server.mjs
