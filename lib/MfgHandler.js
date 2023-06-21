const PackageHandler = require('./PackageHandler');

module.exports = (function() {
    const fs = require('fs');
    const { EOL } = require('os');
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
                            //      ||||    A063071    |||||||||||||||||
                            return `||||${`${''.padEnd(5, ' ')}${col.ProductCode.toString().padEnd(25, ' ')} [Qty: ${col.ProductQty.toString().padStart(3, '0')}]${''.padEnd(5, ' ')}`}|||||||||${''.padEnd(5, ' ')}(Auto-Generated Snippet) ${`(Pkg Last Modified: ${PackageHandler.PackageModificationTimes[col.ProductCode].toLocaleString()})`.padEnd(' ', 46)}${''.padEnd(5, ' ')}||||||||${EOL}` + col.toString().trim().split("[ItemQty]").join(col.ProductQty.toString()).trim();
                        }).
                        join(EOL).trim()
                ].join(EOL).trim();
            return mfgText + EOL;
        },
        ExportMFG: function(mfgText, jobNbr) {
            if (!fs.existsSync(`C:/${jobNbr}`))
                fs.mkdirSync(`C:/${jobNbr}`);
            fs.writeFileSync(`C:/${jobNbr}/MFG_Manufacturing Report.txt`, mfgText);
        }
    }
} ());