# nodejs-net-http-example

Simple NodeJS HTTP server examples (using core net module)

## To start app run

```bash
node index.js
```

Application accepts connections on 127.0.0.1:8000

## Description

Example Users CRUD app using NodeJS `net` module.

Endpoints:

- `POST /users` - create a user
- `GET /users` - get all users
- `GET /users/{userId}` = get a single user
- `DELETE /users/{userId}` - delete user
- `PUT /users/{userId}` - update user
