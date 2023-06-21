const { EOL } = require('os');
class ProductFrameCollection {

    /** @type {string} */
    ProductCode;

    /** @type {number} */
    ProductQty

    /** @type {PartitionFrame[]} */
    PartitionFrames = [];

    /** @type {MFGItem[]} */
    ShipLooseItems = [];

    /** @type {string} */
    PackagePath = '';

    /**
     * 
     * @param {PartitionFrame[]} partitionFrames 
     * @param {MFGItem[]} shiploose 
     */
    constructor(partitionFrames = [], shiploose = []) {
        partitionFrames.forEach(v =>
            this.PartitionFrames.push(v));
        shiploose.forEach(v =>
            this.ShipLooseItems.push(v));
        this.ProductQty = 0;
    }

    /**
     * Converting object back to mfg line 
     * @returns MFG String
     */
    toString() {
        var text =
            [
                this.PartitionFrames.
                    map(p =>
                        p.toString()).
                    join(EOL).
                    trim(),
                this.ShipLooseItems.
                    sort((a,b) =>
                        a.PartNo > b.PartNo ? 1 : -1).
                    map(m =>
                        m.toString()).
                    join(EOL).
                    trim()
            ].join(EOL);
            
        return text;
    }

    PdfDrawings() {

    }
}

class PartitionFrame {
    /** @type {string} */
    FrameId = '';

    /** @type {string} */
    PartitionFrameMfgLine = '';

    /** @type {MFGItem[]} */
    AssembledItems = [];

    constructor() {

    }

    /**
     * Converting object back to mfg line 
     * @returns MFG String
     */
    toString() {
        var text =
            [
                this.PartitionFrameMfgLine,
                this.AssembledItems.
                    sort((a,b) =>
                        a.PartNo > b.PartNo ? 1 : -1).
                    map(mfgi =>
                        mfgi.toString()).
                    join(EOL).
                    trim()
            ].join(EOL);
        return text;
    } 
}

const MFGHeader = `PartNo|Qty|Type|SubType|Description|Depth|Width|Height|UserTag|Option01|Option02|Option03|Option04|Option05|Option06|Option07|Option08|Option09|Assembled|TileIndicator`;
const MFGHeaderMap = {
    PartNo: 0,
    Qty: 1,
    Type: 2,
    SubType: 3,
    Description: 4,
    Depth: 5,
    Width: 6,
    Height: 7,
    UserTag: [8, 9, 10],
    Option01: 11,
    Option02: 12,
    Option03: 13,
    Option04: 14,
    Option05: 15,
    Option06: 16,
    Option07: 17,
    Option08: 18,
    Option09: 19,
    Assembled: 20,
    TileIndicator: 21
};
const MFGHeaderTypes = {
    PartNo: String,
    Qty: Number,
    Type: String,
    SubType: String,
    Description: String,
    Depth: Number,
    Width: Number,
    Height: Number,
    UserTag: null,
    Option01: String,
    Option02: String,
    Option03: String,
    Option04: String,
    Option05: String,
    Option06: String,
    Option07: String,
    Option08: String,
    Option09: String,
    Assembled: String,
    TileIndicator: String
};


class MFGItem {
    /** @type {string} */
    PartNo;

    /** @type {number} */
    Qty;

    /** @type {string} */
    Type;

    /** @type {string} */
    SubType;

    /** @type {string} */
    Description;

    /** @type {number} */
    Depth;

    /** @type {number} */
    Width;

    /** @type {number} */
    Height;

    /** @type {UserTag} */
    UserTag;

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

    /** @type {string} */
    Assembled;

    /** @type {string} */
    TileIndicator;

    /**
     * @param {string} mfgline 
     */
    constructor(mfgline) {
        var splitLine = mfgline.split('|');
        Object.keys(MFGHeaderMap).forEach(hKey => {
            var hVal = MFGHeaderMap[hKey];
            if  (hKey != 'UserTag') {
                var valType = MFGHeaderTypes[hKey];;
                var value = splitLine[hVal];
                this[hKey] = (
                        valType == Number ?
                        ( value.includes('[') ? 1 : (parseFloat(value) || '') ) :
                        value
                    );
            } else {
                this[hKey] =
                    new UserTag(
                        MFGHeaderMap[hKey].map(v =>
                            splitLine[v]
                        )
                    );
            }
        });
    }

    /**
     * Converts object back to mfg line 
     * @returns MFG String
     */
    toString() {
        return Object.keys(MFGHeaderMap).map(k =>
                this[k].toString()
            ).join('|');
    }
}

class UserTag {
    /** @type {number} */
    Area;

    /** @type {number} */
    Multi;

    /** @type {string} */
    JobNum;

    /**
     * @param {string[]} stringArr 
     */
    constructor(stringArr) {
        if (!stringArr || stringArr.length == 0)
            return;
        this.Area = parseInt(stringArr[0]);
        this.Multi = (!stringArr[1].includes('[') ? parseInt(stringArr[1]) : stringArr[1]);
        this.JobNum = stringArr[2];
    }
    
    /**
     * Converts object back to mfg line 
     * @returns MFG String
     */
    toString() {
        return [
            this.Area,
            this.Multi,
            this.JobNum
        ].join('|');
    }
}

module.exports = {
    ProductFrameCollection,
    PartitionFrame,
    MFGItem,
    UserTag,
    MFGHeader
};