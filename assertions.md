### Test262-MJSUnit Assertion Equivalency

MSJUnit | Description | Test262 equivalent
--------|-------------|-------------------
`assertSame(expected, found, name_opt)` | Expected and found values the same objects, or the same primitive values. For known primitive values, please use assertEquals. | `assert.sameValue(found, expected, name_opt)`
`assertEquals(expected, found, name_opt)` | Expected and found values are identical primitive values or functions or similarly structured objects (checking internal properties of, e.g., Number and Date objects, the elements of arrays and the properties of non-Array objects). | (none)
`assertEqualsDelta(expected, found, delta, name_opt)` | The difference between expected and found value is within certain tolerance. | `assert(found > expected - delta); assert(found < expected + delta)` (may be shorted with `Math.abs` if it's okay to use the STL within assertions)
`assertArrayEquals(expected, found, name_opt)` | The found object is an Array with the same length and elements as the expected object. The expected object doesn't need to be an Array, as long as it's "array-ish". | `assert(compareArray(expected, found), name_opt)`
`assertPropertiesEqual(expected, found, name_opt)` | The found object must have the same enumerable properties as the expected object. The type of object isn't checked. | (none)
`assertToStringEquals(expected, found, name_opt)` | Assert that the string conversion of the found value is equal to the expected string. Only kept for backwards compatability, please check the real structure of the found value. | `assert.sameValue(String(found), expected)` (although we should take the advice of MJSUnit and change the test to assert structure)
`assertTrue(value, name_opt)` | Checks that the found value is true. Use with boolean expressions for tests that doesn't have their own assertXXX function. | `assert(value, name_opt)`
`assertFalse(value, name_opt)` | Checks that the found value is false. | `assert.sameValue(value, false)`
`assertNull(value, name_opt)` | Checks that the found value is null. Kept for historical compatibility, please just use assertEquals(null, expected). | `assert.sameValue(value, null, name_opt))`
`assertNotNull(value, name_opt)` | Checks that the found value is *not* null. | `assert(value !== null, name_opt)`
`assertThrows(fn, ErrCtor)` | Assert that the passed function or eval code throws an exception. The optional second argument is an exception constructor that the thrown exception is checked against with "instanceof". The optional third argument is a message type string that is compared to the type property on the thrown exception. | `assert.throws(ErrCtor, fn)` (note switched argument order)
`assertDoesNotThrow(fn, ErrCtor)` | Assert that the passed function or eval code does not throw an exception. | `assert.throws($ERROR, function() { assert.throws(ErrCtor, fn); })` (relatively concise, but probably still warrants a helper)
`assertInstanceof` | Asserts that the found value is an instance of the constructor passed as the second argument. | (none--MJSUnit does more than a simple `instanceof` check)
`assertUnreachable(name_opt)` | Assert that this code is never executed (i.e., always fails if executed). | `assert(false, name_opt)`
`assertOptimized` | Assert that the function code is (not) optimized.  If "no sync" is passed as second argument, we do not wait for the concurrent optimization thread to finish when polling for optimization status. Only works with --allow-natives-syntax. | n/a -- remove
`assertUnoptimized` | | n/a -- remove

I recommend implemeting the following:

- `assert.isInstance` - renamed to avoid confusion with the semantics of the
   native JavaScript operator
- `assert.withinDelta` for `assertEqualsDelta`; this one is a bit of a luxury,
   but it shows up 41 times in V8's ES6 tests.
- `asset.deepEquals` - for `assertEquals`

We can probably ignore:

- `assertDoesNotThrow` - it's not used in V8's ES6 tests
- `assertPropertiesEqual` - we can expand it using `assert.deepEquals`, or we
  can make comparisons manually because of its limited use [1]

Sources:

- https://github.com/v8/v8-git-mirror/blob/8be79b005df2e17a1431f282344e71ec24fc3ff3/test/mjsunit/mjsunit.js
- https://github.com/tc39/test262/blob/d075338699cc8eaf123d5f5491f0d68116ee224a/harness/assert.js
- https://github.com/tc39/test262/blob/master/harness/compareArray.js

[1] 3 times in the files we're interested in, it looks like:

    $ grep assertProperties test/mjsunit/{harmony,es6} -r
    test/mjsunit/harmony/debug-blockscopes.js:      assertPropertiesEqual(global_object, scope.scopeObject().value());
    test/mjsunit/es6/generators-debug-scopes.js:  assertPropertiesEqual(scope1.scopeObject().value(), scope2.scopeObject().value());
    test/mjsunit/es6/generators-debug-scopes.js:      assertPropertiesEqual(this, scope.scopeObject().value());
