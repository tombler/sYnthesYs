var express = require('express');
var app = express();
//Requires mongoJS module
var mongojs = require('mongojs');
//Tells it which collection to use
var db = mongojs('contactlist', ['contactlist']);
var bodyParser = require('body-parser')

// Tells express where to look for static files, i.e. index.html
app.use(express.static(__dirname + '/public'));
// Need body=parser to parse body of response. run npm install body-parser
app.use(bodyParser.json());



app.get('/contactlist', function(req, res) {
    console.log("Received get request");


    db.contactlist.find(function (err, docs) {
        console.log(docs);
        // Sends data back to controller
        res.json(docs);
        console.log(err);
    });

    // //Sends back contactlist data in JSON for controller -- after receiving, tell controller what to do in $http.get.success(....)
    // res.json(contactlist);
});

// Listens for post req from controller
app.post('/contactlist', function (req, res) {
    
    console.log(req.body);
    db.contactlist.insert(req.body, function (err, docs) {
        res.json(docs);
    });
});


app.delete('/contactlist/:id', function (req, res) {
    var id = req.params.id;
    console.log(id);
    db.contactlist.remove({_id: mongojs.ObjectId(id)}, function(err, doc) {
        res.json(doc);
    });

});

app.get('/contactlist/:id', function (req, res) {
    var id = req.params.id;
    db.contactlist.findOne({_id: mongojs.ObjectId(id)}, function(err, doc) {
        res.json(doc);
    });
});

app.put('/contactlist/:id', function (req, res) {
    var id = req.params.id;
    console.log(req.body.name);
    db.contactlist.findAndModify({
        query: {_id: mongojs.ObjectId(id)},
        update: {$set: {name: req.body.name, email: req.body.email, number: req.body.number}},
        new: true
    }, function (err, doc) {
            res.json(doc);
        }

    );    
});

// Which port to listen on
app.listen(3000);
console.log('server running at port 3000');


