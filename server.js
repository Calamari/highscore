"use strict";

var mongoose = require('mongoose'),
    express  = require('express'),

    app = express();

mongoose.connect('mongodb://localhost/highscores');

var GameEntrySchema = new mongoose.Schema({
  gameId: { type: String, required: true },
  player: { type: String, required: true },
  score:  { type: Number, required: true },
  scope:  String,
  createdAt: { type: Date, 'default': Date.now }
});

var GameEntry = mongoose.model('GameEntry', GameEntrySchema);

function getList(gameId, options, cb) {
  options = options || {};
  var query = GameEntry.find({ gameId: gameId }, null, {})
    .lean()
    .sort({ score: options.order || 1 })
    .limit(options.limit || 10);
  if (options.scope) {
    query.where('scope', options.scope );
  }
  query.exec(cb);
}

function addToList(gameId, attributes, cb) {
  var item = new GameEntry(attributes);
  item.set('gameId', gameId);
  item.save(cb);
}

app.use(express.bodyParser());
app.use(express.methodOverride());

app.get('/:gameId', function(req, res) {
  var options = {
    order: req.query.reverse ? 1 : -1,
    limit: req.query.limit || 10,
    scope: req.query.scope || null
  };
  getList(req.params.gameId, options, function(err, items) {
    if (err) {
      res.send(400, { error: err.message });
    } else {
      res.send({ items: items });
    }
  });
});

app.post('/:gameId', function(req, res) {
  addToList(req.params.gameId, req.body, function(err) {
    if (err) {
      res.send(500, { error: err.message || 'Undefined error' });
    } else {
      res.send({ success: true });
    }
  });
});

app.listen(8124);
console.log("Started server at 172.0.0.1:8124");
