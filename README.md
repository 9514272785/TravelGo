# TravelGo

TravelGo is a React and Vite travel-planning demo with destination search, favourites, trips, and bookings.

## Run locally

Install dependencies:

```sh
npm ci
```

In one terminal, start the JSON Server API:

```sh
npx json-server --watch data/db.json --port 3500
```

In another terminal, start the Vite app:

```sh
npm run dev
```

Local development uses the JSON Server API. GitHub Pages uses the bundled destination data and stores demo bookings in the browser's local storage.

Email confirmations require the optional EmailJS values in a local `.env` file. Do not commit that file.

## Deployment

Pushing to `main` builds and deploys the app to [GitHub Pages](https://9514272785.github.io/TravelGo/).
