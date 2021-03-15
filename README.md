# Minecraft UUID Cache for Usernames

Cache Minecraft Usernames to their UUIDs for 37 days to increase performance.

## Implementation:

Run `npm i minecraft-uuid-cache` in your console.

Entering UUIDs without dashes will automatically convert with dashes sending no requests.

If no data has been cached for the username in 37 days it will send a request to Mojang.

```js
const getUUID = require('./index');

getUUID("eea2d4fd-a8b8-413b-9439-f06faaf7e109")
    .then(console.log) // Result
    .catch(console.log); // Error
```

