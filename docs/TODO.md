- finish URL overhaul:
  - fix resources/* to match new URL structure (grabbing updated id names, etc)
  - update method should ever only modify that element, never children  
  - resource index handlers should just list that resource in the current set
    - we'll probably want a different set of endpoints to list all across sets.
  - fix tests
  - fix commands
  - verify that we have 1:1 between models and endpoints

- implement check-tree and clean-tree commands. add more commands if needed.
  - get a server-instance up and running, inject, etc.

- tree delete. first test that this is required.
  - judging by how many orphaned child objects I'm now seeing, yes we do need to do a tree delete.

- consider adding some metadata like createdTime, createdBy (user id)

- then take a stab at: {users | samples | basic UI | sequencer engine}
  - user stuff: name, location in doc. me.

- what conflict scenarios do we have?
  - the main scenario where two users are editing the same pattern. do we need some sense of "recently touched" or can it be simpler than that?

- (before ship): really ought to do some authentication in here. would be a shame if somebody just grabbed the index then deleted each.
  - in particular, in all resource handlers, we should pull the set and authenticate against it. Right now we usually don't need the set but we will for auth.
