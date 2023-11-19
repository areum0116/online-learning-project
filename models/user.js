const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
// const Lecture = require('./lecture');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },

    liked_lectures: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Lecture'
        }
    ],
    playlist_lectures: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Lecture'
        }
    ],
    watched_lectures: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Lecture'
        }
    ]

});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);