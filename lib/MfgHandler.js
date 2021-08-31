module.exports = (function() {
    const fs = require('fs');
    const { ProductFrameCollection, MFGHeader } = require('../model/PartitionFrame');
    return {
        /**
         * 
         * @param {ProductFrameCollection[]} parFrameCols 
         */
        FrameCollectionsToMFG: function(parFrameCols) {
            /** @type {Object.<string, ProductFrameCollection>} */
            var consolidated = {};
            parFrameCols.forEach(col => {
                //console.log(col.ProductCode + "  " + col.ProductQty.toString());
                if (consolidated[col.ProductCode])
                    consolidated[col.ProductCode].ProductQty += col.ProductQty;
                else
                    consolidated[col.ProductCode] = col;
            });
            //console.log(parFrameCols.length + "  " + Object.keys(consolidated).length);
            var mfgText =
                [
                    MFGHeader,
                    [...Object.values(consolidated)].
                        map(col => {
                            //console.log(col.ProductQty.toString());
                            return col.toString().trim().split("[ItemQty]").join(col.ProductQty.toString());
                        }).
                        join('\n\n').
                        trim()
                ].join('\n\n');
            return mfgText;
        },
        ExportMFG: function(mfgText, jobNbr) {
            fs.writeFileSync(`./${jobNbr}-MFG.txt`, mfgText);
        }
    }
} ());