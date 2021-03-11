docker run \
  --rm -d --name postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -v data:/var/lib/postgresql/data:z \
  postgres
