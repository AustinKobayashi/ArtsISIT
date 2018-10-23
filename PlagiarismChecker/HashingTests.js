
module.exports = class HashingTest {

    constructor(){}

    Test(){

        var assert = require('assert');
        var HashFunction = require('./HashFunction');
        var IngestionEngine = require('./IngestionEngine');
        var ingestionEngine = new IngestionEngine();

        //var text = ingestionEngine.FormatTextForHash('Only two years later, all these friendly Sioux were suddenly plunged into new conditions, including starvation, martial law on all their reservations, and constant urging by their friends and relations to join in warfare against the treacherous government that had kept faith with neither friend nor foe.');
        var text = ingestionEngine.FormatTextForHash('Contrast the condition into which all these friendly Indians are suddenly plunged now, with their condition only two years previous: martial law now in force on all their reservations; themselves in danger of starvation, and constantly exposed to the influence of emissaries from their friends and relations, urging them to join in fighting this treacherous government that had kept faith with nobody--neither with friend nor with foe.');

        for(let k = 15; k < 50; k += 5){
            var hash = new HashFunction(k);

            let prevKGram = text.substring(0, k);
            let prevHash = hash.Hash(prevKGram);

            for(let i = 0; i < text.length - k; i++){

                let curKGram = text.substring(i, i+k);
                let curHash = hash.Hash(curKGram);
                let curRollingHash = hash.RollingHash(prevHash, prevKGram, curKGram);

                console.log(curKGram + ', ' + curHash + ', ' + curRollingHash);
                assert(curHash === curRollingHash);

                prevKGram = curKGram;
                prevHash = curHash;
            }
        }
    }
};