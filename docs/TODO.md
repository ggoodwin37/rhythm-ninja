- naming of owned collections in the API isn't perfectly consistent, fix this for maximum analness

- implement check-tree and clean-tree commands. add more commands if needed.
  - get a server-instance up and running, inject, etc.

- tree delete. first test that this is required.
  - judging by how many orphaned child objects I'm now seeing, yes we do need to do a tree delete.

- consider adding some metadata like createdTime, createdBy (user id)
- decided against adding a testFlag to everybody, but it might be a good idea to have it on the set. then we can use tree-delete to make sure test assets are cleaned up.

- then take a stab at: {users | samples | basic UI | sequencer engine}
  - user stuff: name, location in doc. me.

- what conflict scenarios do we have?
  - the main scenario where two users are editing the same pattern. do we need some sense of "recently touched" or can it be simpler than that?

- (before ship): really ought to do some authentication in here. would be a shame if somebody just grabbed the index then deleted each.
