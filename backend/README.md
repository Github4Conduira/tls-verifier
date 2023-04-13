# Reclaim backend

Backend is the communication base between provers and verifiers. It allows provers to store and share links to claims & proofs.
It also manages the minting process & allows franking of unverified claims

## Setup

1. Install postgres locally via docker: `docker run --name reclaim --env=POSTGRES_PASSWORD=test --env=POSTGRES_USER=test --env=POSTGRES_DB=reclaim -p 5432:5432 -d postgres`
2. Copy `src/.env.sample` to `src/.env.development` and `src/.env.test` 
3. set DB_URI in your `.env` files to `DB_URI=postgres://test:test@localhost:5432/reclaim`
4. Run `npm i` command
5. Run `npm run migrate` command to create the database structure
6. Run `npm run test` command
7. To start backend run `npm run start:tsc`

## Using with docker-compose
1. Put `DB_URI=postgres://test:test@host.docker.internal:5432/reclaim` in your `.env.production`
2. run `docker-compose build`
3. run `docker-compose up`