import deepcopy from 'ts-deepcopy';
import deepequal = require('deep-equal');

/**
 * A Class which includes items and observers functions.
 * @param I Type of items.
 */
export class State<I> {
	/**
	 * @constructor
	 * @param items Items for UI model.
	 */
	constructor(items: I) {
		let __this: State<I> = this;
		__this.items = items;
		__this.itemsOld = deepcopy(__this.items);
	}
	/**
	 * Items for UI model.
	 * @type {I}
	 */
	protected items: I;
	/**
	 * Items' backup to compare differences when items has been updated.
	 * @type {I}
	 */
	protected itemsOld: I;
	/**
	 * Observer functions that runs when items has been updated.
	 * @param itn Current items.
	 * @param ito Old items before updated.
	 * @type {((itn: I, ito: I) => void)[]}
	 */
	protected observers: ((itn: I, ito: I) => void)[] = [];
	/**
	 * Runs observer functions.
	 * @returns {void}
	 */
	protected dispatch(): void {
		let __this: State<I> = this;
		let itemNow: I = deepcopy<I>(__this.items);
		let itemsOld: I = deepcopy<I>(__this.itemsOld);
		__this.itemsOld = deepcopy<I>(__this.items);
		__this.observers.map(f => {
			f(itemNow, itemsOld);
		});
	}
	/**
	 * Creates updator functions to update state items.
	 * @param Su Interface of argument for updating.
	 * @param fa Function that updates state items with updator argument.
	 * @param fo Function that prepares current paramater before update.
	 * @returns {(fu: (o?: Su) => Su) => void}
	 */
	public createUpdator<Su>(fa: ((i: I, u: Su) => void), fo?: ((i: I) => Su))
			: (fu: (o?: Su) => Su) => void {
		let __this: State<I> = this;
		return function (fu: (o?: Su) => Su): void {
			fa(__this.items, fu(fo ? fo(__this.items) : undefined));
			__this.dispatch();
		};
	}
	/**
	 * Creates publisher functions to run when state items are updated.
	 * @param Sp Interface of parameter for publishing.
	 * @param fa Function that converts updated state items to the parameter.
	 * @returns {(fp: (p: Sp) => void) => void}
	 */
	public createPublisher<Sp>(fa: ((i: I) => Sp))
			: (fp: (p: Sp) => void) => void {
		let __this: State<I> = this;
		return function (fp: (p: Sp) => void): void {
			let itemNow: Sp = fa(deepcopy<I>(__this.items));
			__this.observers.push(
				(itn: I, ito: I) => {
					let itemNew: Sp = fa(itn);
					if (!deepequal(itemNew, fa(ito))) fp(itemNew);
				},
			);
			fp(itemNow);
		};
	}
	/**
	 * Creates getter functions to get current state items.
	 * @param Sg Interface of parameter to get.
	 * @param fa Function that converts current state items to the parameter.
	 * @returns {Sg}
	 */
	public createGetter<Sg>(fa: ((i: I) => Sg)): () => Sg {
		let __this: State<I> = this;
		return function (): Sg {
			return fa(deepcopy<I>(__this.items));
		};
	}
}
/**
 * A Class which includes state and its managing classes.
 * @param I Type of items same witch is the same as state's.
 * @param U Class of uptator functions set.
 * @param P Class of publisher functions set.
 * @param G Class of getter functions set.
 */
export class Store<I, U, P, G> {
	/**
	 * @constructor
	 * @param state State instance for this store.
	 * @param updators Class instance of updator functions for the state.
	 * @param publishers Class instance of  publisher functions for the state.
	 * @param getters Class instance of getter functions for the state.
	 */
	constructor(state: State<I>, updators?: U, publishers?: P, getters?: G) {
		let __this: Store<I, U, P, G> = this;
		__this.state = state;
		__this.updators = updators;
		__this.publishers = publishers;
		__this.getters = getters;
	}
	/**
	 * State instance for this store.
	 * @type {State<I>}
	 */
	protected state: State<I>;
	/**
	 * Updator functions set for the state.
	 * @type {U}
	 */
	public updators: U;
	/**
	 * Publisher functions set for the state.
	 * @type {P}
	 */
	public publishers: P;
	/**
	 * Getter functions set for the state.
	 * @type {G}
	 */
	public getters: G;
}
