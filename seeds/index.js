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

    for (let i = 0; i < lectures.length; i++) {
        const lect = new Lecture({
            // author: '5f5c330c2cd79d538f2c66d9',
            // location: `${cities[random1000].city}, ${cities[random1000].state}`,
            // title: `${sample(descriptors)} ${sample(places)}`
            title: lectures[i].title,
            channel: lectures[i].channel,
            url: lectures[i].url,
            img_url: lectures[i].img_url,
            view_cnt: lectures[i].view_cnt,
            upload_date: lectures[i].upload_date,
            description: lectures[i].description,
            channel_url: lectures[i].channel_url,
            subscribers: lectures[i].subscribers,
            total_vid: lectures[i].total_vid,
            
        })
        await lect.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})