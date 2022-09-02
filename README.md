# Decentralized Autonomous Space (DAS) on Stacks

Buildings that own and run themselves: this idea, from the think-​tank Dezentrum, was put into action for the first time at ETH Zurich in the form of a prototype. The result is a meditation cabin that shakes up the usual economic and social expectations. With this project, we aim show the feasability of the concept of Decentralized Autonomous Space (DAS) on the Stacks Blockchain. Decentralized Autonomous Organizations (DAOs) are a promising organizational form for companies, infrastructure and public goods with the potential for more efficient and fair resource allocation.

## Background

In the last months, there was a first study that examined a DAO that owns physical (and not only digital) assets. This should open up an array of new possibilities for DAOs. As a first result, the no1s1 prototype has been built - a physical space that owns itself and manages itself over an open and distributed platform.

## Implementation

Our implementation is intended to show that this concept of a DAS can also be applied to the STX chain. Due to the smart contract functionalities and the fact that it is the Bitcoin ecosystem, we consider this to be beneficial.

## Get startet

### Contracts

To run it locally, the following steps have to be performed.

- Install [Clarinet](https://github.com/hirosystems/clarinet)
- Spawn a local Devnet
  - You can use Clarinet to deploy your contracts to your own local offline environment for testing and evaluation on a blockchain. Use the following command:

```bash
$ clarinet integrate
```

Make sure that you have a working installation of Docker running locally.

### Frontend

```sh
## Move into /frontend folder
$ cd frontend

# Install dependencies
$ npm install

# Enable husky
$ npm install husky --save-dev

# Start dev server
$ npm run dev
```

In the following file [`frontend/providers/StacksAuthProvider.tsx`](/frontend/providers/StacksAuthProvider.tsx) change to

```javascript
//const network = new StacksTestnet()
const network = new StacksMocknet();
```

The `next.config.js` file should changed as well.

```javascript
module.exports = {
  reactStrictMode: true,
  env: {
    REACT_APP_NETWORK_ENV: "mocknet", // From testnet to mocknet
    REACT_APP_CONTRACT_ADDRESS: "CHANGE TO YOUR DEPLOYER ADDRESS",
    REACT_APP_TOKEN_CONTRACT_NAME: "DAS",
    CONTRACT_PRIVATE_KEY: undefined,
    LOCAL_STACKS_API_PORT: 3999,
    // API_SERVER: undefined,
  },
  //https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
  reactStrictMode: false,
};
```

## Have fun trying out!

## Features

- ESLint and Prettier are integrated with VSCode to fix and format code on save (you need eslint and prettier VSCode plugins)
- lint-staged: linting will only happen on staged files, not all file
- Latest Husky
- TypeScript types are checked before each commit
