- naming of owned collections in the API isn't perfectly consistent, fix this for maximum analness

- implement check-tree and clean-tree commands. add more commands if needed.

- consider adding some metadata like createdTime, createdBy (user id), testFlag

- tree delete. first test that this is required.
  - judging by how many orphaned child objects I'm now seeing, yes we do need to do a tree delete.

- then take a stab at: {users | samples | basic UI | sequencer engine}
  - user stuff: name, location in doc. me.

- what conflict scenarios do we have?

