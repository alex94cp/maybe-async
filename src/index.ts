export type MaybePromise<T> = T | Promise<T>;

export type MaybeAsyncFn<T> = () => Iterator<MaybePromise<T>>;

function isPromise<T>(value: any): value is Promise<T> {
	return value.then !== undefined;
}

export function maybeAsync<T>(fn: MaybeAsyncFn<T>): MaybePromise<T> {
	const iter = fn();
	let prev = undefined;
	for (;;) {
		const {value, done} = iter.next(prev);
		if (done) return value;
		if (isPromise(value)) return resumeAsyncFn(value, iter);
		prev = value;
	}
}

async function resumeAsyncFn<T>(pending: Promise<T>, iter: Iterator<MaybePromise<T>>): Promise<T> {
	let prev = await pending;
	for (;;) {
		const {value, done} = iter.next(prev);
		if (done) return value;
		prev = await value;
	}
}

export default maybeAsync;
