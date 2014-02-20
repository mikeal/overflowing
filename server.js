var path = require('path')
var config =
  { '#node.js': ['node.js']
  , '#couchdb': ['couchdb']
  , '#pouchdb': ['pouchdb']
  }

require('./')('irc.freenode.org', 'StackOverflowing', config, path.join(__dirname, 'cache.json'))