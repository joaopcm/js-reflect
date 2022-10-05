'use strict';

const assert = require('node:assert')

// Ensure semantic and security in objects
// -- apply
const myObj = {
  add(myValue) {
    return this.arg1 + this.arg2 + myValue
  }
}

assert.deepStrictEqual(myObj.add.apply({ arg1: 10, arg2: 20 }, [100]), 130)

// a problem that may occur (rare)
// Function.prototype.apply = () => { throw new TypeError('OMG!') }

// this one is easier to happen
myObj.add.apply = () => { throw new TypeError('OMG!') }

assert.throws(() => myObj.add.apply({}, []), {
  name: 'TypeError',
  message: 'OMG!'
})

// using Reflect.apply
const result = Reflect.apply(myObj.add, { arg1: 40, arg2: 20 }, [200])
assert.deepStrictEqual(result, 260)

// defineProperty
function MyDate() {}
// this is not the best way to do it
Object.defineProperty(MyDate, 'withObject', { value: () => 'Hey, Object!' })
// let's use Reflect instead
Reflect.defineProperty(MyDate, 'withReflection', { value: () => 'Hey, Reflect!' })

assert.deepStrictEqual(MyDate.withObject(), 'Hey, Object!')
assert.deepStrictEqual(MyDate.withReflection(), 'Hey, Reflect!')

// deleteProperty
const withDelete = { user: 'John' }
// it's not performant
delete withDelete.user
assert.deepStrictEqual(withDelete.hasOwnProperty('user'), false)

const withReflection = { user: 'John' }
Reflect.deleteProperty(withReflection, 'user')
assert.deepStrictEqual(withReflection.hasOwnProperty('user'), false)

// get
// we should only use get in reference instances
assert.deepStrictEqual(1['userName'], undefined)
// with Reflection, we get an exception
assert.throws(() => Reflect.get(1, 'userName'), TypeError)

// has
assert.ok('superman' in { superman: '' })
assert.ok(Reflect.has({ superman: '' }, 'superman'))

// ownKeys
const user = Symbol('user')
const obj = {
  id: 1,
  [Symbol.for('password')]: 123,
  [user]: 'John'
}

// with object methods
const objectKeys = [
  ...Object.getOwnPropertyNames(obj),
  ...Object.getOwnPropertySymbols(obj)
]
assert.deepStrictEqual(objectKeys, ['id', Symbol.for('password'), user])

// using Reflection
assert.deepStrictEqual(Reflect.ownKeys(obj), ['id', Symbol.for('password'), user])