module.exports = (function() {
    const fs = require('fs');
    const { ProductFrameCollection, MFGHeader } = require('../model/PartitionFrame.js');
    return {
        /**
         * 
         * @param {ProductFrameCollection[]} parFrameCols 
         */
        FrameCollectionsToMFG: function(parFrameCols) {
            var mfgText =
                [
                    MFGHeader,
                    parFrameCols.map(col => col.toString().trim()).join('\n\n').trim()
                ].join('\n\n');
            return mfgText;
        },
        ExportMFG: function(mfgText, jobNbr) {
            fs.writeFileSync(`./${jobNbr}-MFG.txt`, mfgText);
        }
    }
} ());