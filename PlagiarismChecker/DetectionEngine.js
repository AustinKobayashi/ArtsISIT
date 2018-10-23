
module.exports = class DetectionEngine {

    constructor() {
    }



    DetectPlagiarism(text) {

        var FuzzyFingerprint = require('./FuzzyFingerprint');
        var fuzzyFingerprint = new FuzzyFingerprint();
        var fuzzy_fingerprint = fuzzyFingerprint.CalculateFuzzyFingerprint(text);
        var document_ids = null;

        this.GetMaxDocumentId()
            .then(results => this.SearchDBForFuzzyFingerprintMatch(fuzzy_fingerprint, results).then(similar_documents => {
                document_ids = similar_documents;
                return similar_documents;
            }))
            .then(similar_documents => this.SearchDBForWinnowFingerprintMatch(similar_documents, text))
            .then(matches => this.PrintResults(matches, document_ids, text))
            .catch(err => {throw err;} );

    }


    GetMaxDocumentId(){
        var connection = require('./routes/connection');
        return new Promise(function(resolve, reject){
            connection.query('select max(id) from document', (err, res) => {
                if(err)
                    throw err;

                resolve(res[0]['max(id)']);
            });
        });
    }



    async SearchDBForFuzzyFingerprintMatch(fuzzy_fingerprint, max_document_id){
        var FuzzyFingerprint = require('./FuzzyFingerprint');
        var fuzzyFingerprint = new FuzzyFingerprint();

        var similar_documents = [];

        for(var i = 1; i <= max_document_id; i++){
            var document_fingerprint = await this.GetDocumentFuzzyFingerprints(i);
            console.log(i + ': ' + document_fingerprint);

            //console.log(fuzzyFingerprint.DoFingerprintsMatch(fuzzy_fingerprint, document_fingerprint));

            if (fuzzyFingerprint.DoFingerprintsMatch(fuzzy_fingerprint, document_fingerprint))
                similar_documents.push(i);

            console.log('\n');
        }

        return similar_documents;
    }



    async GetDocumentFuzzyFingerprints(id){

        var connection = require('./routes/connection');
        return new Promise(function(resolve, reject){
            connection.query('select pos, value from fuzzy_document inner join fuzzy_fingerprint on fuzzy_id = id where document_id = ?', id, (err, res) => {
                if(err)
                    throw err;

                var fingerprint = Array.apply(null, Array(res.length)).map(Number.prototype.valueOf,0);

                res.forEach((packet) => {
                    fingerprint[packet.pos] = packet.value;
                });

                resolve(fingerprint);
            });
        });
    }


    async GetDocumentText(id){
        var connection = require('./routes/connection');
        return new Promise(function(resolve, reject){
            connection.query('select text from document where id = ?', id, (err, res) => {
                if(err)
                    throw err;

                var documentText = res[0].text;

                resolve(documentText);
            });
        });
    }



    async SearchDBForWinnowFingerprintMatch(similar_documents, text){

        var IngestionEngine = require('./IngestionEngine');
        var connection = require('./routes/connection');
        var ingestionEngine = new IngestionEngine();

        var doc_winnow = function(document_id, text, documentText, textFormatted, documentTextFormatted, k, w){
            return new Promise(function(resolve, reject){
                var Winnowing1 = require('./Winnowing');
                var Winnowing2 = require('./Winnowing');

                var results = {};

                var winnow1 = new Winnowing1(k);
                var winnow2 = new Winnowing2(k);

                var firstFingerPrints = winnow1.Winnow(w, text, textFormatted);
                var secondFingerPrints = winnow2.Winnow(w, documentText, documentTextFormatted);

                Object.keys(firstFingerPrints).forEach(function (key) {
                    if(secondFingerPrints[key] !== undefined) {
                        if (results[document_id] === undefined)
                            results[document_id] = [];
                        results[document_id].push([firstFingerPrints[key][0], firstFingerPrints[key][1], secondFingerPrints[key][0], secondFingerPrints[key][1]]);
                    }
                        //results.push([firstFingerPrints[key][0], firstFingerPrints[key][1], secondFingerPrints[key][0], secondFingerPrints[key][1]]);
                });


                resolve(results);
            });
        };

        var doc_text = function(document_id){
                //var connection = require('./routes/connection');
            return new Promise(function(resolve, reject){
                connection.query('select text from document where id = ?', document_id, (err, res) => {
                    if(err)
                        throw err;

                    var documentText = res[0].text;

                    resolve(documentText);
                });
            });
        };


        var textFormatted = ingestionEngine.FormatTextForHash(text);

        return await Promise.all(similar_documents.map(async (document_id) => {

            var documentText = await doc_text(document_id);
            var documentTextFormatted = await ingestionEngine.FormatTextForHash(documentText);
            return await doc_winnow(document_id, text, documentText, textFormatted, documentTextFormatted, 25, 50);
            //await results.push(winnow);
        }));
    }



    async PrintResults(matches, document_ids, text){

        var connection = require('./routes/connection');

        var doc_text = function(document_id){
            //var connection = require('./routes/connection');
            return new Promise(function(resolve, reject){
                connection.query('select text from document where id = ?', document_id, (err, res) => {
                    if(err)
                        throw err;

                    var documentText = res[0].text;

                    resolve(documentText);
                });
            });
        };

        var PrintMatch = function(positions, text, document_text){
            return new Promise(function(resolve, reject){
                console.log('================================================');
                console.log(text.substring(positions[0], positions[1]));
                console.log(document_text.substring(positions[2], positions[3]));
                resolve();
            })
        };

        matches.forEach(async (match) => {
            var document_id = Object.keys(match)[0];
            if(document_ids.includes(parseInt(document_id))){
                var document_text = await doc_text(parseInt(document_id));
                var all_positions = await match[document_id];
                all_positions.forEach(async (positions) =>{
                    await PrintMatch(positions, text, document_text);
                });
            }
        });
    }


































    OldDetectPlagiarism(plagiarizedText, originalText){

        var IngestionEngine = require('./IngestionEngine');
        var ingestionEngine = new IngestionEngine();

        var plagiarizedTextFormatted = ingestionEngine.FormatTextForHash(plagiarizedText);
        var originalTextFormatted = ingestionEngine.FormatTextForHash(originalText);

        var results = this.CalculateWinnow(plagiarizedText, originalText, plagiarizedTextFormatted, originalTextFormatted, 50, 100);

        var plagiarized_percent = this.CalculatePercentCover(results) / plagiarizedText.length;

        if(plagiarized_percent <= 0.3){
            results.concat(this.CalculateWinnow(plagiarizedText, originalText, plagiarizedTextFormatted, originalTextFormatted, 25, 50));
        }

        plagiarized_percent = this.CalculatePercentCover(results) / plagiarizedText.length;

        console.log(plagiarized_percent);
    }


    CalculateWinnow(plagiarizedText, originalText, plagiarizedTextFormatted, originalTextFormatted, k, w){
        var Winnowing1 = require('./Winnowing');
        var Winnowing2 = require('./Winnowing');

        var results = [];

        var winnow1 = new Winnowing1(k);
        var winnow2 = new Winnowing2(k);

        var firstFingerPrints = winnow1.Winnow(w, plagiarizedText, plagiarizedTextFormatted);
        var secondFingerPrints = winnow2.Winnow(w, originalText, originalTextFormatted);

        Object.keys(firstFingerPrints).forEach(function (key) {
            if(secondFingerPrints[key] !== undefined)
                results.push([firstFingerPrints[key][0], firstFingerPrints[key][1], secondFingerPrints[key][0], secondFingerPrints[key][1]]);
        });


        return results;
    }



    CalculatePercentCover(results){

        var forEach = require('async-foreach').forEach;

        var cover = 0;

        forEach(results, function(item) {
            cover += item[1] - item[0];
        });

        return cover;
    }
};