## Hermes DEFI

### Getting Started

This project was built using nextjs, chakra-ui, web3-react and react-query

To setup the project, you need the following:

#### Pre setup

0: `cp .env.example .env.local`
1: REDIS_URL - from upstash.com for caching homepage and tvl historical data (if you have a better idea how to get the tvl history, feel free to implement)
2: Add the URL to the `.env.local` in the `HERMES_REDIS_URL` key

#### Setup

0: run `yarn install` to install all packages
1: run `yarn dev` to start the development server

### Project Structure

This is the way the project is structured

- `./src` this is the main folder containing all source files
- `./public` this is the folder containing all images, fonts and static files
- `.github/workflows` this sets to cron job on github actions to run calculate the tvl data on intervals (currently set to 60 mins)

##### Src folder

- `./src/pages` this contains all pages, for almost all the pages the components and are all
  stored in the same file, except for the pools, farms and balancers which uses the PoolCard
  component (stored in the components folder)

- `./src/wallet` this contains all wallet related files, mostly for web3-react this included
  the connectors and the setup hooks

- `./src/web3-functions` this contains all functions that sends request to the blockchain,
  this is mostly for actions, prices and APR calculations which are used outside of the frontend

- `./src/hooks` this contains all 'major' hooks used in the application, from data fetching in
  the home page to queries and actions for pools, and also prices and contracts.

- `./src/config` this contains all ABIS, contract addresses, pool/farms/balancers configurations
  and also constants used in the app.

- `./src/component` this container all components, for layout, modals, wallet interations, pool-card and web3-manager.

##### Extra Notes on architecture

This application doesn't use redux for state management, therefore all data are fetched when the
page loads. For the farm related pages (pool, farms, balancers) the data is fetched in the page and
are passed down using reducers and context, this is to make action side-effects easier to do. All 3 farm related pages
all share the same component "PoolCard" and all use the same queries and methods. So becareful of changes made in that file.

### P.S

You're smarter, if you have any suggestions about how to make it better please don't hestitate to
tear it all down and make it better. <3.
