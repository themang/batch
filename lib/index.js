/**
 * Modules
 */

 var snakeCase = require('snake-case')
 var R = require('ramda')
 var assign = require('object-assign')
 var is = require('@weo-edu/is')

/**
 * Vars
 */

/**
 * Expose batch
 */

module.exports = batch

/**
 * batch
 */

function batch (documents, fields, options) {
  options = options || {}
  if (is.object(fields)) {
    options = fields
    fields = null
  }
  fields = fields || R.keys(documents[0])

  var idField = options.key || fields[0]
  var snakeFields = fields.map(snakeCase)

  if (options.all) {
    snakeFields.push('all')
  }

  return documents.map(function (document) {
    var fieldValues = R.values(R.pick(fields, document))
    if (options.all) {
      fieldValues.push(fieldValues.map(function (value) {
        if (is.array(value)) {
          return value.join(' ')
        } else {
          return value
        }
      }).filter(Boolean).join(' '))
    }

    return {
      type: options.type || "add",
      id: snakeCase(document[idField]),
      fields: R.zipObj(snakeFields, fieldValues)
    }
  })
}
