const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LectureSchema = new Schema({
    title: String,
    channel: String,
    url: String,
    img_url: String,
    view_cnt: Number,
    upload_date: String,
    description: String,
    channel_url: String,
    subscribers: Number,
    total_vid: Number,
    num: Number
});

module.exports = mongoose.model('Lecture', LectureSchema);