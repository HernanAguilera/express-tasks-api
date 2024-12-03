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

4. Create a `.env` file in the root directory and add the following content:

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
