module.exports = class {
    /** @type {string} */
    ProductId;

    /** @type {string} */
    ProductCode;

    /** @type {string} */
    ProductDescription;

    /** @type {string} */
    Type;

    /** @type {string} */
    SubType;

    /** @type {string} */
    Option01;

    /** @type {string} */
    Option02;

    /** @type {string} */
    Option03;

    /** @type {string} */
    Option04;

    /** @type {string} */
    Option05;

    /** @type {string} */
    Option06;

    /** @type {string} */
    Option07;

    /** @type {string} */
    Option08;

    /** @type {string} */
    Option09;

    /** @type {number} */
    Depth;

    /** @type {number} */
    Width;

    /** @type {number} */
    Height;

    /** @type {number} */
    Weight;

    /** @type {string} */
    ModifiedOn;

    //
    constructor(obj) {
        obj && Object.assign(this, obj);
    }
}