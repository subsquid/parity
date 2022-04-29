process: migrate
	@node -r dotenv/config lib/processor.js

process-loop:
	while true; 	\
	do			\
	make process; \
	done;

serve:
	@npx squid-graphql-server


migrate: build
	@npx sqd db:migrate


migration: build
	@npx sqd db:create-migration Data


build:
	@npm run build


codegen:
	@npx sqd codegen


typegen: kusamaVersions.json
	@npx squid-substrate-typegen typegen.json


kusamaVersions.json:
	@make explore


explore:
	@npx squid-substrate-metadata-explorer \
		--chain wss://kusama-rpc.polkadot.io \
		--archive https://kusama.indexer.gc.subsquid.io/v4/graphql \
		--out kusamaVersions.json


up:
	@docker-compose up -d


down:
	@docker-compose down

update:
	@sqd squid update Parity-kusama@v3 --source https://github.com/subsquid/parity.git#v5

update-clean:
	@sqd squid update Parity-kusama@v3 --source https://github.com/subsquid/parity.git#v5 -r

release:
	@sqd squid release Parity-kusama@v3 --source https://github.com/subsquid/parity.git#v5

tail:
	@sqd squid tail Parity-kusama@v3 -f

restore-db:
	@pg_restore -h localhost -p 23798 -U postgres -v -d postgres < ../parity-kusama-v2.dump


.PHONY: process serve start codegen migration migrate up down