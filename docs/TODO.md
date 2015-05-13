- currently blocked: issue when updating a row step.
  - it works now, after working around an issue with mongoose where child ids were being serialized incorrectly
    - (but only from web client. test succeeded. some fields were missing, maybe lack of _id confused mongoose?
  - another issue which is nonfatal (doesn't corrupt db like serialization one):
    - step data appears as a bunch of unicode in mongo query, is that bad?
	- resolved: this appears to be some kind of mongoose logging bug. data over wire and in db looks fine.
  - TODO: delete this comment

- working on basic UI for now.
  - other pages.

- consider adding some metadata like createdTime, createdBy (user id)

- user stuff: name, location in doc. me.

- document json over wire has both id and _id for pretty much every item, bloating payload significantly.

- what conflict scenarios do we have?
  - the main scenario where two users are editing the same pattern. do we need some sense of "recently touched" or can it be simpler than that?

- (before ship): really ought to do some authentication in here. would be a shame if somebody just grabbed the index then deleted each.
  - in particular, in all resource handlers, we should pull the set and authenticate against it. Right now we usually don't need the set but we will for auth.

- get page->view destroy chain working when we nav around.
