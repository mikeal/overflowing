var rss = require('stack-overflow-rss')
  , irc = require('irc')
  ;

function _formatter (q) {
  return '"' + q.title + '" <' + q.id + '>'
}

function values (obj) {
  return Object.keys(obj).map(function (key) { return obj[key] })
}

function uniq (arr) {
  return arr.filter(function (value, index) { return arr.indexOf(value) === index })
}

function overlap (arr1, arr2) {
  for (var i=0;i<arr1.length;i++) {
    if (arr2.indexOf(arr1[i]) !== -1) return true
  }
  return false
}

// channelConfigs = {'#node.js': ['node.js'], '#couchdb': ['couchdb']}

function overflowing (server, nick, channelConfigs, interval, formatter) {
  if (!interval) interval = 1000 * 60 * 10 // 10 minutes
  if (!formatter) formatter = _formatter

  var client = new irc.Client(server, nick, {channels: Object.keys(channelConfigs)})
    , spool = {}
    ;

  for (var key in channelConfigs) {
    spool[key] = []
  }

  function post (q) {
    for (var key in channelConfigs) {
      if (overlap(q.tags, channelConfigs[key])) spool[key].push(q)
    }
  }

  setInterval(function () {
    for (var channel in spool) {
      var q = spool[channel].shift()
      if (!q) return

      if (q) client.say(channel, formatter(q))
    }
  }, interval)

  var consumer = rss({tags: uniq(values(channelConfigs)).join(', or, ').split(', ') })
  consumer.on('new', function(questions) {
    questions.forEach(post)
  })
  consumer.update()
}

module.exports = overflowing
