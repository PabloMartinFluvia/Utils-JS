import {assert} from '../../testing/assert-precondition/assert.mjs';

export class ClosedInterval {

    #max;
    #min;    

    constructor(max, min = 0) {
        assert(max >= min);

        this.#max = max;
        this.#min = min;        
    }

    isIncluded(value) {
        return this.#min <= value && value <= this.#max;
    }

}