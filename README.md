# @randajan/jet-base

[![NPM](https://img.shields.io/npm/v/@randajan/jet-base.svg)](https://www.npmjs.com/package/@randajan/jet-base) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Goal was to create universal structure for storing variables with watcher and validator.

## Install

```bash
npm install @randajan/jet-base
```

or

```bash
yarn add @randajan/jet-base
```

## Usage

### Init
```js
import Base from "@randajan/jet-base";

const base = new Base(true); //first argument = debug mode on/off
```

### Set
function that simply assign values. For rewrite whole structure it can be used with object as first argument:

```js
base.set({a:1, b:2, c:3, d:{x:123}});
```

or first argument could be path, and second argument value:

```js
base.set("a", 1);
base.set("b", 2);
base.set("c", 3);
base.set("d.x", 123);
```
result will be the same.

### Get
accessing stored values first argument could be path
```js
base.get("d") == {x:123};
base.get("d.x") === 123;
```
result is everytime a deep copy. 

### Is / IsType / IsFull
simple comparing
```js
base.is("d.x", 123) === true;
base.isType("d.x", "Number") === true;
base.isFulll("d.y") === false;
```

### Fit
validator of value with middleware iterator. Also accept path as first argument
```js
base.fit("a", (next, value, valueBefore)=>next(value > 0 ? 0 : value));
```
after defining new validator base will reprocess last input.

### Watch
run me when variable under path has changed
```js
base.watch("a", (get, changes)=>console.log(get()));
```
after any change at desired path will be called this function. Passing two arguments. Both are functions. get() will return value at same path and changes() will return list of sub changes;


## License

MIT © [randajan](https://github.com/randajan)
