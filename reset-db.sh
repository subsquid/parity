set -e
# yarn run build
rm -rf db/migrations/*.js
npm run db:reset
npm run db:create-migration -n "paritytest" 
npm run db:migrate