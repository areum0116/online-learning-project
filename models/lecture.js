const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LectureSchema = new Schema({
    title: String,
    channel: String,
    url: String,
    img_url: String,
    view_cnt: Number,
    upload_date: Date,
    likes: Number,
    vid_length: Number,
    subscribers: Number
});

module.exports = mongoose.model('Lecture', LectureSchema);