- we stopped calling toJSON on the api/resources layer, does this mean we're serializing a ton of extra shit? check wire.
  - yeah I think so. why did we stop using toJSON again? if it was just because we needed key, can use a derived prop for that (id).
- user stuff. name, location in doc. me.
- what conflict scenarios do we have?

- api needs set/<name>/song-entry/<id> crud

- intermittent test failure on second pool entry something or other. add some extra logging/tests around this.
