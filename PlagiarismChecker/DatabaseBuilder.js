
module.exports = class DatabaseBuilder {

    constructor() {
    }

    //mysql -u root -p
    //use PlagiarismDetection

    async PopulateDatabase(){

        var fs = require("fs");
        var FuzzyFingerprint = require('./FuzzyFingerprint');
        var fuzzyFingerprint = new FuzzyFingerprint();
        var connection = require('./routes/connection');
        var IngestionEngine = require('./IngestionEngine');
        var ingestionEngine = new IngestionEngine();

        var Database = require('./routes/Database');
        var database = new Database();

        var k = 25;
        var Winnowing = require('./Winnowing');

        var path = '/media/austin/Data1/WikipediaArticles/z/';
        //var path = '/home/austin/Desktop/Projects/Plagiarism Detection/PlagiarismChecker/text_files/original_texts/';

        var files = fs.readdirSync(path);

        //files.forEach( function( file, index ) {

        var AddDocument = function(text){
            return new Promise(async function(resolve, reject) {
                connection.query('insert into document (text) values (?)', text, (err, res) => {
                    if(err)
                        reject(err);

                    resolve();
                });
            })
        };



        var GetDocumentId = function(text){
            return new Promise(async function(resolve, reject) {
                connection.query('select id from document where text = (?)', text, (err, res) => {
                    if(err || res.length === 0 || res === undefined)
                        reject(err);

                    resolve(res[0].id);
                });
            })
        };



        var AddFuzzyFingerprint = function(value, pos){
            return new Promise(function(resolve, reject) {
                connection.query('insert into fuzzy_fingerprint (pos, value) values (?, ?)', [pos, value], (err, res) => {
                    if(err && err.code !== 'ER_DUP_ENTRY')
                        reject(err);


                    resolve(res);
                });
            })
        };




        var GetFuzzyFingerprint = function(value, pos){
            return new Promise(function(resolve, reject) {
                connection.query('select id from fuzzy_fingerprint where pos = ? and value = ?', [pos, value], (err, res) => {
                    if(err || res.length === 0)
                        reject(err);

                    resolve(res[0].id);
                });
            })
        };


        var AddWinnowFingerprint = function(value, start, end){
            return new Promise(function(resolve, reject) {
                connection.query('insert into winnow_fingerprint (value, start, end) values (?, ?, ?)', [value, start, end], (err, res) => {
                    if(err )
                        reject(err);

                    resolve();
                });
            })
        };



        var GetWinnowFingerprint = function(value, start, end){
            return new Promise(function(resolve, reject) {
                connection.query('select id from winnow_fingerprint where value = ? and start = ? and end = ?', [value, start, end], (err, res) => {
                    if(err || res.length === 0)
                        reject(err);

                    resolve(res[0].id);
                });
            })
        };



        var AddFuzzyDocument = function(document_id, fuzzy_id){
            return new Promise(function(resolve, reject) {
                connection.query('insert into fuzzy_document (document_id, fuzzy_id) values (?, ?)', [document_id, fuzzy_id], (err, res) => {
                    if(err && err.code !== 'ER_DUP_ENTRY')
                        reject(err);

                    resolve();
                });
            })
        };


        var AddWinnowDocument = function(document_id, winnow_id){
            return new Promise(function(resolve, reject) {
                connection.query('insert into winnow_document (document_id, winnow_id) values (?, ?)', [document_id, winnow_id], (err, res) => {
                    if(err && err.code !== 'ER_DUP_ENTRY')
                        reject(err);

                    resolve();
                });
            })
        };


        var GetFileText = function(file, path){
            return new Promise(function(resolve, reject) {
                let text = fs.readFileSync(path + file).toString('utf-8').replace(/"/g, '\"').replace(/'/g, '\'\'');
                resolve(text);
            })
        };



        for(const file of files) {

            let doc_text;
            let document_id;

            GetFileText(file, path)
                .then(text => {
                    doc_text = text;
                    return text;
                })
                .then(() => AddDocument(path + file))
                .then(() => GetDocumentId(path + file))
                .then(id => {
                    document_id = id;
                })
                .then(() => fuzzyFingerprint.CalculateFuzzyFingerprint(doc_text))
                .then(fuzzy_fingerprint => {
                    fuzzy_fingerprint.forEach((value, pos) => {
                        AddFuzzyFingerprint(value, pos)
                            .then(() => GetFuzzyFingerprint(value, pos))
                            .then(fuzzy_id => AddFuzzyDocument(document_id, fuzzy_id))
                            .catch(err => {
                                throw err;
                            });

                    });
                })
        }
                /*
                .then(() => ingestionEngine.FormatTextForHash(doc_text))
                .then(formattedText => {
                    var winnow = new Winnowing(k);
                    var w = 30;
                    return winnow.Winnow(w, doc_text, formattedText);
                })
                .then(winnow_fingerprint => {
                    Object.keys(winnow_fingerprint).forEach((key) => {
                        AddWinnowFingerprint(key, winnow_fingerprint[key][0], winnow_fingerprint[key][1])
                            .then(() => GetWinnowFingerprint(key, winnow_fingerprint[key][0], winnow_fingerprint[key][1]))
                            .then(winnow_id => AddWinnowDocument(document_id, winnow_id))
                            .catch(err => {throw err;});
                    });
                })
                *
                //.then(() => {
                //   console.log('Added: ' + file);
                //})
                .catch(err => {throw err;});
        }

        /*
        files.forEach(async file => {
            try {
                var text = fs.readFileSync(path + file).toString('utf-8').replace(/"/g, '\"').replace(/'/g, '\'\'');
                let fuzzy_fingerprint = fuzzyFingerprint.CalculateFuzzyFingerprint(text);
                var winnow = new Winnowing(k);
                var w = 30;
                var formattedText = ingestionEngine.FormatTextForHash(text);
                var winnow_fingerprint = winnow.Winnow(w, text, formattedText);

                var document_id = await AddDocument(text);

                await fuzzy_fingerprint.forEach(async (value, pos) => {
                    var fuzzy_id = await AddFuzzyFingerprint(value, pos);
                    await AddFuzzyDocument(document_id, fuzzy_id);
                });


                await Object.keys(winnow_fingerprint).forEach(async (key) => {
                    var winnow_id = await AddWinnowFingerprint(key, winnow_fingerprint[key][0], winnow_fingerprint[key][1]);
                    await AddWinnowDocument(document_id, winnow_id);
                });

                process.nextTick(() => {console.log('Added: ' + file);});

            }catch(e) {
                console.log('error somewhere');
            }
        });
        */
    }
};