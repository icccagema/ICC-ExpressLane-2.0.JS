module.exports = (function() {
    const SqlHandler = require('./Sql');
    const AllProducts = require('../model/AllProducts.js');
    return {
        /** @type {AllProducts[]} */
        Catalog: [],
        CatalogDict: {},
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
        }
    }
} ());