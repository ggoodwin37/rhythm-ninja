- working on users and auth right now:
  - just plugged in bell and hapi-auth-cookie, need to apply session scheme to endpoints and do user check
  - need to make concept of users, Me, set ownership 1st class (see wolves code for example of Me)
    - do users have a concept of location within a set?
  - add more auth providers besides just twitter
  - need a 401 page etc.



up next:
- do a TODO pass to find pressing stuff.
- flesh out UI just enough
- pick next big task:
  - basic sample playback in web audio -> loading sample from db -> uploading samples -> audio client
  - react ui
  - dirty/conflict basics
  - ??

// backlog

- consider adding some metadata like createdTime, createdBy (user id)

- document json over wire has both id and _id for pretty much every item, bloating payload significantly.

- what conflict scenarios do we have?
  - the main scenario where two users are editing the same pattern. do we need some sense of "recently touched" or can it be simpler than that?

- get page->view destroy chain working when we nav around.
