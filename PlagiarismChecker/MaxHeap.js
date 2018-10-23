

module.exports = class MaxHeap {

    constructor(){
        this.heap = [];
    }


    Insert(k){
        var value = k[2];
        var index = this.heap.length;
        this.heap[index] = k;
        var parent_index = index % 2 === 0 ? (index - 2) / 2 : (index - 1) / 2;

        if(this.heap.length <= 1)
            return;

        while(this.heap[parent_index][2] < value){
            this.Swap(parent_index, index);
            index = parent_index;
            parent_index = index % 2 === 0 ? (index - 2) / 2 : (index - 1) / 2;
            if(index === 0)
                break;
        }
    }


    Swap(i, j){
        var temp = this.heap[i];
        this.heap[i] = this.heap[j];
        this.heap[j] = temp;
    }



    PrintHeap(){
        console.log(this.heap);
    }


    GetLength(){
        return this.heap.length;
    }


    GetNthMax(n){
        return this.heap[n];
    }
};











