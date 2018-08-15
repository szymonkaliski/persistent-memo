const fetch = require("node-fetch");

const { memoAsync, memoSync } = require("./index");

const asyncTest = async () => {
  memoAsync.cache.invalidate();

  const fetchRes = await memoAsync(async input => {
    return await fetch("https://reqres.in/api/users?delay=1")
      .then(res => res.json())
      .then(res => ({
        res,
        input
      }));
  });

  console.time("res1");
  console.log(await fetchRes("test 1"));
  console.timeEnd("res1");

  console.time("res2");
  console.log(await fetchRes("test 2"));
  console.timeEnd("res2");

  console.time("res3");
  console.log(await fetchRes("test 2"));
  console.timeEnd("res3");
};

const syncTest = () => {
  memoSync.cache.invalidate();

  const slowOp = memoSync(n => {
    let res = 1;

    for (let i = 1; i < n; i++) {
      res += Math.sqrt(n, i);
    }

    return res;
  });

  console.time("res1");
  console.log(slowOp(1000));
  console.timeEnd("res1");

  console.time("res2");
  console.log(slowOp(100000));
  console.timeEnd("res2");

  console.time("res3");
  console.log(slowOp(100000));
  console.timeEnd("res3");

  console.time("res4");
  console.log(slowOp(100000));
  console.timeEnd("res4");
};

const test = async () => {
  await asyncTest();
  console.log();
  syncTest();
};

test();
