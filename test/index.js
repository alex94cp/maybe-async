const {expect} = require('chai');
const {maybeAsync} = require('../');

describe('maybeAsync', () => {
	it('returns value', () => {
		const result = maybeAsync(function*() {
			return 123;
		});
		expect(result).to.equal(123);
	});

	it('returns promised value', async () => {
		const result = maybeAsync(function*() {
			return Promise.resolve(123);
		});
		expect(result).to.be.an.instanceof(Promise);
		expect(await result).to.equal(123);
	});

	it('yields values and returns value', () => {
		const result = maybeAsync(function*() {
			const a = yield 123;
			expect(a).to.equal(123);
			const b = yield 456;
			expect(b).to.equal(456);
			return a + b;
		});
		expect(result).to.equal(123 + 456);
	});

	it('yields promised values and returns promise', async () => {
		const result = maybeAsync(function*() {
			const a = yield Promise.resolve(123);
			expect(a).to.equal(123);
			const b = yield 456;
			expect(b).to.equal(456);
			return a + b;
		});
		expect(result).to.be.an.instanceof(Promise);
		expect(await result).to.equal(123 + 456);
	});

	it('yields array of values and returns value', () => {
		const result = maybeAsync(function*() {
			const values = yield [123, 456];
			expect(values).to.be.an.instanceof(Array);
			expect(values).to.deep.equal([123, 456]);
			return values;
		});
		expect(result).to.be.an.instanceof(Array);
		expect(result).to.deep.equal([123, 456]);
	});

	it('yields array of promised values and returns promise', async () => {
		const result = maybeAsync(function*() {
			const values = yield [
				Promise.resolve(123),
				Promise.resolve(456),
			];
			expect(values).to.be.an.instanceof(Array);
			expect(values).to.deep.equal([123, 456]);
			return values;
		});
		expect(result).to.be.an.instanceof(Promise);
		expect(await result).to.be.an.instanceof(Array);
		expect(await result).to.deep.equal([123, 456]);
	});

	it('yields array of mixed values and returns promise', async () => {
		const result = maybeAsync(function*() {
			const values = yield [
				123, Promise.resolve(456),
			];
			expect(values).to.be.an.instanceof(Array);
			expect(values).to.deep.equal([123, 456]);
			return values;
		});
		expect(result).to.be.an.instanceof(Promise);
		expect(await result).to.be.an.instanceof(Array);
		expect(await result).to.deep.equal([123, 456]);
	});
});
