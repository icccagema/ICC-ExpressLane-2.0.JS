module.exports = (function() {
    const fs = require('fs');
    const SqlHandler = require('./Sql');
    const AllProducts = require('../model/AllProducts');
    return {
        /** @type {AllProducts[]} */
        Catalog: [],
        /** @type {Object.<string, AllProducts>} */
        CatalogDict: {},
        /**
         * Dynamics type as key, CRM type as value
         * @type {Object.<string, { Dyn: string, Crm: string }>}
        */
        TranslationDict: {},
        Refresh: async function() {
            const results = await SqlHandler.query(
                'hpserver05',
                'iccrm_MSCRM',
                `SELECT         *
                 FROM           dbo.[!_IC_vwAllProducts]
                 WHERE          (NOT (Type = 'Panel')) AND (NOT (Type = 'Tile')) /*AND (NOT (ProductCode like 'FR-SD%'))*/
                 ORDER BY       ProductCode`
            );
            var mappedObjects = results.map(o => new AllProducts(o));
            this.Catalog = mappedObjects;
            mappedObjects.forEach(o => this.CatalogDict[o.ProductCode] = o);
        },
        /**
         * Loads ini file, populating TranslationDict
         */
        LoadTranslationData: function() {
            var configText =
                fs.readFileSync('./config/DynToCrmTranslationData.ini').toString().
                    split('\n').
                    map(l => l.trim());
            var typeData =
                configText.
                    filter((l, i, a) =>
                        i > a.lastIndexOf('[Product_Type]') && 
                        i < a.lastIndexOf('[Prod_Type_Code]')
                    );
            //console.log(configText);

            //this.TranslationDict = {};
            typeData.forEach(l => {
                var split = l.split('=');
                var [key, value] = split.map(v => v.trim());
                var obj = { 'Dyn': key, 'Crm': value};
                this.TranslationDict[key] = obj;
                this.TranslationDict[value] = obj;
            });
            //console.log(this.TranslationDict);
        },
        /**
         * 
         * @param {string} typeStr 
         * @returns { { Dyn: string, Crm: string } }
         */
        TranslateType: function(typeStr) {
            var hasKey = this.TranslationDict[typeStr] != null;
            return !hasKey ? { Dyn: typeStr, Crm: typeStr } : this.TranslationDict[typeStr];
        }
    }
} ());