- touch up ui for samples. add a hook for our web audio test player. consider metadata editing. flag if in pool.


// near term

- posting sample metadata: we need another endpoint for metadata updates. We can pick defaults on sample (blob) post,
    - then they can go back and edit it. I think this will actually be slightly easier for user too.

- samples
  - need to be able to play a sample using webAudio as a proof of concept. browser playing wavs works.

- grep 'WHY IS THIS TRIGGERING SO MUCH', something is firing too much. can't tell if subviews leaking or just overrendering.
  - could be related to loading states changing

- get page->view destroy chain working when we nav around.
  - ensure subviews are destroyed

up next:
- do a TODO pass to find pressing stuff.
- flesh out UI just enough
- pick next big task:
  - audio client
  - react ui
  - dirty/conflict basics
  - ??

// backlog

- really need to do some watchify stuff for less, client, and server.

- consider adding some metadata like createdTime, createdBy (user id)

- document json over wire has both id and _id for pretty much every item, bloating payload significantly.

- what conflict scenarios do we have?
  - the main scenario where two users are editing the same pattern. do we need some sense of "recently touched" or can it be simpler than that?

- make loading UI common

- resume working on users and auth:
  - need to make concept of users, Me, set ownership 1st class (see wolves code for example of Me)
    - do users have a concept of location within a set?
  - need to do authorization (we have authentication, but any authenticated user can do anything to any data right now).
  - (add more auth providers besides just twitter)

- think through the model/subview/loaded story more, right now we're kind of haphazardly passing things around.
  - probably leaking more info than needed
  - possibly race conditions lurkin

- consider ripping out mongo and slapping in mysql.
  - There was no real reasoning behind the mongo choice in the first place.
  - getting away from an orm will help with some of the trickier hierarchy issues you've hit.

- switch from tabs to spaces, for the love of god
- "use strict"

- bug: pool -> set -> pool, "Upload samples" link no longer works.
