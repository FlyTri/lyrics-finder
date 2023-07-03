# lyrics-finder

This repository contains code for retrieving song information and lyrics from Google and Musixmatch. The code is written in TypeScript and uses the JSDOM library for DOM manipulation and axios for making HTTP requests.

## Installation

npm:

```bash
npm i @flytri/lyrics-finder
```

yarn:

```bash
yarn add @flytri/lyrics-finder
```

## Example usage

```js
const { Google, Musixmatch } = require("@flytri/lyrics-finder");

Google("2 phút hơn").then(console.log);
Musixmatch("2 phút hơn").then(console.log);
```

## License
This code is provided under the **MIT License**. Feel free to modify and use it in your projects.
