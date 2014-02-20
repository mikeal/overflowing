var path = require('path')
var config =
  { '#node.js': ['node.js']
  , '#couchdb': ['couchdb']
  }

require('./')('irc.freenode.org', 'StackOverflowing', config, path.join(__dirname, 'cache.json'))