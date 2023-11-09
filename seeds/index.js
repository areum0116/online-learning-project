const mongoose = require('mongoose');
const lectures = require('./seedHelpers');
const Lecture = require('../models/lecture');

mongoose.connect('mongodb://127.0.0.1:27017/online-learning');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async() => {
    await Lecture.deleteMany({});

    for (let i = 0; i < 10; i++) {
        const lect = new Lecture({
            // author: '5f5c330c2cd79d538f2c66d9',
            // location: `${cities[random1000].city}, ${cities[random1000].state}`,
            // title: `${sample(descriptors)} ${sample(places)}`
            title: lectures[i].title,
            channel: lectures[i].channel,
            url: lectures[i].url,
            img_url: lectures[i]["img_url\r"]
            //'https://images.unsplash.com/photo-1509869175650-a1d97972541a?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
        })
        await lect.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})