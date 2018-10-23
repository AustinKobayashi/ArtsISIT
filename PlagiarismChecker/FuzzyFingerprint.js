module.exports = class FuzzyFingerprint {

    constructor() {
        this.total_frequency = [ 0.08773912973117777,
            0.009652420509294869,
            0.3616763356207911,
            0.5581108651246777,
            0.46195820126875087,
            0.004573362166435183,
            2.0631080573895465e-22,
            0.017188836203108564,
            0.16521790807667994,
            0.000010899403019086897,
            1.4273551126075257e-7,
            7.780933063374544e-9,
            0.13874929663596175,
            0.0008321830382437919,
            0.2940217712900307,
            0.000816321168191219,
            1.7367551915855438e-23,
            0.2746848689984438,
            0.2690622630982518,
            0.2349646614545664,
            1.806413778827896e-26,
            1.736755142216102e-23,
            0.011540908821446493,
            9.665954802823159e-29,
            0.0017510132795850457,
            2.301396188422925e-78 ];
    }


    CalculateBNCFingeprint(){
        var fs = require("fs");
        var IngestionEngine = require('./IngestionEngine');
        var ingestionEngine = new IngestionEngine();
        var _this = this;

        // Loop through all the files in the temp directory
        fs.readdir('./BNC', function( err, files ) {

            if( err ) {
                console.error( "Could not list the directory.", err );
                process.exit( 1 );
            }

            files.forEach( function( file, index ) {
                // Make one pass and make the file complete
                var text = fs.readFileSync('./BNC/' + file).toString('utf-8');
                var keywords = ingestionEngine.GetKeywords(text);
                var frequencies = Array.apply(null, Array(26)).map(Number.prototype.valueOf,0);
                keywords.forEach(function(keyword){

                    frequencies[keyword.charCodeAt(0) - 97] ++;
                });

                //console.log(frequencies);
                _this.AddFrequencyToTotalFrequency(frequencies, _this);
            });

            console.log(_this.total_frequency);
            console.log('done!');
        });
    }


    CalculateFuzzyFingerprint(text){

        var IngestionEngine = require('./IngestionEngine');
        var ingestionEngine = new IngestionEngine();
        var keywords = ingestionEngine.GetKeywords(text);
        //console.log(keywords);
        var frequencies = Array.apply(null, Array(26)).map(Number.prototype.valueOf,0);
        keywords.forEach(function(keyword){
            frequencies[keyword.charCodeAt(0) - 97] ++;
        });

        var deviation_vector = this.CalculateDeviationVector(frequencies);
        var fuzzification_intervals = this.CalculateFuzzificationIntervals(deviation_vector);

        var fingerprint = Array.apply(null, new Array(frequencies.length)).map(Number.prototype.valueOf,0);

        for(var i = 0; i < frequencies.length; i++){

            fingerprint[i] = fuzzification_intervals[i] * i; //Math.pow(3, i);
        }

        //console.log('got fingerprint');
        //console.log('plag fingerprint: ' + fingerprint);
        return fingerprint;
    }



    DetectPlagiarism(text1, text2){
        var IngestionEngine = require('./IngestionEngine');
        var ingestionEngine = new IngestionEngine();
        var keywords1 = ingestionEngine.GetKeywords(text1);
        var frequencies1 = Array.apply(null, Array(26)).map(Number.prototype.valueOf,0);
        keywords1.forEach(function(keyword){
            frequencies1[keyword.charCodeAt(0) - 97] ++;
        });

        var deviation_vector1 = this.CalculateDeviationVector(frequencies1);
        var fuzzification_intervals1 = this.CalculateFuzzificationIntervals(deviation_vector1);
        //console.log(deviation_vector1);
        //console.log(fuzzification_intervals1);
        //console.log("==================================================");

        var fingerprint1 = Array.apply(null, new Array(frequencies1.length)).map(Number.prototype.valueOf,0);

        for(var i = 0; i < frequencies1.length; i++){

            fingerprint1[i] = fuzzification_intervals1[i] * i; //Math.pow(3, i);
        }


        var keywords2 = ingestionEngine.GetKeywords(text2);
        var frequencies2 = Array.apply(null, Array(26)).map(Number.prototype.valueOf,0);
        keywords2.forEach(function(keyword){
            frequencies2[keyword.charCodeAt(0) - 97] ++;
        });

        var deviation_vector2 = this.CalculateDeviationVector(frequencies2);
        var fuzzification_intervals2 = this.CalculateFuzzificationIntervals(deviation_vector2);

        var fingerprint2 = Array.apply(null, new Array(frequencies2.length)).map(Number.prototype.valueOf,0);

        for(var i = 0; i < frequencies2.length; i++){

            fingerprint2[i] = fuzzification_intervals2[i] * i; //Math.pow(3, i);
        }


        //console.log(fingerprint1);
        //console.log(fingerprint2);

        var similarity = this.CalculateCosineSimilarity(fingerprint1, fingerprint2);
        var common = this.CalculateCommonElementAmount(fingerprint1, fingerprint2);

        if(similarity > 0.75 || common > 0.9)
            return true;

        return false;
    }



    DoFingerprintsMatch(fingerprint1, fingerprint2){

        var similarity = this.CalculateCosineSimilarity(fingerprint1, fingerprint2);
        var common = this.CalculateCommonElementAmount(fingerprint1, fingerprint2);

        console.log('similarirty: ' + similarity);
        console.log('common: ' + common);

        if(similarity > 0.75 || common > 0.9) {
            console.log(true);
            return true;
        }

        console.log(false);
        return false;
    }




    CalculateCommonElementAmount(frequency_a, frequency_b){

        var num_common = 0;

        for(var i = 0; i < frequency_a.length; i++){
            if(frequency_a[i] === frequency_b[i])
                num_common++;
        }

        //console.log(num_common / frequency_a.length);
        return num_common / frequency_a.length;
    }


    CalculateCosineSimilarity(frequency_a, frequency_b){

        var a_dot_b = 0;

        for(var i = 0; i < frequency_a.length; i++){
            a_dot_b += frequency_a[i] * frequency_b[i];
        }

        var l2_a = 0;
        var l2_b = 0;

        for(var i = 0; i < frequency_a.length; i++) {
            l2_a += Math.pow(frequency_a[i], 2);
            l2_b += Math.pow(frequency_b[i], 2);
        }

        l2_a = Math.sqrt(l2_a);
        l2_b = Math.sqrt(l2_b);

        var similarity = a_dot_b / (l2_a * l2_b);

        //console.log(similarity);

        return similarity;
    }


    CalculateDeviationVector(frequency){

        var standard_deviation_vector = Array.apply(null, new Array(frequency.length)).map(Number.prototype.valueOf,0);

        for(var i = 0; i < frequency.length; i++){

            var mean = (this.total_frequency[i] + frequency[i]) / 2;
            var sd_vec = [0, 0];
            sd_vec[0] = Math.pow(this.total_frequency[i] - mean, 2);
            sd_vec[1] = Math.pow(frequency[i] - mean, 2);
            standard_deviation_vector[i] = Math.sqrt(sd_vec.reduce((a, b) => a + b, 0) / 2);
        }

        return standard_deviation_vector;
    }


    CalculateFuzzificationIntervals(deviation_vector){

        var splits = [0.15, 0.4];
        var fuzzification_intervals = Array.apply(null, new Array(deviation_vector.length)).map(Number.prototype.valueOf,0);

        for(var i = 0; i < deviation_vector.length; i++) {

            for(var r = 0; r < splits.length; r++){
                if (deviation_vector[i] < splits[r]) {
                    fuzzification_intervals[i] = r;
                    break;
                }
            }

            if (deviation_vector[i] >= splits[splits.length-1])
                fuzzification_intervals[i] = splits.length;
        }

        return fuzzification_intervals;
    }


    CalculateStandardDeviationVector(frequency){

        var mean = 0;

        mean = this.total_frequency.reduce((a,b) => a + b, 0) / this.total_frequency.length;

        var sd_vec = this.total_frequency;
        for(var i = 0; i < sd_vec.length; i++){
            sd_vec[i] = Math.pow(sd_vec[i] - mean, 2);
        }

        var deviation = Math.sqrt(sd_vec.reduce((a, b) => a + b, 0) / this.total_frequency.length);

        console.log('deviation: ' + deviation);

        for(var i = 0; i < frequency; i++){

        }
    }


    AddFrequencyToTotalFrequency(frequency, _this){
        frequency = _this.NormalizeFrequency(frequency);
        for(var i = 0; i < frequency.length; i++){
            _this.total_frequency[i] += frequency[i];
        }

        _this.total_frequency = _this.NormalizeFrequency(_this.total_frequency);
    }


    NormalizeFrequency(frequency){
        let base = 0;
        frequency.forEach(function(magnitude){
           base += Math.pow(magnitude, 2);
        });
        base = Math.sqrt(base);

        for(var i = 0; i < frequency.length; i++){
            frequency[i] = frequency[i] / base;
        }

        return frequency;
    }
};