export type MaybePromise<T> = T | Promise<T>;
export type MaybeAsyncFn<T> = () => MaybeAsyncIterator<any>;
export type MaybeAsyncIterator<T> = Iterator<MaybePromise<T> | MaybePromise<T>[]>;

function isPromise<T>(value: any): value is Promise<T> {
	return value && value.then !== undefined;
}

export function maybeAsync<R>(fn: MaybeAsyncFn<R>): MaybePromise<R> {
	let prev = undefined;
	for (const iter = fn();;) {
		const {value, done} = iter.next(prev);
		if (done)
			return value as MaybePromise<R>;

		if (isPromise(value))
			return resumeAsyncFn(value, iter);

		if (Array.isArray(value) && value.some(isPromise))
			return resumeAsyncFn(Promise.all(value), iter);

		prev = value;
	}
}

async function resumeAsyncFn<R>(value: MaybePromise<any>, iter: MaybeAsyncIterator<any>): Promise<R> {
	for (let prev = await value;;) {
		const {value, done} = iter.next(prev);
		if (done)
			return value as Promise<R>;

		if (isPromise(value)) {
			prev = await value;
		} else if (Array.isArray(value) && value.some(isPromise)) {
			prev = await Promise.all(value);
		} else {
			prev = value;
		}
	}
}

export default maybeAsync;
