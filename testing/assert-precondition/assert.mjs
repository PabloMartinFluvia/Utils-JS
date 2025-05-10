class AssertionError extends Error {

    constructor(description) {
        super(description);
        this.name = "AssertionError";
    }
}

function assert(condition, description){
    if (assert.ENABLED && !condition) {
        throw new AssertionError(description ?? "pre-condition failed");
    }    
}

assert.ENABLED = false; // disable assert in production
//assert.ENABLED = true; // enable assert in dev

export {assert};