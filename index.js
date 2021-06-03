/**
 * @author CameronWA, ICC
 * @summary Handles the process of stamping each group of paperwork from the Section 3-8 with the jobs tag
 * 			color, instead of it being done manually after it's all been printed.
 */
(async function() {
    const fs = require('fs');
    const ItemCatalog = require('./lib/ItemCatalog.js');
    const CrmOrders   = require('./lib/CrmOrders.js');
    await ItemCatalog.Refresh();
    await CrmOrders.LoadData('J000032989');
    
    console.log(CrmOrders.Info);
    console.log(Object.keys(CrmOrders.Info));

    var mfgText = '';
    CrmOrders.ItemLines.
        map(o => {
            //console.log(o.ProductCode);
            return o;
        }).
        filter(o => ItemCatalog.Catalog.filter(ic => ic.ProductCode == o.ProductCode).length == 1).
        forEach((o, i, a) => {
            var catalogInfo = ItemCatalog.CatalogDict[o.ProductCode || o.Item];
            var packagePath = (`I:/Express/Manufacturing/_${catalogInfo.Type}/${catalogInfo.SubType}/${catalogInfo.ProductCode}/MFG_Manufacturing Report.txt`);
            console.log(packagePath);
            if (fs.existsSync(packagePath)) {
                var packageData = (fs.readFileSync(packagePath).toString());
                Object.keys(CrmOrders.Info).forEach(fieldKey => {
                    packageData = packageData.split(`{${fieldKey.toUpperCase()}}`).join(CrmOrders.Info[fieldKey]);
                    packageData = packageData.split(`[ItemQty]`).join((o.Qty * o.OrderLineQty).toString());
                });
                mfgText += packageData + '\n\n';
            }
        });
    console.log(mfgText);

}());