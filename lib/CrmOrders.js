module.exports = (function() {
    const SqlHandler = require('./Sql');
    const JobQuoteProduct = require('../model/JobQuoteProduct.js');
    const QuotePart = require('../model/QuotePart.js');
    const OrderInfo = require('../model/OrderInfo.js');
    return {
        /** @type {JobQuoteProduct[]} */
        ItemLines: [],
        /** @type {OrderInfo} */
        Info: {},
        /**  @type {QuotePart} */
        QuoteParts: [],
        QuotePartsDict: {},
        LoadData: async function(jobNumber) {
            var mappedObjects;
            // Get quote lines items from CRRM
            var jobProdFields = [
                "OrderNbr",
                "OrderLineNbr",
                "OrderLineQty",
                "JobNbr",
                "QuotePart",
                "Item",
                "ProductCode",
                "Description",
                "Qty",
                "Type",
                "CreationDate"
            ];

            /** @type {JobQuoteProduct[]} */
            mappedObjects =
                (
                    await SqlHandler.query(
                        'COMSRVR8',
                        'eCRM_intcon2',
                        `SELECT        ${jobProdFields.join(', ')}
                        FROM          dbo._IC_vwJobQuoteProducts
                        WHERE         (JobNbr = '${jobNumber}') AND (ProductCode IS NOT NULL) AND (NOT(ProductCode = ''))
                        ORDER BY      QuotePart, ProductCode`
                    )
                ).map(o => new JobQuoteProduct(o));

            for (var h = 0; h < mappedObjects.length; h++) {
                var o = mappedObjects[h];
                var quotePart = o.QuotePart;
                if (!this.QuotePartsDict[quotePart])
                    this.QuotePartsDict[quotePart] = new QuotePart();
                this.QuotePartsDict[quotePart].QuotePart = quotePart;
                this.QuotePartsDict[quotePart].ItemLines.push(o);
            }
            for (var h = 0; h < mappedObjects.length; h++) {
                this.QuoteParts.push(this.QuotePartsDict[Object.keys(this.QuotePartsDict)[h]]);
            }

            this.ItemLines = mappedObjects;

            // Get Field information (finishes, etc) from CRM
            
            /** @type {JobQuoteProduct[]} */
            mappedObjects =
                (
                    await SqlHandler.query(
                        'hpserver05',
                        'iccrm_MSCRM',
                        `SELECT    *
                        FROM      iccrm_MSCRM.dbo.[!_IC_vwExpressOrder2]
                        WHERE     (JobNbr='${jobNumber}')`
                    )
                );
            this.Info = new OrderInfo(mappedObjects[0]);
        }
    }
} ());