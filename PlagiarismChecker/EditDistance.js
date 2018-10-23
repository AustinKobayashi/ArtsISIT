

module.exports = class EditDistance {

    constructor() {
    }


    CalculateEditDistance(originalText1, originalText2, keyword_map1, keyword_map2, keyword_threshold, edit_distance_threshold){
        var levenshtein = require('levenshtein-edit-distance');

        var similarities = this.GenerateSimilarityList(keyword_map1, keyword_map2);

        for(var i = 0; i < similarities.GetLength(); i++){
            if(similarities.GetNthMax(i)[2] >= keyword_threshold){

                var text1 = this.FormatTextForEditDistance(originalText1.substring(keyword_map1[similarities.GetNthMax(i)[0]][0], keyword_map1[similarities.GetNthMax(i)[0]][1]));
                var text2 = this.FormatTextForEditDistance(originalText2.substring(keyword_map2[similarities.GetNthMax(i)[1]][0], keyword_map2[similarities.GetNthMax(i)[1]][1]));

                var editDistance = levenshtein(text1, text2);

                var length1 = text1.length;
                var length2 = text2.length;

                if(editDistance / Math.max(length1, length2) >= edit_distance_threshold) {

                    console.log(editDistance / Math.max(length1, length2));
                    console.log(originalText1.substring(keyword_map1[similarities.GetNthMax(i)[0]][0], keyword_map1[similarities.GetNthMax(i)[0]][1]));
                    console.log(originalText2.substring(keyword_map2[similarities.GetNthMax(i)[1]][0], keyword_map2[similarities.GetNthMax(i)[1]][1]));
                    console.log('================================================================');
                }
            }
        }
    }



    GenerateSimilarityList(keyword_map1, keyword_map2){

        var MaxHeap = require('./MaxHeap');
        var similarities = new MaxHeap();

        for(var i = 0; i < keyword_map1.length; i++){
            for(var j = 0; j < keyword_map2.length; j++){
                similarities.Insert([i, j, this.CalculateSimilarity(keyword_map1[i][2], keyword_map2[j][2])]);
            }
        }

        //similarities.PrintHeap();

        return similarities;
    }



    CalculateSimilarity(keywords1, keywords2){

        var similarities = 0;

        keywords1.forEach(function(word1){
           keywords2 .forEach(function(word2){
              if(word1 === word2)
                  similarities++;
           })
        });

        return similarities / Math.max(keywords1.length, keywords2.length);
    }



    FormatTextForEditDistance(text){
        var sw = require('stopword');
        var stemmer = require('stemmer');

        text = text.replace (/[^A-Za-z0-9\s]/g, '').toLowerCase();
        var words = sw.removeStopwords(text.split(' '));
        for(var i = 0; i < words.length; i++){
            words[i] = stemmer(words[i]);
        }

        return words.toString().replace(/[,]/g, ' ');
    }
};