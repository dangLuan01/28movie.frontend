dev:
	npm run dev
build:
	npm run build && node .\dist\server\entry.mjs
run:
	node .\dist\server\entry.mjs