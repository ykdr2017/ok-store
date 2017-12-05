# ok-store

[![Build Status](https://travis-ci.org/ykdr2017/ok-store.svg?branch=master)](https://travis-ci.org/ykdr2017/ok-store)

## ABOUT ok-store

This is a set of TypeScript/JavaScript classes that provides observable object as the Store.
The Store here is used for what we call Model(of MVC, MVVM), State and/or Store(of Flux, Redux) in the context of web applications.
An instance of its Store class can keep states of view, and handle changes of them.

## INSTALL

```Shell
$ npm install ok-store
```

## USAGE (TypeScript)

### Create a Store

At first you define a state extending ok.State,
and create a store that extending ok.Store .

The state includes Items instance.
Items instance is an associative array that keeps state of the Store.
Items instance is variable by Updators, observable by Publishers,
and referable by Getters method in the Store.

```TypeScript
/* ExampleStore.ts */

import * as ok from "ok-store";

/* STATE */
class Items {
	public a: string = 'a';
	public b: number = 0;
	public c = {
		a: 'ca',
		b: 1,
		c: {
			a: 'cca',
			b: 1,
		},
	};
}
class IState extends ok.State<Items> {
	constructor(i: Items) { super(i); }
}
let state: IState = new IState(new Items());

/* STORE */
class Updators {
	public a = state.createUpdator<{a: string}>((i, u) => { i.a = u.a; });
}
class Publishers {
	public a = state.createPublisher<{a: string}>((i) => ({ a: i.a }));
}
class Getters {
	public a = state.createGetter<{a: string}>((i) => ({ a: i.a }));
}
class IStore extends ok.Store<Items, Updators, Publishers, Getters> {
	constructor(s: ok.State<Items>, u: Updators, p: Publishers, g: Getters) {
		super(s, u, p, g);
	}
}
export default const store: IStore = new IStore(
    state, new Updators(), new Publishers(), new Getters(),
);
```

### Use the Store

`store.getters` can get current parameter of the Store.
Each getters methods will get transformed objects from the original Items by the store definition above.
So you can get suitable value for each view or other communications.

```TypeScript
/* ExampleApp1.ts */

import store from "./ExampleStore";

let a: string = store.getters.a().a;

console.log(a); // => 'a'
```

`store.updators` can update the Store.
Each updators methods require certain object argument by the store definition 
(just like payload of Redux Action).

```TypeScript
/* ExampleApp2.ts */

import store from "./ExampleStore";

let a: string;

store.updators.a(() => ({ a: 'changed' }));
a = store.getters.a().a;

console.log(a); // => 'changed'

```

`store.publishers` can call functions when the Store is updated.
Each publishers methods can refer certain object transformed from the store items by function argument.

```TypeScript
/* ExampleApp3.ts */

import store from "./ExampleStore";

let a: string;
let cnt: number = 0;

store.publishers.a((p) => {
    a = p.a;
    if (cnt === 0) {
        console.log(a); // => 'a'
    } else if (cnt === 1) {
        console.log(a); // => 'changed'
    }
    cnt++;
});

store.updators.a(() => ({ a: 'changed' }));
```

By setting a view rendering method (like ReactDOM.render) in publishers,
you can use the store as a data bindings utility.

## DEVELOP

```Shell
$ npm install
$ npm run build:main
```

## TEST

```Shell
$ npm test
```
