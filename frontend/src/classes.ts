export class Symbol {
	protected key: number;

	constructor(description: number) {
		this.key = description;
	}

	getKey() {
		return this.key;
	}
}

export class EventBus {
	protected callbacks: { [key: string]: Function[] } = {};

	dispatch(key: string, value: any) {
		if (!(key in this.callbacks)) {
			return;
		}

		this.callbacks[key].forEach((callback) => callback(value));

		return this;
	}

	listen<T>(key: string, callback: (args: T) => void) {
		if (!(key in this.callbacks)) {
			this.callbacks[key] = [];
		}

		return new Symbol(this.callbacks[key].push(callback) - 1);
	}

	unlisten(key: string, symbol: Symbol) {
		if (!(key in this.callbacks)) {
			return;
		}
		this.callbacks[key].splice(symbol.getKey(), 1);
	}
}
