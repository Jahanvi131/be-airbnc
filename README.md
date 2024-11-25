# AirBNC

## Get Started

1. Clone the repo to your machine.
2. Open terminal and `cd` into the root of the directory.
3. In terminal check your Node version by running `node --version`

   a. If you do not have Node installed, go to the [Node website](https://nodejs.org/en/download) and follow the instructions to install it

   b. Once installed re-check Node version with `node --version`. We are using `v23.0.0`

## Project setup

1. In root directory [package.json] file have a all dependencies on which project is relay on so run `npm install` in the root of repo to install the necessary dependencies.

2. Create a `.env.test` file at the root level with the following content:

```
PGDATABASE=airbnc_test

```

3. Create a `.env.development` file at the root level with the following content:

```
PGDATABASE=airbnc

```

4. Run `npm run setup-dbs` to create the local test and development database.

5. Run `npm run seed` to seed the development database.

6. Run `npm test` where you can test your project functionalities with TDD in that case, this command also seed the test database.
