
module.exports = class HashFunction {

    constructor(kGramLength) {
        this.base = 3;
        this.prime = 1301081;

        if(kGramLength > 2) {
            this.baseOffset = this.base % this.prime;
            for (let i = 1; i < kGramLength - 1; i++) {
                this.baseOffset = (this.baseOffset * this.base) % this.prime;
            }

            //this.baseOffset *= this.base;
        } else
            this.baseOffset = this.base;

        //console.log('offset: ' + this.baseOffset);

    }


    Hash(kGram) {

        let hash = 0;

        for (let i = 0; i < kGram.length; i++) {
            hash = ((hash + kGram.charCodeAt(i)) % this.prime) * this.base;
        }

        return hash / this.base;
    }


    RollingHash(oldHash, prevKGram, kGram){

        if(prevKGram === kGram)
            return this.Hash(kGram);

        if(kGram === 'rnmentthathadkeptfaithwit')
            console.log('');

        var a = oldHash + this.prime;
        var b = prevKGram.charCodeAt(0) * this.baseOffset % this.prime;
        var c = (a - b) * this.base;
        var d = c + kGram.charCodeAt(kGram.length - 1);
        var e = d % this.prime;
        return e;

        /*
        return ((oldHash + this.prime - (prevKGram.charCodeAt(0) * this.baseOffset) % this.prime) *
            this.base + kGram.charCodeAt(kGram.length - 1)) % this.prime;
            */
    }
};
