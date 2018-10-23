
module.exports = class Winnowing {

    constructor(k){
        this.k = k;
        this.numNonLetterChars = 0;

        let HashFunction = require('./HashFunction');
        this.HashFunction = new HashFunction(this.k);
        this.fingerprints = {};

        this.globalPos = 0;
        this.globalPositions = [];
    }



    Winnow(windowSize, originalText, formattedText){

        let window = [];
        let kGrams = [];
        let r = 0;
        let min = 0;

        let prevKGram = formattedText.substring(0, this.k);
        kGrams[0] = prevKGram;
        let prevHash = this.HashFunction.Hash(prevKGram);

        for(let i = 0; i < formattedText.length - windowSize; i++){
            r = (r + 1) % windowSize;

            if(i === 0){
                window[r] = prevHash;
            } else {
                prevHash = this.HashFunction.RollingHash(prevHash, prevKGram, formattedText.substring(i, i + this.k));
                window[r] = prevHash;
            }

            prevKGram = formattedText.substring(i, i + this.k);
            kGrams[r] = prevKGram;
            this.UpdateGlobalPositions(originalText, r);

            //console.log(prevKGram + ', i: ' + i + ', # non char: ' + (this.numNonLetterChars) + ', pos: ' + (i + this.numNonLetterChars) + ', hash: ' + prevHash);

            if(min === r){

                for(let j = (r - 1) % windowSize; j != r; j = (j - 1 + windowSize) % windowSize)
                    if(window[j] < window[min])
                        min = j;

                this.Record(window[min], min, r, windowSize, i, kGrams[min], originalText, this.globalPositions[this.Mod(min - 1, windowSize)]);
            } else {

                if(window[r] <= window[min]){
                    min = r;
                    this.Record(window[min], min, r, windowSize, i, kGrams[min], originalText, this.globalPositions[this.Mod(min - 1, windowSize)]);
                }
            }
        }


        return this.fingerprints;
    }



    Mod(number, mod){
        return ((number % mod) + mod) % mod;
    }



    UpdateGlobalPositions(originalText, r) {

        this.globalPos++;

        while (/\W/.test(originalText.charAt(this.globalPos))) {
            this.globalPos++;
        }

        this.globalPositions[r] = this.globalPos;
    }



    GetKGramEndPosition(originalText, pos){

        if(pos === 725){
            console.log('');
        }
        let numChars = 0;
        while(numChars !== this.k){
            let char = originalText.charAt(pos);
            if(/\w/.test(originalText.charAt(pos))){
                numChars++;
            }
            pos++;
        }

        return pos;
    }



    Record(hash, min, r, w, i, kGram, originalText, pos){

        //console.log(kGram + '   ' + this.numNonLetterChars + '  ' + r + '   ' + i + '   ' + min + '  ' + hash + '   ' + pos);
        //console.log(hash);
        //this.fingerprints[hash] = i - ((r + 1) - min) + this.numNonLetterChars;
        this.fingerprints[hash] = [pos, this.GetKGramEndPosition(originalText, pos)];
        //this.fingerprints[hash] = kGram;
    }
};