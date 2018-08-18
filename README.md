# persistent-memo

Like memoize, but persists on local filesystem (node) or `localStorage` (browser).

This module works great with tools that do live-reload (`nodemon`, `budo`, etc.) - expensive computations and fetches can be cached so live-reload feels instantaneous.

## Installation

`npm install persistent-memo`

## Usage

```js
const fetch = require("node-fetch");
const { memoAsync, memoSync } = require("persistent-memo");

const asyncTest = async () => {
  // invalidate cache if needed, usually not required
  // memoAsync.cache.invalidate();

  const fetchTest = await memoAsync(async input => {
    return await fetch("https://reqtest.in/api/users?delay=1")
      .then(test => test.json())
      .then(test => ({
        test,
        input
      }));
  });

  // this will be slow
  console.time("test1");
  console.log(await fetchTest("test 1"));
  console.timeEnd("test1");

  // this will be slow
  console.time("test2");
  console.log(await fetchTest("test 2"));
  console.timeEnd("test2");

  // this will be fast - cached!
  console.time("test3");
  console.log(await fetchTest("test 2"));
  console.timeEnd("test3");
};

const syncTest = () => {
  // invalidate cache if needed, usually not required
  // memoSync.cache.invalidate();

  const slowOp = memoSync(n => {
    let x = 1;

    for (let i = 1; i < n; i++) {
      x += Math.sqrt(n, i);
    }

    return x;
  });

  // this will be slow
  console.time("test1");
  console.log(slowOp(1000));
  console.timeEnd("test1");

  // this will be slow
  console.time("test2");
  console.log(slowOp(100000));
  console.timeEnd("test2");

  // this will be fast - cached!
  console.time("test3");
  console.log(slowOp(100000));
  console.timeEnd("test3");
};

const test = async () => {
  await asyncTest();
  syncTest();
};

test();
```

