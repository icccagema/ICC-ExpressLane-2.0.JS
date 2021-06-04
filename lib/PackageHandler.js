module.exports = (function() {
    const fs = require('fs');
    const FrameHandler   = require('./FrameHandler.js');
    const OrderInfo = require('../model/OrderInfo.js');
    const AllProducts = require('../model/AllProducts.js');
    const JobQuoteProduct = require('../model/JobQuoteProduct.js');
    const { ProductFrameCollection } = require('../model/PartitionFrame.js');
    return {
        /** @type {ProductFrameCollection[]} */
        ProductCollection: [],
        /**
         * 
         * @param {JobQuoteProduct[]} itemLines 
         * @param {Object.<string, AllProducts>} itemCatalogDict 
         * @param {OrderInfo} crmOrderInfo 
         */
        ProcessPackages: function(crmItemLines, itemCatalogDict, crmOrderInfo) {
            var processedCollection = [];
            crmItemLines.map(function(o, i, a) {
                var catalogInfo = itemCatalogDict[o.ProductCode || o.Item];
                var packagePath = (`I:/Express/Manufacturing/_${catalogInfo.Type}/${catalogInfo.SubType}/${catalogInfo.ProductCode}/MFG_Manufacturing Report.txt`);
                //console.log(packagePath);
                if (fs.existsSync(packagePath)) {
                    var packageData = (fs.readFileSync(packagePath).toString());
                    Object.keys(crmOrderInfo).forEach(fieldKey => {
                        packageData = packageData.split(`{${fieldKey.toUpperCase()}}`).join(crmOrderInfo[fieldKey]);
                        packageData = packageData.split(`[ItemQty]`).join((o.Qty * o.OrderLineQty).toString());
                    });
                    var frameCol = FrameHandler.ParseFrames(packageData, catalogInfo.ProductCode);
                    frameCol.MFGRawText = packageData;
                    processedCollection.push(frameCol);
                    //mfgText += packageData + '\n\n';
                }
            });
            this.ProductCollection = processedCollection;
        }
    }
} ());