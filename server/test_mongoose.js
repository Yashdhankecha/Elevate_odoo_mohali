const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    testDate: Date,
    testNum: { type: Number, min: 0 }
});

const TestModel = mongoose.model('Test', schema);

async function run() {
    try {
        const doc = new TestModel({ testDate: '', testNum: '' });
        await doc.validate();
        console.log('Validation passed');
    } catch (err) {
        console.log('Validation failed:', err.message);
    }
}

run();
