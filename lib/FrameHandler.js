module.exports = (function() {
    const { ProductFrameCollection, PartitionFrame, MFGItem } = require('../model/PartitionFrame.js');
    return {
        /**
         * 
         * @param {string} mfgText 
         * @param {string} prodCode 
         * @returns {ProductFrameCollection} Collection of all the Products frames and shiploose/non-assembled mfg items
         */
        ParseFrames: function(mfgText, prodCode) {
            var mfgItems =
                mfgText.split('\n').
                    filter(v => v.trim() != '').
                    map(v => new MFGItem(v.trim()));
            /** @type {Object.<string, PartitionFrame>} */
            var frames = {};
            mfgItems.
                filter(mfgItem => mfgItem.Description.toLowerCase().trim() == 'assembled partition frame').
                forEach(apf => {
                    //console.log(apf.PartNo);
                    var pf = new PartitionFrame();
                    pf.PartitionFrameMfgLine = apf.toString();
                    pf.FrameId = apf.PartNo;
                    frames[apf.PartNo] = pf
                });
            mfgItems.
                forEach(mfgItem => {
                    if (Object.keys(frames).includes(mfgItem.Assembled))
                        frames[mfgItem.Assembled].AssembledItems.push(mfgItem);
                });

            //console.log(Object.keys(frames));
            
            var shiploose =
                mfgItems.
                    filter(mfgItem => [`{Loose:${prodCode}}`, ''].includes(mfgItem.Assembled.trim()) && !mfgItem.PartNo.includes(prodCode)).
                    map(mfgItem => { mfgItem.Assembled = ''; return mfgItem; });

            var prodFrameCol = new ProductFrameCollection([... Object.values(frames)], shiploose);

            //console.log(JSON.stringify(prodFrameCol, null, 2));

            return prodFrameCol;
        }
    };
} ());