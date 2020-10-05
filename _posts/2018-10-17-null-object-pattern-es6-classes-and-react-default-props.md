---
layout:   post
title:    <span class='nowrap'>Null Object pattern</span>, <span class='nowrap'>ES6 default params</span> and <span class='nowrap'>React defaultProps</span>
subtitle: "Stop checking for undefined or null."
date:     2018-10-17 00:16:53 +0100
hero_image:
  path:   /assets/images/null-object.png
  alt:    "Drawing of two dice: a traditional die with a different number of dots from 1 to 6 on each face; and a die with 'NULL' written on each face."
---
The Null Object pattern is a great tool for removing code conditionals. Rather than checking for `undefined` or `null`, the code instead returns a “null” implementation that responds to the same interface. We'll see how this pattern can be useful in the following 3 examples.

{toc}

### Vanilla JavaScript

Let's start with a simple function:
```javascript
function streetName(user) {
  if (user.address) {
    return user.address.streetName;
  } else {
    return 'Unknown street';
  }
}
```
We can remove its conditional by using the Null Object pattern:
```javascript
var nullAddress = { streetName: 'Unknown street' };
var defaultUserAttributes = { address: nullAddress };
var user = Object.assign(defaultUserAttributes, rawUser);

function streetName(user) {
  return user.address.streetName;
}
```
Now the `streetName` function is much simpler. Still, the complexity isn't gone: we just pushed it up the stack. However now we can be sure that a `user` will always have an `address` so we can remove all the checks for `user.address`. We can also add more behaviour to `nullAddress` and reuse it in other parts of our code.

### ES6

Let's now look at an ES6 class:
```javascript
class Cart {
  constructor(items, discount) {
    this.items = items;
    this.discount = discount;
  }

  itemCount() {
    return (this.items ? this.items.length : 0);
  }

  totalPrice() {
    if (!this.items) {
      return 0;
    }
    let price = this.items.reduce((sum, item) => sum + item.price, 0);
    if (this.discount) {
      return price - this.discount;
    }
    return price;
  }
}
```
In both methods we check for the existence of `items`.
We also check for the existence of `discount` once.

We can refactor away those conditionals with some default parameters:
```javascript
class Cart {
  constructor(items = [], discount = 0) {
    this.items = items;
    this.discount = discount;
  }

  totalPrice() {
    return this.items.reduce((sum, item) => sum + item.price, 0) - this.discount;
  }

  itemCount() {
    return this.items.length;
  }
}
```
Now the `totalPrice` and `itemCount` functions are much simpler. Since we can be sure that `items` is always an array we can remove all those type-checks and safely call any Array functions on `items`. And we can always count on having a `discount` (even if it's `0`).

### React

Finally, let's examine a React component:
```react
class Greeting extends React.Component {
  render() {
    let user = this.props.user;
    return (
      <div className="greeting">
        Hello, {user ? user.name : "Guest"}
      </div>
    );
  }
}
```
Again, that condition is unnecessary and makes the code that bit more difficult to read.

We could add a class constructor like in the previous example but instead we'll use React's `defaultProps`:
```react
class Greeting extends React.Component {
  render() {
    return (
      <div className="greeting">
        Hello, {this.props.user.name}
      </div>
    );
  }
}

Greeting.defaultProps = {
  user: {
    name: "Guest"
  }
};
```
This is an improvement! We avoided type-checking and made our component simpler.
Ideally though the `nullUser` (or `guest`) object would be created at the start of our application.
It's more than likely that other parts of our code would benefit from receiving this `guest` object instead of a `user` that is `undefined`.

---

The Null Object pattern is an interesting approach we can take to simplify our code; but it's not without its problems. For instance, if we had called `user.fullName()` in the last example our `guest` object would have blown up since it does not implement that method. This means we must always ensure (with tests) that our Null Object implements the same interface of the object it replaces.

In any case, this is a simple pattern that you can apply to reduce code complexity. Good object-oriented programming is about telling objects what you want done, not querying an object and acting on its behalf. Stop asking if something or one of its properties is `undefined` before making a decision on what to do. Tell that something what you want to be done.

Tell, don't ask!
