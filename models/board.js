const mongoose = require('mongoose');
const Comment = require('./comment');
const Schema = mongoose.Schema;

const BoardSchema = new Schema(
    {
        title: String,
        text: String,
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ],
        writtenTime: String
    }
    // {
    //     timestamps: true
    // }
);

BoardSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

module.exports = mongoose.model('Board', BoardSchema);