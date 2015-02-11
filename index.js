'use strict';
var assert = require('assert');
var recast = require('recast');

var assertions = {
	assertThrows: function(path) {
		var args = path.parentPath.value.arguments;

		assert.equal(args.length, 2, 'Unexected invocation of assertThrows');

		args.unshift(args.pop());
		path.value.name = 'assert.throws';
	},
	assertSame: function(path) {
		path.value.name = 'assert.sameValue';
	}
};

function transform(code) {
	var ast = recast.parse(code);

	var visitor = recast.visit(ast, {
		names: [],
		visitIdentifier: function(path) {
			var node = path.value;
			this.visitor.names.push(node.name);
			if (assertions.hasOwnProperty(node.name)) {
				// We could special cases for different function invocations
				// patterns, but that would probably be an over-optimization in
				// this context. Throw an error to prompt manual intervention.
				recast.types.namedTypes.CallExpression.assert(
					path.parentPath.value
				);

				assertions[node.name](path);
			}
			this.traverse(path);
		}
	});

	return recast.print(ast).code;
}

var code = [
	'// Can recast handle ES6?',
	'var x = (dooDoo) => { dooDoo };',
	'class MyClass { constructor() {} };',
	'// Yes!',
	'assertSame(5001, 5001);',
	'// Trickier: argument hockey',
	'assertThrows(function() { throw new Error(); }, Error);',
].join('\n');

console.log('before:');
console.log(code);
console.log('\nafter:');
console.log(transform(code));
