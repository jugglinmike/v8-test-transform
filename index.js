'use strict';
var transform = require('./');

var code = [
	'// Can recast handle ES6?',
	'var x = (dooDoo) => { dooDoo };',
	'class MyClass { constructor() {} };',
	'// Yes!',
	'assertTrue(!false, "Should be true");',
	'assertFalse(!true, "Should be false");',
	'assertNull(void 0, "Should be null");',
	'assertNotNull(3, "Should not be null");',
	'assertSame(5000 + 1, 5001, "Should be the same");',
	'assertThrows(function() { throw new Error(); }, Error);',
	'assertArrayEquals([1, 1+1, 3], [1, 2, 4-1], "same elements");',
	'(function() {',
	'	assertUnreachable("this code should not be executed.");',
	'});',
	'',
	'// This is not perfect, but I think it\'s good enough:',
	'failedPromise.then(assertUnreachable);'
].join('\n');

console.log('before:');
console.log(code);
console.log('\nafter:');
console.log(transform(code));
