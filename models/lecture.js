const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LectureSchema = new Schema({
    title: String,
    lecturer: String,
    subject: String,
    grade: Number
});

module.exports = mongoose.model('Lecture', LectureSchema);