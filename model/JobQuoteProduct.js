module.exports = class {
    /** @type {string} */
    OrderNbr;

    /** @type {number} */
    OrderLineNbr;

    /** @type {number} */
    OrderLineQty;

    /** @type {string} */
    JobNbr;

    /** @type {number} */
    QuotePart;

    /** @type {string} */
    Item;

    /** @type {string} */
    ProductCode;

    /** @type {string} */
    Description;

    /** @type {number} */
    Qty;

    /** @type {string} */
    Type;

    /** @type {string} */
    CreationDate;

    //
    constructor(obj) {
        obj && Object.assign(this, obj);
    }
}