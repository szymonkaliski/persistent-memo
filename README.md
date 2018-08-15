# persistent-memo

Like memoize, but persists on local filesystem (node) or `localStorage` (browser).

This module works great with tools that do live-reload (`nodemon`, `budo`, etc.) - expensive computations and fetches can be cached so live-reload feels instantaneous.

## installation

`npm install persistent-memo`

## usage

```js
const fetch = require("node-fetch");

const { memoAsync, memoSync } = require("./index");

const asyncTest = async () => {
  // invalidate cache if needed, usually not required
  // memoAsync.cache.invalidate();

  const fetchRes = await memoAsync(async input => {
    return await fetch("https://reqres.in/api/users?delay=1")
      .then(res => res.json())
      .then(res => ({
        res,
        input
      }));
  });

  // this will be slow
  console.time("res1");
  console.log(await fetchRes("test 1"));
  console.timeEnd("res1");

  // this will be slow
  console.time("res2");
  console.log(await fetchRes("test 2"));
  console.timeEnd("res2");

  // this will be fast - cached!
  console.time("res3");
  console.log(await fetchRes("test 2"));
  console.timeEnd("res3");
};

const syncTest = () => {
  // invalidate cache if needed, usually not required
  // memoSync.cache.invalidate();

  const slowOp = memoSync(n => {
    let res = 1;

    for (let i = 1; i < n; i++) {
      res += Math.sqrt(n, i);
    }

    return res;
  });

  // this will be slow
  console.time("res1");
  console.log(slowOp(1000));
  console.timeEnd("res1");

  // this will be slow
  console.time("res2");
  console.log(slowOp(100000));
  console.timeEnd("res2");

  // this will be fast
  console.time("res3");
  console.log(slowOp(100000));
  console.timeEnd("res3");
};

const test = async () => {
  await asyncTest();
  console.log();
  syncTest();
};

test();
```

