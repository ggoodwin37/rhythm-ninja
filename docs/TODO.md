
- working on basic UI for now.
  - now we need to fetch the set from the api.
  - fill in set templates with set data.
  - figure out how the "add" row will work in the template.
  - links to other pages.
  - other pages.
  - give it at least a quick once-over to not look too crappy.


- consider adding some metadata like createdTime, createdBy (user id)

- user stuff: name, location in doc. me.

- what conflict scenarios do we have?
  - the main scenario where two users are editing the same pattern. do we need some sense of "recently touched" or can it be simpler than that?

- (before ship): really ought to do some authentication in here. would be a shame if somebody just grabbed the index then deleted each.
  - in particular, in all resource handlers, we should pull the set and authenticate against it. Right now we usually don't need the set but we will for auth.
