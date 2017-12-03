import * as ok from '@src/ts/main';

import * as mocha from 'mocha';
import * as chai from 'chai';

import { setTimeout } from 'timers';

function test(): void {
	const tgt: c.IStore = new c.IStore(
		c.state, new c.Updators(), new c.Publishers(), new c.Getters(),
	);
	describe('@src/ts/main', () => {
		describe('getters', () => {
			it('function works.', () => {
				let a: string = tgt.getters.a().a;
				chai.assert.strictEqual(a, 'a');
			});
		});
		describe('updators', () => {
			it('function works.', () => {
				let a: string;
				tgt.updators.a(() => ({ a: 'changed' }));
				a = tgt.getters.a().a;
				chai.assert.strictEqual(a, 'changed');
				tgt.updators.a(() => ({ a: 'a' }));
			});
		});
		describe('publishers', () => {
			it('function works.', (done) => {
				let a: string;
				let cnt: number = 0;
				tgt.publishers.a((p) => {
					a = tgt.getters.a().a;
					if (cnt === 0) {
						chai.assert.strictEqual(a, 'a');
					} else if (cnt === 1) {
						chai.assert.strictEqual(a, 'changed');
						done();
					}
					cnt++;
				});
				tgt.updators.a(() => ({ a: 'changed' }));
			});
		});
	});
}

/**
 * Constants.
 *
 */
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

test();
