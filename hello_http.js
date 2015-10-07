var http = require('http');
var express = require('express');
var fs = require('fs');
var app = express();
var Grid = require('gridfs-stream');
var mongoose = require('mongoose');
var db = mongoose.connection;

Grid.mongo = mongoose.mongo;

// // will match request to the root
// app.get('/#/dj', function (req, res) {
//   res.send('dj');
// });

db.on('error', console.error);
db.once('open', function() {
    // Create your schemas and models here.
    console.log("open");

    var gfs = Grid(db.db);
    // streaming to gridfs
    //filename to store in mongodb
    var writestream = gfs.createWriteStream({
        filename: 'testFile.txt'
    });
    fs.createReadStream('./testFile.txt').pipe(writestream);

    writestream.on('close', function (file) {
        // do something with `file`
        console.log(file.filename + 'Written To DB');
    });



    var options = {filename: 'testFile.txt'}; //can be done via _id as well
    gfs.exist(options, function (err, found) {
      if (err) return handleError(err);
      found ? console.log('File exists') : console.log('File does not exist');
    });




    //write content to file system
    var fs_write_stream = fs.createWriteStream('write.txt');
     
    //read from mongodb
    var readstream = gfs.createReadStream({
         filename: 'testFile.txt'
    });
    readstream.pipe(fs_write_stream);
    fs_write_stream.on('close', function () {
         console.log('file has been written fully!');
    });

});

mongoose.connect('mongodb://localhost/test');



app.use(express.static(__dirname + '/'));

app.listen(process.env.PORT || 8000);


