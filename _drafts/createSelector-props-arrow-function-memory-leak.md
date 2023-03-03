"createSelector" props arrow function memory leak

https://github.com/sky-uk/nowtv-europe-tech/pull/149

https://github.com/sky-uk/nbcu-clients/issues/3075


reselect dependency is caching props (bound callbacks) and causing memory leaks

**Describe the bug**
reselect and its APIs (like `createSelector`) make it too easy to shoot oneself in the foot and cause memory leaks.

Some guidelines to avoid memory leaks would be:
* Prefer regular functions to arrow functions (and avoid using bind)
* Do not export selectors like this:
  ```js
  export const mySelector = createSelector(...);
  ```
  instead, do it like this:
  ```js
  const myMemoizedSelector = createSelector(...);
  export function mySelector(state, _props) {
    return myMemoizedSelector(state);
  }
  ```
  this will guarantee that props are not cached

A more definitive solution would be to move away from reselect and use some other dependency instead.

**Please complete the following information:**
 - Environment: all
 - Device: all

**Additional context**
See https://github.com/sky-uk/nbcu-clients/issues/3075
