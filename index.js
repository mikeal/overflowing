var rss = require('stack-overflow-rss')
  , irc = require('irc')
  , urls = {}
  ;

var client = new irc.Client('irc.freenode.org', 'StackOverflowing', {
    channels: ['#node.js'],
})

var spool = []

function post (q) {
  urls[q.id] = true
  spool.push('"' + q.title + '" ' + q.id)
}

setInterval(function () {
  var msg = []
  while (msg.join(', ').length < 510 && spool.length !== 0) {
    msg.push(spool.shift())
  }

  if (msg.join(', ').length >= 510) spool.unshift(msg.pop())
  msg = msg.join(', ')
  if (!msg) return

  if (msg) client.say('#node.js', msg)
}, 1000 * 60 * 5)

setTimeout(function () {
  var consumer = rss({ tag: 'node.js'})
  consumer.on('update', function(questions) {
    questions.forEach(function (q) {
      if (!urls[q.id]) post(q)
    })
  })
  consumer.update()
}, 3000)
