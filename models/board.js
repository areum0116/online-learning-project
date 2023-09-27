const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
    title: String,
    text: String
});

module.exports = mongoose.model('Board', BoardSchema);