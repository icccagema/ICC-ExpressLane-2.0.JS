module.exports = class {
    /** @type {number} */
    QuotePart = -1;
    /** @type {JobQuoteProduct[]} */
    ItemLines = [];
    //
    constructor(obj) {
        obj && Object.assign(this, obj);
    }
}