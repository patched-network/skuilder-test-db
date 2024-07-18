const request = require('request-promise-native');

const sourceUrl = 'https://admin:password@source.url';
const targetUrl = "http://admin:password@localhost:5984";

async function replicateAllDatabases() {
    try {
        console.log('Starting replication process...');

        // Get list of all databases
        const databases = await request({
            url: `${sourceUrl}/_all_dbs`,
            json: true
        });
        console.log('Databases found:', databases);

        for (const dbName of databases) {
            console.log(`Replicating database: ${dbName}`);

            try {
                // Ensure the target database exists
                await request.put(`${targetUrl}/${dbName}`);
                console.log(`Created target database: ${dbName}`);
            } catch (error) {
                if (error.statusCode !== 412) { // 412 means the database already exists
                    console.error(`Error creating database ${dbName}:`, error.message);
                    continue;
                }
            }

            // Replicate the database
            try {
                const replicationResult = await request.post({
                    url: `${targetUrl}/_replicate`,
                    json: {
                        source: `${sourceUrl}/${dbName}`,
                        target: `${targetUrl}/${dbName}`,
                        create_target: true
                    }
                });
                console.log(`Replication result for ${dbName}:`, replicationResult);
            } catch (error) {
                console.error(`Error replicating database ${dbName}:`, error.message);
                continue;
            }

            // Copy security object
            try {
                const securityDoc = await request.get({
                    url: `${sourceUrl}/${dbName}/_security`,
                    json: true
                });
                await request.put({
                    url: `${targetUrl}/${dbName}/_security`,
                    json: securityDoc
                });
                console.log(`Copied security settings for ${dbName}`);
            } catch (error) {
                console.error(`Error copying security settings for ${dbName}:`, error.message);
            }

            // Verify replication
            try {
                const sourceInfo = await request.get({
                    url: `${sourceUrl}/${dbName}`,
                    json: true
                });
                const targetInfo = await request.get({
                    url: `${targetUrl}/${dbName}`,
                    json: true
                });
                console.log(`${dbName} - Source doc count: ${sourceInfo.doc_count}, Target doc count: ${targetInfo.doc_count}`);
            } catch (error) {
                console.error(`Error verifying replication for ${dbName}:`, error.message);
            }
        }

        console.log('Replication process completed.');
    } catch (error) {
        console.error('An error occurred during the replication process:', error.message);
    }
}

replicateAllDatabases();