build-image:
	docker build --build-arg DATABASE_URL='postgresql://postgres:8nW7CBVNqdKOcVwbztyRZ1VPNDx@db.wxdjvetpajrkagcyyahc.supabase.co:5432/postgres' --compress -t nda-back .

run:
	docker run -i -t --rm --env-file=./.env -p=1337:1337 -p=5432:5432 --name="nda-back" nda-back

up: build run

stop: ## Stop and remove a running container
	docker stop nda-back; docker rm nda-back