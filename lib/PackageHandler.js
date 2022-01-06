module.exports = (function() {
    const fs = require('fs');
    const FrameHandler   = require('./FrameHandler');
    const OrderInfo = require('../model/OrderInfo');
    const AllProducts = require('../model/AllProducts');
    const JobQuoteProduct = require('../model/JobQuoteProduct');
    const { ProductFrameCollection } = require('../model/PartitionFrame');
    const ItemCatalog = require('./ItemCatalog');
    return {
        /** @type {ProductFrameCollection[]} */
        ProductCollection: [],
        /** @type {Object.<string, Date>} */
        PackageModificationTimes: {},
        /**
         * 
         * @param {JobQuoteProduct[]} itemLines 
         * @param {Object.<string, AllProducts>} itemCatalogDict 
         * @param {OrderInfo} crmOrderInfo 
         */
        ProcessPackages: function(crmItemLines, itemCatalogDict, crmOrderInfo) {
            var processedCollection = [];
            var ItemsNotInCatalog =
                crmItemLines.filter(o =>
                    itemCatalogDict[o.ProductCode || o.Item] == null
                ).map(o => (o.ProductCode || o.Item));
            if (ItemsNotInCatalog.length != 0)
                console.log(
                    `Items skipped for not being in product catalog:\n${ItemsNotInCatalog.map(i => `> ${i}`).join('\n')}`
                );

            var ValidItems =
                crmItemLines.filter(o =>
                    !ItemsNotInCatalog.includes(o.ProductCode || o.Item)
                );

            const packageModTimes = {};
            
            ValidItems.forEach(function(o, i, a) {
                var itemCode = o.ProductCode || o.Item;
                var catalogInfo = itemCatalogDict[itemCode];
                // Use the Dynamics Type since the folder structure was
                //  generated using the data from Dyanmics.
                catalogInfo.Type = ItemCatalog.TranslateType(catalogInfo.Type).Dyn;
                var genPackagePath = (`I:/Express/Manufacturing/_${catalogInfo.Type}/${catalogInfo.SubType}/${itemCode}/MFG_Manufacturing Report.txt`);
                var userPackagePath = (`I:/Express/Manufacturing/${itemCode}/MFG_Manufacturing Report.txt`);
                var packagePath =
                    fs.existsSync(userPackagePath) ?
                    userPackagePath :
                    (fs.existsSync(genPackagePath) ?
                    genPackagePath :
                    null);
                // If no package path found, skip
                if (packagePath == null) {
                    console.log(`No package/data found for '${itemCode}'`);
                    return;
                }
                var packageType = userPackagePath == packagePath ? 'User-made' : 'Generated';
                var packageData = (fs.readFileSync(packagePath).toString());
                var packageLines = packageData.split('\n').map(l => l.trim());
                // Filter out any non-mfg lines
                var ValidMfgLines =
                    packageLines.filter(l =>
                        !(`!@#$%^&*-_=+\`~/\\[];:'"<>.,?`.split('').includes(l[0])) &&
                        l.split('').
                            filter(char => char == '|').length == 21
                    );
                // If valid lines is 0, skip
                if (ValidMfgLines.length == 0) {
                    console.log(`${packageType} package '${itemCode}' skipped, file was empty or contained no valid mfg lines`);
                    return;
                }
                packageData = ValidMfgLines.join('\n');
                
                packageModTimes[itemCode] = fs.statSync(packagePath).mtime

                // Go through each Order Line Detail query field for the job
                Object.keys(crmOrderInfo).forEach(fieldKey => {
                    const crmValue = (fieldKey == 'JobNbr' ? crmOrderInfo[fieldKey][0] + '0' + crmOrderInfo[fieldKey].substr(1).replace(/^0+/, '') : crmOrderInfo[fieldKey]);
                    // Replace all occurances with placeholder field name with field value 
                    packageData = packageData.split(`{${fieldKey.toUpperCase()}}`).join(crmValue);
                });
                // Replace qty/multi placeholder with product of item qty & order line qty 
                // - skipped for consolidation
                /*packageData = packageData.split(`[ItemQty]`).join((o.Qty * o.OrderLineQty).toString());*/
                // Process Frames & loose items from package data
                var frameCol = FrameHandler.ParseFrames(packageData, itemCode);
                frameCol.MFGRawText = packageData;
                frameCol.ProductQty = (parseInt(o.Qty) * parseInt(o.OrderLineQty));
                processedCollection.push(frameCol);
                console.log(
                    `Processed ${packageType.toLowerCase()} package data for '${itemCode}' (qty: ${frameCol.ProductQty.toString()})`
                );
                
            });

            Object.keys(packageModTimes).forEach(function (key) { this.PackageModificationTimes[key] = packageModTimes[key]; }, this);

            this.ProductCollection = processedCollection;
        }
    }
} ());