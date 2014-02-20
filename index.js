var rss = require('stack-overflow-rss')
  , irc = require('irc')
  , fs = require('fs')
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

function jsonload (file) {
  try {
    return JSON.parse(fs.readFileSync(file).toString())
  } catch(e) {
    return []
  }
}

// channelConfigs = {'#node.js': ['node.js'], '#couchdb': ['couchdb']}

function overflowing (server, nick, channelConfigs, cache, interval, formatter) {
  if (!interval) interval = 1000 * 60 * 5 // 5 minutes
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

  var consumer = rss(
    { tags: uniq(values(channelConfigs)).join(', or, ').split(', ')
    , entries: cache ? jsonload(cache) : undefined
    })
  consumer.on('new', function(questions) {
    questions.forEach(post)
    if (cache) fs.writeFileSync(cache, JSON.stringify(questions))
  })
  consumer.update()
}

module.exports = overflowing
