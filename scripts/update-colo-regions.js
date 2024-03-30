#!/usr/bin/env node
const fs = require('node:fs/promises');
const path = require('node:path');

async function work() {
  const res = await fetch('https://colo.cloudflare.chaika.me/?iataregion');
  const body = await res.json();

  await fs.writeFile(
    path.join(__dirname, '..', 'src', 'colo-to-region.json'),
    JSON.stringify(body.results),
    'utf8'
  );
}

work();
