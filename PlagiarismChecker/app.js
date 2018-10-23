var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var fs = require("fs");

var app = express();

var connection = require('./routes/connection');

try {
    connection.connect();
} catch(err){
    connection.connect();
}
/*
var k = 15;
var HashFunction = require('./HashFunction');
var hash = new HashFunction(k);

var sentence = 'Long ago, when there was no written history, these islands were the home of millions of happy birds; the resort of a hundred times more millions of fishes, sea lions, and other creatures. Here lived innumerable creatures predestined from the creation of the world to lay up a store of wealth for the British farmer, and a store of quite another sort for an immaculate Republican government.';
var IngestionEngine = require('./IngestionEngine');
var ingestionEngine = new IngestionEngine();
var formattedText = ingestionEngine.FormatTextForHash(sentence);

var prevKGram = formattedText.substring(0, k);
var prevHash = hash.Hash(prevKGram);

for(var i = 1; i < formattedText.length - k; i++){

    console.log('====================');

    var kgram = formattedText.substring(i, i + k);
    var curhash = hash.RollingHash(prevHash, prevKGram, kgram);

    console.log(curhash === hash.Hash(kgram));

    prevKGram = kgram;
    prevHash = curhash;
}

console.log('done');
*/

/*

console.log('ab: ' + hash.Hash('ab'));
console.log('br: ' + hash.Hash('br'));
console.log('ra: ' + hash.Hash('ra'));

console.log('=============================');

console.log('ab: ' + hash.Hash('ab'));
console.log('br: ' + hash.RollingHash(hash.Hash('ab'), 'ab', 'br'));
console.log('ra: ' + hash.RollingHash(hash.Hash('br'), 'br', 'ra'));

console.log('=============================');

*/

/*
var IngestionEngine = require('./IngestionEngine');
var Winnowing = require('./Winnowing');
var k = 25;
var w = 30;
var winnow = new Winnowing(k);
var ingestionEngine = new IngestionEngine();

var originalText = fs.readFileSync("./text_files/original_texts/example1o.txt").toString('utf-8');
var formattedText = ingestionEngine.FormatTextForHash(originalText);
var fingerPrints = winnow.Winnow(w, originalText, formattedText);
console.log(fingerPrints)
*/
/*
var IngestionEngine = require('./IngestionEngine');
var ingestionEngine = new IngestionEngine();
var words = ingestionEngine.FormatTextForBagOfWords('Only two years later, all these friendly Sioux were suddenly plunged into new conditions, including starvation, martial law on all their reservations, and constant urging by their friends and relations to join in warfare against the treacherous government that had kept faith with neither friend nor foe.');
console.log(words);
*/

/*
var HashingTest = require('./HashingTests');
var hashingTest = new HashingTest();
hashingTest.Test();
*/
/*

var IngestionEngine = require('./IngestionEngine');
var Winnowing1 = require('./Winnowing');
var Winnowing2 = require('./Winnowing');

var originalText1 = fs.readFileSync("./text_files/original_texts/example1o.txt").toString('utf-8');
var originalText2 = fs.readFileSync("./text_files/plagiarized_text/example1p.txt").toString('utf-8');

//var originalText1 = 'Long ago, when there was no written history, these islands were the home of millions of happy birds; the resort of a hundred times more millions of fishes, sea lions, and other creatures. Here lived innumerable creatures predestined from the creation of the world to lay up a store of wealth for the British farmer, and a store of quite another sort for an immaculate Republican government.';
//var originalText2 = 'In ages which have no record these islands were the home of millions of happy birds, the resort of a hundred times more millions of fishes, of sea lions, and other creatures whose names are not so common; the marine residence, in fact, of innumerable creatures predestined from the creation of the world to lay up a store of wealth for the British farmer, and a store of quite another sort for an immaculate Republican government.';
//var originalText1 = 'Only two years later, all these friendly Sioux were suddenly plunged into new conditions, including starvation, martial law on all their reservations, and constant urging by their friends and relations to join in warfare against the treacherous government that had kept faith with neither friend nor foe';
//var originalText2 = 'Contrast the condition into which all these friendly Indians are suddenly plunged now, with their condition only two years previous: martial law now in force on all their reservations; themselves in danger of starvation, and constantly exposed to the influence of emissaries from their friends and relations, urging them to join in fighting this treacherous government that had kept faith with nobody--neither with friend nor with foe.';

//var originalText1 = fs.readFileSync("./text1.txt").toString('utf-8');
//var originalText2 = fs.readFileSync("./text2.txt").toString('utf-8');
*/

/*
for(var k = 25; k < 26; k++){
    for(var w = 30; w < 31; w+=2) {
        console.log(k + ', ' + w);

        var winnow1 = new Winnowing1(k);

        var winnow2 = new Winnowing2(k);

        var ingestionEngine = new IngestionEngine();

        var firstFormattedText = ingestionEngine.FormatTextForHash(originalText1);
        var firstFingerPrints = winnow1.Winnow(w, originalText1, firstFormattedText);

        console.log('==============');

        var secondFormattedText = ingestionEngine.FormatTextForHash(originalText2);

        var secondFingerPrints = winnow2.Winnow(w, originalText2, secondFormattedText);


        for (var key1 in firstFingerPrints) {

            for(var key2 in secondFingerPrints){

              if(key1 === key2) {
                  //console.log(firstFingerPrints[key1]);
                  var HashFunction = require('./HashFunction');
                  var hash = new HashFunction(k);
                  //console.log(hash.Hash('rnmentthathadkeptfaithwit') + ', ' + key1);
                  //console.log(hash.Hash('hathadkeptfaithwithnobody') + ', ' + key2);

                  //console.log(firstFingerPrints);
                  //console.log(hash.Hash('rnmentthathadkeptfaithwit'));
                  //console.log(secondFingerPrints);

                  //console.log(firstFingerPrints[key1]);
                  //console.log(secondFingerPrints[key1]);

                  //console.log('match on: ' + key1 + ', at pos: ' + firstFingerPrints[key1]);
                  //console.log('k : ' + k + ', w: ' + w);
                  console.log('   ' + originalText1.substring(firstFingerPrints[key1][0], firstFingerPrints[key1][1]));
                  console.log('   ' + originalText2.substring(secondFingerPrints[key2][0], secondFingerPrints[key2][1]));
                  console.log(secondFingerPrints[key2]);
                  console.log(key1);

              }
            }
        }

    }
}
console.log('done');
*/


/*
var IngestionEngine = require('./IngestionEngine');
var Winnowing1 = require('./Winnowing');
var Winnowing2 = require('./Winnowing');

var originalText1 = fs.readFileSync("./example4o.txt").toString('utf-8');
var originalText2 = fs.readFileSync("./example4p.txt").toString('utf-8');


var k = 50;
var w = 60;

var winnow1 = new Winnowing1(k);
var winnow2 = new Winnowing2(k);

var ingestionEngine = new IngestionEngine();

var firstFormattedText = ingestionEngine.FormatTextForHash(originalText1);
var firstFingerPrints = winnow1.Winnow(w, originalText1, firstFormattedText);

//console.log('==============');

var secondFormattedText = ingestionEngine.FormatTextForHash(originalText2);
var secondFingerPrints = winnow2.Winnow(w, originalText2, secondFormattedText);


for (var key1 in firstFingerPrints) {
    for(var key2 in secondFingerPrints){

        if(key1 === key2) {

            console.log('   ' + originalText1.substring(firstFingerPrints[key1][0], firstFingerPrints[key1][1]));
            console.log('   ' + originalText2.substring(secondFingerPrints[key2][0], secondFingerPrints[key2][1]));
            console.log(secondFingerPrints[key2]);
            console.log(key1);
        }
    }
}


console.log('===========================================================================================================');

k = 25;
w = 50;

winnow1 = new Winnowing1(k);
winnow2 = new Winnowing2(k);

firstFormattedText = ingestionEngine.FormatTextForHash(originalText1);
firstFingerPrints = winnow1.Winnow(w, originalText1, firstFormattedText);

//console.log('==============');

secondFormattedText = ingestionEngine.FormatTextForHash(originalText2);
secondFingerPrints = winnow2.Winnow(w, originalText2, secondFormattedText);


for (var key1 in firstFingerPrints) {
    for(var key2 in secondFingerPrints){

        if(key1 === key2) {

            console.log('   ' + originalText1.substring(firstFingerPrints[key1][0], firstFingerPrints[key1][1]));
            console.log('   ' + originalText2.substring(secondFingerPrints[key2][0], secondFingerPrints[key2][1]));
            console.log(secondFingerPrints[key2]);
            console.log(key1);
        }
    }
}


//var IngestionEngine = require('./IngestionEngine');
//var ingestionEngine = new IngestionEngine();
var EditDistance = require('./EditDistance');
var editDistance = new EditDistance();

//var originalText1 = 'Long ago, when there was no written history, these islands were the home of millions of happy birds; the resort of a hundred times more millions of fishes, sea lions, and other creatures.';
//var originalText1 = fs.readFileSync("./wikipediatext1.txt").toString('utf-8');
//var originalText2 = fs.readFileSync("./wikipediatext2.txt").toString('utf-8');

//var originalText1 = 'Only two years later, all these friendly Sioux were suddenly plunged into new conditions, including starvation, martial law on all their reservations, and constant urging by their friends and relations to join in warfare against the treacherous government that had kept faith with neither friend nor foe';
//var originalText2 = 'Contrast the condition into which all these friendly Indians are suddenly plunged now, with their condition only two years previous: martial law now in force on all their reservations; themselves in danger of starvation, and constantly exposed to the influence of emissaries from their friends and relations, urging them to join in fighting this treacherous government that had kept faith with nobody--neither with friend nor with foe.';
//var originalText2 = 'In ages which have no record these islands were the home of millions of happy birds, the resort of a hundred times more millions of fishes, of sea lions, and other creatures whose names are not so common; the marine residence, in fact, of innumerable creatures predestined from the creation of the world to lay up a store of wealth for the British farmer, and a store of quite another sort for an immaculate Republican government.';



var keyword_map1 = ingestionEngine.GetKeywordMap(originalText1);
var keyword_map2 = ingestionEngine.GetKeywordMap(originalText2);

editDistance.CalculateEditDistance(originalText1, originalText2, keyword_map1, keyword_map2, 0.5, 0.5);
*/



/*
var DetectionEngine = require('./DetectionEngine');

var plagiarizedText = fs.readFileSync("./example4p.txt").toString('utf-8');
var originalText = fs.readFileSync("./example4o.txt").toString('utf-8');

var detectionEngine = new DetectionEngine();
detectionEngine.DetectPlagiarism(plagiarizedText, originalText);

console.log('done');
*/

/*
var FuzzyFingerprint = require('./FuzzyFingerprint');
var fuzzyFingerprint = new FuzzyFingerprint();

var originalText = fs.readFileSync("./example2o.txt").toString('utf-8');
var plagiarizedText = fs.readFileSync("./example1p.txt").toString('utf-8');

fuzzyFingerprint.DetectPlagiarism(originalText, plagiarizedText);

var fingerprints = [];
fs.readdir('./rfc', function( err, files ) {

    if( err ) {
        console.error( "Could not list the directory.", err );
        process.exit( 1 );
    }

    files.forEach( function( file, index ) {
        // Make one pass and make the file complete
        if(!file.includes('.pdf')) {
            var text = fs.readFileSync('./rfc/' + file).toString('utf-8');
            fingerprints.push({'name':file, 'fingerprint':fuzzyFingerprint.CalculateFuzzyFingerprint(text)});
        }
    });

    console.log('created fingerprint dictionary');
});




fs.readdir('./rfc', function( err, files ) {

    if( err ) {
        console.error( "Could not list the directory.", err );
        process.exit( 1 );
    }

    files.forEach( function( file, index ) {
        // Make one pass and make the file complete
        if(!file.includes('.pdf')) {
            var text = fs.readFileSync('./rfc/' + file).toString('utf-8');
            var fingerprint = fuzzyFingerprint.CalculateFuzzyFingerprint(text);

            fingerprints.forEach(function(element){

                if(file !== element['name'] && (fuzzyFingerprint.CalculateCosineSimilarity(fingerprint, element['fingerprint']) > 0.75 ||
                fuzzyFingerprint.CalculateCommonElementAmount(fingerprint, element['fingerprint']) > 0.9))
                    console.log('match on: ' + file + ', ' + element['name']);
            });
        }
    });

    console.log('done');
});
*/


var DatabaseBuilder = require('./DatabaseBuilder');
var databaseBuilder = new DatabaseBuilder();
databaseBuilder.PopulateDatabase()
    .then(() => {
      console.log('done');
    })
    .catch(err => {
      throw err;
    });

/*
var FuzzyFingerprint = require('./FuzzyFingerprint');
var fuzzyFingerprint = new FuzzyFingerprint();
var IngestionEngine = require('./IngestionEngine');
var ingestionEngine = new IngestionEngine();


var text = fs.readFileSync('./text_files/original_texts/example4o.txt').toString('utf-8').replace(/"/g, '\"').replace(/'/g, '\'\'');

var k = 25;
var Winnowing = require('./Winnowing');
var winnow = new Winnowing(k);
var w = 30;
var formattedText = ingestionEngine.FormatTextForHash(text);
let fuzzy_fingerprint = fuzzyFingerprint.CalculateFuzzyFingerprint(text);
var winnow_fingerprint = winnow.Winnow(w, text, formattedText);

console.log('fuzzy: ' + fuzzy_fingerprint);
console.log('winnow: ' + winnow_fingerprint);
*/

/*
var DetectionEngine = require('./DetectionEngine');
var detectionEngine = new DetectionEngine();

var plagiarizedText = fs.readFileSync("./text_files/plagiarized_text/example1p.txt").toString('utf-8');

detectionEngine.DetectPlagiarism(plagiarizedText);
*/


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
