const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LectureSchema = new Schema({
    title: String,
    channel: String,
    url: String,
    img_url: String
});

module.exports = mongoose.model('Lecture', LectureSchema);