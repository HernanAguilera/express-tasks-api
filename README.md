# Tasks API

## Getting Started

### Prerequisites

- Node.js >= 20
- Docker y Docker Compose

### Installation

1. Clone the repository

```bash
git clone https://github.com/hernanaguilera/express-tasks-api.git
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory and add the following content:

```bash
PORT=3000
DB_ENVIRONMENT=development
DB_DIALECT=postgres
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=expresstasks
DB_HOST=localhost
DB_PORT=5432
```

Replace the values with your own.

4. Set the JWT_SECRET variable in the `.env` file

```bash
JWT_SECRET=secret
```

Below is a recommended way to generate the code used in the JWT_SECRET variable (using the crypto library of Node.js):

```bash
require('crypto').randomBytes(64).toString('hex')
```

Replace the value with your own.

4. Run docker-compose

```bash
docker-compose up -d
```

5. Initialize the database

```bash
npm run db:init
```

6. Run the application

```bash
npm run dev
```

7. Open your browser and navigate to `http://localhost:3000/api`

## Usage

### Register a new user

To register a new user, send a POST request to the `/users` endpoint with the following body:

```json
curl -X POST \
  http://localhost:3000/api/users \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password",
    "passwordConfirmation": "password"
  }
```

The response will be a JSON object with the following structure:

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john.doe@example.com",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z"
}
```

### Login a user

To login a user, send a POST request to the `/login` endpoint with the following body:

```json
curl -X POST \
  http://localhost:3000/api/login \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "john.doe@example.com",
    "password": "password"
  }
```

The response will be a token:

```json
{
  "token": "..."
}
```

### Create a new task

To create a new task, send a POST request to the `/tasks` endpoint with the following body:

```json
curl -X POST \
  http://localhost:3000/api/tasks \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "Buy groceries",
    "description": "Buy groceries for the weekend",
  }
```

The response will be a JSON object with the following structure:

```json
{
  "id": 1,
  "title": "Buy groceries",
  "description": "Buy groceries for the weekend",
  "status": "pending"
}
```

### Get all tasks

To get all tasks, send a GET request to the `/tasks` endpoint.

The response will be a JSON array with the following structure:

```json
curl -X GET \
  http://localhost:3000/api/tasks
```

Response:

```json
[
  {
    "id": 1,
    "title": "Buy groceries",
    "description": "Buy groceries for the weekend",
    "status": "pending"
  },
  {
    "id": 2,
    "title": "Clean the house",
    "description": "Clean the house",
    "status": "completed"
    ...
  }
]
```

### Complete a task

To complete a task, send a PUT request to the `/tasks/{id}` endpoint, where `{id}` is the ID of the task you want to complete.

The request body should be a JSON object with the following structure:

````bash
curl -X PUT \
  http://localhost:3000/api/tasks/1 \
  -H 'Content-Type: application/json' \
  -d '{
    "status": "completed"
  }

Response:

```json
{ "id": 1,
  "title": "Buy groceries",
  "description": "Buy groceries for the weekend",
  "status": "completed"
}
````

### Delete a task

To delete a task, send a DELETE request to the `/tasks/{id}` endpoint, where `{id}` is the ID of the task you want to delete.

The response will be an empty JSON object.

Example request:

```bash
curl -X DELETE https://api.example.com/tasks/1
```

Response:

```json
{ "message": "Task deleted successfully" }
```
