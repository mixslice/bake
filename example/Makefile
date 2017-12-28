API_ROOT = http://localhost:3000

default:
	docker-compose up

daemon:
	docker-compose up -d

logs:
	docker-compose logs --follow

remove_files:
	find ./videos -type f \
		-not -name '42452a7*' \
		-not -name '4f7b022*' \
	  -not -name '77b2229*' \
		-not -name '.keep' \
		-print0 | xargs -0 rm --

stop:
	docker-compose stop

rm: stop
	docker-compose rm
	docker volume ls | grep demo_redis | xargs docker volume rm

clean: remove_files rm

render:
	curl -H 'Content-Type: application/json' $(API_ROOT)/render

export:
	curl -H 'Content-Type: application/json' $(API_ROOT)/export
