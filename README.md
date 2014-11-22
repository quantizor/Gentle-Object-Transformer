Gentle Object Transformer
=========================

Walks through complex objects and transforms the destination into the source without outright replacement.

Useful for 2-way databound frameworks because it allows existing views to not be destroyed if they don't need to be.

1. Update matches between source and destination
2. Remove destination items not in source
3. Add source items not in destination

Matches array items based on properties ending in `_id` (change this to your ID syntax)

**NOTE** This uses some ES5 features like `Object.keys` and `Array.filter`. If you need it to work in browsers
older than IE9, I recommend either monkeypatching the prototypes or looking into a library like lodash.
