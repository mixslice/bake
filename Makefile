default:
	docker-compose up

compile:
	npm run build

build: compile
	docker-compose -f docker-compose.prod.yml build

run:
	docker-compose -f docker-compose.prod.yml up
