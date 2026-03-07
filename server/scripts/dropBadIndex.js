/**
 * One-shot script: drops the bad parallel-array compound index
 * { targetBatches, eligibleDegrees, eligibleBranches } from the jobpostings collection.
 * Run once: node scripts/dropBadIndex.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');

async function dropBadIndex() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const db = mongoose.connection.db;
        const collection = db.collection('jobpostings');

        // List all current indexes
        const indexes = await collection.indexes();
        console.log('\nCurrent indexes:');
        indexes.forEach((idx, i) => console.log(`  [${i}]`, JSON.stringify(idx.key)));

        // Find and drop any compound index that spans more than one array field
        // The bad one looks like: { targetBatches: 1, eligibleDegrees: 1, eligibleBranches: 1 }
        const badIndexNames = indexes
            .filter(idx => {
                const keys = Object.keys(idx.key);
                // Bad if it has targetBatches AND eligibleDegrees together
                return keys.includes('targetBatches') && keys.includes('eligibleDegrees');
            })
            .map(idx => idx.name);

        if (badIndexNames.length === 0) {
            console.log('\nNo bad compound index found — already clean!');
        } else {
            for (const name of badIndexNames) {
                console.log(`\nDropping bad index: "${name}"`);
                await collection.dropIndex(name);
                console.log(`  ✓ Dropped.`);
            }
        }

        // Also drop the old bad indexes by explicit key (belt-and-suspenders)
        try {
            await collection.dropIndex({ targetBatches: 1, eligibleDegrees: 1, eligibleBranches: 1 });
            console.log('  ✓ Dropped explicit compound index too.');
        } catch (e) {
            // Might already not exist — that's fine
            if (e.codeName !== 'IndexNotFound') {
                console.log(`  Note: ${e.message}`);
            }
        }

        console.log('\nDone! Restarting server will recreate the correct individual indexes.\n');
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
    }
}

dropBadIndex();
