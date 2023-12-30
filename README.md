# Kiosk e2e test.

This project is create a simple sui e2e test ground running on the testnet to experiment with kiosk. Key main feature to test is running a simple game from within kiosk.

live at: https://kiosk-tone.pages.dev/

## Project bootstrap.

standard sui move init.

```bash
sui move new ...
```

initialise a frontend with @mysten/dapp template, and uses the kiosk SDK. Will try to minimalise boilerplate later.  

```bash
pnpm create @mysten/dapp --template react-client-dapp
```

project architecture need some work, mainly around handling data and signing and executing.  