/**
 * @author CameronWA, ICC
 * @summary 
 */
(async function() {
    const fs             = require('fs');
    const ItemCatalog    = require('./lib/ItemCatalog.js');
    const CrmOrders      = require('./lib/CrmOrders.js');
    const FrameHandler   = require('./lib/FrameHandler.js');
    const PackageHandler = require('./lib/PackageHandler.js');
    const PartitionFrame = require('./model/PartitionFrame.js');
    const MfgHandler     = require('./lib/MfgHandler.js');

    var start = Date.now();
    ItemCatalog.LoadTranslationData();
    if (fs.existsSync('./cached-catalog.json')) {
        ItemCatalog.CatalogDict = require('./cached-catalog.json');
        ItemCatalog.Catalog = [... Object.values(ItemCatalog.CatalogDict)];
    } else {
        await ItemCatalog.Refresh();
        fs.writeFileSync('./cached-catalog.json', JSON.stringify(ItemCatalog.CatalogDict, null, 2));
    }
    console.log(`${Date.now() - start}ms`);

    start = Date.now();
    await CrmOrders.LoadData('S000008071');
    console.log(`${Date.now() - start}ms`);
    //console.log(CrmOrders.Info);

    start = Date.now();
    PackageHandler.ProductCollection = [];
    PackageHandler.ProcessPackages(
        CrmOrders.ItemLines.filter(o =>
            ItemCatalog.Catalog.filter(ic =>
                ic.ProductCode == (["", "QSP1"].includes(o.ProductCode.toUpperCase()) ? (o.Item || o.ProductCode) : o.ProductCode)
            ).length == 1
        ),
        ItemCatalog.CatalogDict,
        CrmOrders.Info
    );
    console.log(`${Date.now() - start}ms`);

    PackageHandler.ProductCollection.forEach(pc => pc.ShipLooseItems.forEach(sli => Object.keys(sli).filter(k => k.startsWith('Option')).map(k => sli[k]).filter(v => v.toString().toLowerCase() == 'NA').forEach(k => console.log(k + ' ' + sli[k]))));

    start = Date.now();
    MfgHandler.ExportMFG(
        MfgHandler.FrameCollectionsToMFG(PackageHandler.ProductCollection),
        CrmOrders.JobNbr
    );
    console.log(`${Date.now() - start}ms`);

    //var collectionJson = JSON.stringify(PackageHandler.ProductCollection, null, 2);
    //fs.writeFileSync(`./${CrmOrders.JobNbr}-MFG.txt`, collectionJson);


}());