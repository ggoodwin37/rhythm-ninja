- we stopped calling toJSON on the api/resources layer, does this mean we're serializing a ton of extra shit? check wire.
  - yeah I think so. why did we stop using toJSON again? if it was just because we needed key, can use a derived prop for that (id).

- might as well add an index for test1 too

- intermittent test failure on second pool entry something or other. add some extra logging/tests around this.
  - haven't seen this for a while....added a test for it. timing?

- consider adding some metadata like createdTime, createdBy (user id), testFlag

- tree delete. first test that this is required.


- then take a stab at: {users | samples | basic UI | sequencer engine}
  - user stuff: name, location in doc. me.

- what conflict scenarios do we have?

