- pick up here:
  - basic infrastructure for uploading UI is in place, needs styling and fleshing out.
  - uploading binary looks right-ish, start working on new models and do GET
    - immediate goal: verify we can roundtrip a WAV.


// near term

- samples
  - need to be able to upload samples to sample pool
    - good docs: https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications
  - need to be able to load samples from db to browser
  - need to be able to play a sample using webAudio

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

- get page->view destroy chain working when we nav around.
  - ensure subviews are destroyed

- extract slugger
- make loading UI common

- resume working on users and auth:
  - need to make concept of users, Me, set ownership 1st class (see wolves code for example of Me)
    - do users have a concept of location within a set?
  - need to do authorization (we have authentication, but any authenticated user can do anything to any data right now).
  - (add more auth providers besides just twitter)

- think through the model/subview/loaded story more, right now we're kind of haphazardly passing things around.
  - probably leaking more info than needed
  - possibly race conditions lurkin
