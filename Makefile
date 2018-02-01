rmi: stop-test
	docker rmi $(docker ps -l -q) 2>&1 > /dev/null

build:
	docker build -t 320246095218.dkr.ecr.us-east-1.amazonaws.com/fetch/webhooks:latest .

stage:
	docker build -t 320246095218.dkr.ecr.us-east-1.amazonaws.com/fetch/webhooks:staging .

publish:
  BUILD=320246095218.dkr.ecr.us-east-1.amazonaws.com/fetch/webhooks:staging
  docker push $(BUILD)

publish-stage: stage publish

version: build
	docker tag 320246095218.dkr.ecr.us-east-1.amazonaws.com/fetch/webhooks:latest 320246095218.dkr.ecr.us-east-1.amazonaws.com/fetch/webhooks:$(FETCH_LATEST_VERSION)

start-test: stop-test build
	docker run -p 4873:4873 --name fetch/webhooks 320246095218.dkr.ecr.us-east-1.amazonaws.com/fetch/webhooks:latest
	docker logs $(docker ps -l -q)

stop-test:
	-docker rm -f $(docker ps -l -q) 2>&1 > /dev/null

test: build
	docker run --rm -i -t 320246095218.dkr.ecr.us-east-1.amazonaws.com/fetch/webhooks:latest

run: build
	docker run -it 320246095218.dkr.ecr.us-east-1.amazonaws.com/fetch/webhooks:latest

logs:
	docker logs $(docker ps -l -q)

publish:
	docker push 320246095218.dkr.ecr.us-east-1.amazonaws.com/fetch/webhooks:latest

deploy: test version
	docker push 320246095218.dkr.ecr.us-east-1.amazonaws.com/fetch/webhooks:$(FETCH_LATEST_VERSION)

test: start-test
