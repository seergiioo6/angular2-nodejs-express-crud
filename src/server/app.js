var express = require('express');
var path = require('path');
var morgan = require('morgan'); // logger
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken')
var app = express();
app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(__dirname + '/../../dist'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(morgan('dev'));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/test');
var db = mongoose.connection;
mongoose.Promise = global.Promise;
var Website = require('./website.model.js');
var User = require('./user.model.js');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');

  app.get('/setup-user', function(req, res) {

    var nick = new User({ 
      name: 'admin', 
      password: '1234',
      admin: true 
    });

    nick.save(function(err) {
      if (err) throw err;

      res.json({ success: true });
    });
  });

  app.get('/setup-admin', function(req, res) {

    var nick = new User({ 
      name: 'user', 
      password: '1234',
      admin: false 
    });

    nick.save(function(err) {
      if (err) throw err;

      res.json({ success: true });
    });
  });

  app.post('/api/authenticate', function(req,res) {
    User.findOne({
      name: req.body.username
    }, function(err, user) {
      if (err) throw err;
      if (!user) {
        res.json({ success: false, message: 'Authentication failed. User not found.' });
      } else if (user) {
        if (user.password != req.body.password) {
          res.json({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {
          var token = jwt.sign(user, "secret");
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token,
            admin: user.admin
          });
        }   
      }
    });
  })

  app.get('/websites', function(req, res) {
    let query = req.query.keywords != 'undefined' ? {name:new RegExp(req.query.keywords, 'i')} : {}
    let limit = req.query.limit != 'undefined' ? parseInt(req.query.limit) : 8
    let offset = req.query.offset != 'undefined' ? parseInt(req.query.offset) : 0

    Website.find(query, function(err, docs) {
      if(err) return console.error(err);
      res.json(docs);
    }).skip(offset).limit(limit)
  });

  app.get('/websites/count', function(req, res) {
    Website.count(function(err, count) {
      if(err) return console.error(err);
      res.json(count);
    });
  });

  app.post('/website', function(req, res) {
    var obj = new Website(req.body);
    obj.save(function(err, obj) {
      if(err) return console.error(err);
      res.status(200).json(obj);
    });
  });

  app.get('/website/:id', function(req, res) {
    Website.findOne({_id: req.params.id}, function(err, obj) {
      if(err) return console.error(err);
      res.json(obj);
    })
  });

  app.put('/website/:id', function(req, res) {
    Website.findOneAndUpdate({_id: req.params.id}, req.body, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    })
  });

  app.delete('/website/:id', function(req, res) {
    Website.findOneAndRemove({_id: req.params.id}, function(err) {
      if(err) return console.error(err);
      res.sendStatus(200);
    });
  });

  app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname,'/../../dist/index.html'));
  });

  app.listen(app.get('port'), function() {
    console.log('Angular 2 Full Stack listening on port '+app.get('port'));
  });
});

module.exports = app;