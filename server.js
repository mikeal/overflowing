var config =
  { '#node.js': ['node.js']
  , '#couchdb': ['couchdb']
  , '#pouchdb': ['pouchdb']
  }

require('./')('irc.freenode.org', 'StackOverflowing', config)
