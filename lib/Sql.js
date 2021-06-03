/**
 * @author CameronWA, ICC
 * @summary -
 */
module.exports = (function() {
    'use-strict';
    require.main.paths = [];
    require.main.paths.push(`H:\\CamA\\_res\\nodejs`);
    require.main.paths.push(`H:\\CamA\\_res\\nodejs\\node_modules`);

    const ADODB = require('H:\\CamA\\_res\\nodejs\\node_modules\\node-adodb');
    
    async function SQLDatabaseConnection(server, database, sql, dbprovider = 'SQLOLEDB', processtype = 'query') {
        var procPrep = (dbprovider != 'SQLOLEDB');
        // Connection string
        const connection = ADODB.open(`
            Persist Security Info=True;
            Integrated Security=SSPI;
            Provider=${dbprovider};
            Data Source=${server};
            ${procPrep ? 'Use Procedure for Prepare=1;' : ''}
            Initial Catalog=${database};
            Packet Size=4096;
            Workstation ID=HPZ600-001;
        `); // ;Integrated Security=SSPI
        // Using the ADODB connection, query the provided sql and return the data
        return await connection[processtype](sql).
                then(data => {
                    return data;
                }).
                catch(error => {
                    return error;
                });
    };
    /**
     * 
     */
    return {
        /**
         * Run Sql query statement on Database
         * @param {string} server 
         * @param {string} database 
         * @param {string} sql 
         * @param {string} dbprovider 
         * 
         */
        'query': (server, database, sql, dbprovider) =>
            SQLDatabaseConnection(server, database, sql, dbprovider, 'query')
        ,
        /**
         * Run Sql execution statement on Database
         * @param {string} server 
         * @param {string} database 
         * @param {string} sql 
         * @param {string} dbprovider 
         * 
         */
        'execute': (server, database, sql, dbprovider) =>
            SQLDatabaseConnection(server, database, sql, dbprovider, 'execute')
    }
} ());