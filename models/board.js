const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardSchema = new Schema(
    {
        title: String,
        text: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        writtenTime: String
    }
    // {
    //     timestamps: true
    // }
);

module.exports = mongoose.model('Board', BoardSchema);