var convert = require('lib/lodash/fp/convert'),
    func = convert('value', require('lib/lodash/value'), require('lib/lodash/fp/_falseOptions'));

func.placeholder = require('lib/lodash/fp/placeholder');
module.exports = func;
