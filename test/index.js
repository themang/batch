var batch = require('..')
var assert = require('assert')
var Schema = require('@weo-edu/schema')
var validator = require('@weo-edu/validate')
var BatchSchema = Schema()
  .prop('type', {type: 'string'})
  .prop('id', {type: 'string'})
  .prop('fields', {type: 'object'})
var validate = validator(BatchSchema)

describe('batch', function () {
  it('should be the right form', function () {
    var b = batch([{name: 'foo', bar: 'bax'}], {key: 'name'})
    b.forEach(function (add) {
      assert(validate(add).valid)
    })

  })

  it('should let fields be specified', function () {
    var b = batch([{name: 'foo', bar: 'bax'}], ['name'])
    b.forEach(function (add) {
      assert(validate(add).valid)
      assert(!add.fields.bar)
    })
  })

  it('should have option to add an all field', function () {
    var b = batch([{name: 'foo', bar: ['bax', 'bat']}], {all: true, key: 'name'})
    var add = b[0]
    assert(validate(add).valid)
    assert(add.fields.all)
    assert(add.fields.all === 'foo bax bat')

  })

  it('should allow type of operation to be changed', function () {
    var b = batch([{name: 'foo', bar: ['bax', 'bat']}], {type: 'delete', key: 'name'})
    var del = b[0]
    assert(validate(del).valid)
    assert(del.type === 'delete')
  })

})
