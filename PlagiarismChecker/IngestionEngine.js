


module.exports = class IngestionEngine {


    constructor() {
    }


    FormatTextForHash(text){
        return text.replace(/[^A-Za-z0-9]/g, '').toLowerCase();
    }



    FormatTextForHashWithStemming(text){
        var sw = require('stopword');
        var stemmer = require('stemmer');

        text = text.replace (/[^A-Za-z0-9\s]/g, '').toLowerCase();
        var words = sw.removeStopwords(text.split(' '));
        for(var i = 0; i < words.length; i++){
            words[i] = stemmer(words[i]);
        }

        return words.toString().replace(/[,]/g, ' ');
    }


    FormatTextForBagOfWords(text){
        var sw = require('stopword');
        var stemmer = require('stemmer');

        text = text.replace (/[^A-Za-z0-9\s]/g, '').toLowerCase();
        var words = sw.removeStopwords(text.split(' '));
        for(var i = 0; i < words.length; i++){
            words[i] = stemmer(words[i]);
        }

        return words;
        //text = sw.removeStopwords(text.split(' ')).toString();
        //return text.replace(/[,]/g, '');
    }



    GetKeywordMap(text){

        var retext = require('retext');
        var keywords = require('retext-keywords');
        var nlcstToString = require('nlcst-to-string');

        var keyword_map = [];

        var sentences = text.split('.');
        var global_pos = 0;
        var min_length = 3;

        for(let i = 0; i < sentences.length; i++){
            if(sentences[i].length > min_length) {
                var current_keywords = [];
                retext()
                    .use(keywords)
                    .process(sentences[i].replace(/[^A-Za-z0-9\s]/g, '').toLowerCase(), function (err, file) {
                            if (err) throw err;

                            file.data.keywords.forEach(function (keyword) {
                                current_keywords[current_keywords.length] = nlcstToString(keyword.matches[0].node);
                            });
                        }
                    );
                keyword_map[keyword_map.length] = [global_pos, global_pos + sentences[i].length, current_keywords];
            }
            global_pos += sentences[i].length + 1;

        }

        return keyword_map;
    }



    GetKeywords(text){
        var retext = require('retext');
        var keywords = require('retext-keywords');
        var nlcstToString = require('nlcst-to-string');

        var keyword_list = [];

        retext()
            .use(keywords)
            .process(text.replace(/[^A-Za-z0-9\s]/g, '').toLowerCase(), function (err, file) {
                    if (err) throw err;

                file.data.keywords.forEach(function (keyword) {
                    keyword_list[keyword_list.length] = nlcstToString(keyword.matches[0].node);
                });
            });

        return keyword_list;
    }


    ParseXmlToString(xml){

    }
};