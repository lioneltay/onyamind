# Tasks

- [ ] drag and drop

  - [ ] drag doesnt work on mobile
  - [ ] lock drag to vertical only

- [ ] only allow multiple check if selecting all completed or all incomplete

* [ ] text truncate not working for title

  - [ ] text truncate not working on mobile?

* [ ] polish readme

* [ ] performance review (laggy?)

  - [ ] context actions references (in callbacks data can be stale)

* [ ] animate saving text in edit modal

- [ ] Refactor state management

  - [ ] really think about a good way to integrate observables

- [x] Drawer menu

  - [x] Account details
  - [x] login
  - [x] Multiple lists
  - [x] set primary list
  - [x] Set current viewing list
  - [x] If no list, create primary task list by default
  - [x] when items are added, add them to the current list
    - [x] increment task count
  - [x] modify list observable to fetch a certain list
  - [ ] when auth status changes, need to refresh current selected list id
  - [ ] distinguish between completed and incompleted task counts

- [ ] security
