# RMMS - MCHG

## Requirements

- PHP 7
- MySQL 8
- Composer
- NodeJS
- NPM
- Yarn

## Installation

1. `git clone https://github.com/avidianity/rmms.git`
2. `cd backend && composer install`
3. `cd ../frontend && yarn`

Create `.env` file in `backend` folder using `.env.example` file and put correct database credentials.

Example:

```config
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=rmms
DB_USERNAME=rmms
DB_PASSWORD=rmms
```

In `backend` folder, run the following commands in order:

1. `php artisan key:generate`
2. `php artisan migrate`

Create `.env` file in `frontend` folder using `.env.example` file and put correct backend url.

Example

```config
REACT_APP_BACKEND_URL=http://localhost:8000
```

## Serving the System

- Backend: `php artisan serve`
- Frontend: `yarn start`
