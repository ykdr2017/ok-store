import * as ok from '@src/ts/main';

import * as mocha from 'mocha';
import * as chai from 'chai';

import deepcopy from 'ts-deepcopy';

function test(): void {
	let tgt: ok.Store<c.Items, c.Updators, c.Publishers, c.Getters>;
	const initTgt = () => {
		c.items = new c.Items();
		c.state = new ok.State(c.items);
		tgt = new ok.Store(
			c.state, new c.Updators(), new c.Publishers(), new c.Getters(),
		);
	};
	describe('@src/ts/main', () => {
		describe('getters', () => {
			beforeEach(() => {
				initTgt();
			});
			it('function works.', () => {
				let a: string = tgt.getters.a().a;
				chai.assert.strictEqual(a, 'a');
			});
		});
		describe('updators', () => {
			beforeEach(() => {
				initTgt();
			});
			it('function works.', () => {
				let a: string;
				tgt.updators.a(() => ({ a: 'changed' }));
				a = tgt.getters.a().a;
				chai.assert.strictEqual(a, 'changed');
			});
		});
		describe('publishers', () => {
			beforeEach(() => {
				initTgt();
			});
			it('function works.', () => {
				let a: string;
				let cnt: number = 0;
				let firstPublished: boolean = false;
				tgt.publishers.a((p) => {
					a = p.a;
					if (cnt === 0) {
						firstPublished = (a === 'a');
					} else if (cnt === 1) {
						chai.assert.strictEqual(
							firstPublished && (a === 'changed'), true,
						);
					}
					cnt++;
				});
				tgt.updators.a(() => ({ a: 'changed' }));
			});
			it('getters in publishers listener provide items before update.', () => {
				let a: string;
				let oldState: { a: string } = { a: deepcopy(c.items).a };
				let gotState: { a: string };
				tgt.publishers.a((p) => {
					gotState = tgt.getters.a();
				});
				tgt.updators.a(() => ({ a: 'changed' }));
				chai.assert.strictEqual(oldState.a, gotState.a);
			});
		});
		describe('state items', () => {
			beforeEach(() => {
				initTgt();
			});
			it('keep immutable.', () => {
				let a: string;
				let oldState: { a: string } = { a: deepcopy(c.items).a };
				let newState: { a: string };
				tgt.publishers.a((p) => {
					newState = deepcopy(p);
				});
				tgt.updators.a(() => ({ a: 'changed' }));
				chai.assert.strictEqual((oldState.a !== newState.a), true);
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
	export let items: Items = new c.Items();
	export let state: ok.State<c.Items> = new ok.State(items);
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
}

test();
