# ok-store

[![Build Status](https://travis-ci.org/ykdr2017/ok-store.svg?branch=master)](https://travis-ci.org/ykdr2017/ok-store)

## ABOUT ok-store

This is a set of TypeScript/JavaScript classes that provides observable kernel as the store.
The store here is used for what we call Model, State and/or Store in the context of web applications.
An instance of its Store class can keep states of view, and handle changes of them.

## INSTALL

```Shell
$ npm install ok-store
```
## USAGE

```TypeScript
import * as ok from "ok-store";

const tgt: c.IStore = new c.IStore(
    c.state, new c.Updators(), new c.Publishers(), new c.Getters(),
);

let a: string = tgt.getters.a().a;

console.log(a); // => 'a'

tgt.updators.a(() => ({ a: 'changed' }));
a = tgt.getters.a().a;

console.log(a); // => 'changed'

tgt.updators.a(() => ({ a: 'a' }));

let cnt: number = 0;

tgt.publishers.a((p) => {
    a = tgt.getters.a().a;
    if (cnt === 0) {
        console.log(a); // => 'a'
    } else if (cnt === 1) {
        console.log(a); // => 'changed'
        done();
    }
    cnt++;
});
tgt.updators.a(() => ({ a: 'changed' }));

namespace c {
	/* STATE */
	export class Items {
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
	export class IState extends ok.State<c.Items> {
		constructor(i: c.Items) { super(i); }
	}
	export let state: c.IState = new c.IState(new c.Items());
	/* STORE */
	export class Updators {
		public a = c.state.createUpdator<{a: string}>((i, u) => { i.a = u.a; });
	}
	export class Publishers {
		public a = c.state.createPublisher<{a: string}>((i) => ({ a: i.a }));
	}
	export class Getters {
		public a = c.state.createGetter<{a: string}>((i) => ({ a: i.a }));
	}
	export class IStore extends ok.Store<c.Items, c.Updators, c.Publishers, c.Getters> {
		constructor(s: ok.State<c.Items>, u: c.Updators, p: c.Publishers, g: c.Getters) { super(s, u, p, g); }
	}
}
```

## DEVELOP

```Shell
$ npm install
$ npm run build:main
```

## TEST

```Shell
$ npm test
```
