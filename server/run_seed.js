require('dotenv').config();
const mongoose = require('mongoose');
const { runSeeders } = require('./src/database/seeders/index');

const setup = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');
        await runSeeders();
        console.log('Seeding finished.');
    } catch(err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
};

setup();
