const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');

const Lecture = require('../models/lecture');
const User = require('../models/user');
let num = 1;

router.get('/', catchAsync(async (req, res) => {
    num = 1;
    const lectures = await Lecture.find({});
    res.render('lectures/index', { lectures, num });
}))

router.get('/index_sort_by_view_cnt', catchAsync(async (req, res) => {
    num = 2;
    const lectures = await Lecture.find({});
    let sortable = [];
    for (var i=0; i<lectures.length; i++) {
        sortable.push([lectures[i].num, lectures[i].view_cnt]);
    }
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });
    for (var i=0; i<lectures.length; i++) {
        lectures[i].num = sortable[i][0];
    } 
    res.render('lectures/index', { lectures, num });
}))

router.get('/index_sort_by_date', catchAsync(async (req, res) => {
    num = 3;
    const lectures = await Lecture.find({});
    let sortable = [];

    for (var i = 0; i < lectures.length; i++) {
        let date = lectures[i].upload_date.split(' '); let n, result, whatAgo;
        if(date[0] == 'Streamed') {
            n = parseInt(date[1]);
            whatAgo = date[2];
        } else {
            n = parseInt(date[0]);
            whatAgo = date[1];
        } 
        result = n;

        if(whatAgo === 'minute' || whatAgo === 'minutes') {
            result = n * 60;
        } else if(whatAgo === 'hour' || whatAgo === 'hours') {
            result = n * 60 * 60;
        } else if(whatAgo === 'day' || whatAgo === 'days') {
            result = n * 60 * 60 * 24;
        } else if(whatAgo === 'week' || whatAgo === 'weeks') {
            result = n * 60 * 60 * 24 * 7;
        } else if(whatAgo === 'month' || whatAgo === 'months') {
            result = n * 60 * 60 * 24 * 30;
        } else if(whatAgo === 'year' || whatAgo === 'years') {
            result = n * 60 * 60 * 24 * 365;
        }
        sortable.push([lectures[i].num, result]);
    }
    sortable.sort(function(a, b) {
        return a[1] - b[1];
    });
    for (var i = 0; i < lectures.length; i++) {
        lectures[i].num = sortable[i][0];
    }
    res.render('lectures/index', { lectures, num });
}))

router.get('/index_sort_by_subscribers', catchAsync(async (req, res) => {
    num = 4;
    const lectures = await Lecture.find({});
    let sortable = [];
    for (var i=0; i<lectures.length; i++) {
        sortable.push([lectures[i].num, lectures[i].subscribers]);
    }
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });
    for (var i=0; i<lectures.length; i++) {
        lectures[i].num = sortable[i][0];
    }
    res.render('lectures/index', { lectures, num });
}))

router.get('/index_sort_by_vid_cnt', catchAsync(async (req, res) => {
    num = 5;
    const lectures = await Lecture.find({});
    let sortable = [];
    for (var i=0; i<lectures.length; i++) {
        sortable.push([lectures[i].num, lectures[i].total_vid]);
    }
    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });
    for (var i=0; i<lectures.length; i++) {
        lectures[i].num = sortable[i][0];
    }
    res.render('lectures/index', { lectures, num });
}))

router.get('/index_sort_by_alphabet', catchAsync(async (req, res) => {
    num = 6;
    const lectures = await Lecture.find({});
    let sortable = [];
    for (var i=0; i<lectures.length; i++) {
        sortable.push([lectures[i].num, lectures[i].title]);
    }
    sortable.sort(function(a, b) {
        if(a[1] < b[1]){
            return -1;
        }
        if(a[1] > b[1]){
            return 1;
        }
        else{return 0;}
    });
    for (var i=0; i<lectures.length; i++) {
        lectures[i].num = sortable[i][0];
    }
    res.render('lectures/index', { lectures, num });
}))


router.get('/:lectureId/like', isLoggedIn, catchAsync(async (req, res) => {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    const user = await User.findById(req.user._id);
    user.liked_lectures.push(lecture);
    await user.save();
    req.flash('success', '찜한 영상 목록에 추가');
    res.redirect('/lectures');
}))
router.get('/:like_index/unlike', isLoggedIn, catchAsync(async (req ,res) => {
    const { like_index } = req.params;
    const user = await User.findById(req.user._id);
    user.liked_lectures.splice(like_index, 1);
    await user.save();
    req.flash('error', '찜한 목록에서 제거');
    res.redirect('/lectures');
}))

router.get('/:lectureId/playlist', isLoggedIn, catchAsync(async (req, res) => {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    const user = await User.findById(req.user._id);
    user.playlist_lectures.push(lecture);
    await user.save();
    req.flash('success', '플레이리스트에 추가');
    res.redirect('/lectures');
}))
router.get('/:playlist_index/unplaylist', isLoggedIn, catchAsync(async (req ,res) => {
    const { playlist_index } = req.params;
    const user = await User.findById(req.user._id);
    user.playlist_lectures.splice(playlist_index, 1);
    await user.save();
    req.flash('error', '플레이리스트에서 제거');
    res.redirect('/lectures');
}))

router.get('/:lectureId/watched', isLoggedIn, catchAsync(async (req, res) => {
    const { lectureId } = req.params;
    const lecture = await Lecture.findById(lectureId);
    const user = await User.findById(req.user._id);
    user.watched_lectures.push(lecture);
    await user.save();
    req.flash('success', '시청한 영상 목록에 추가');
    res.redirect('/lectures');
}))
router.get('/:watched_index/unwatched', isLoggedIn, catchAsync(async (req ,res) => {
    const { watched_index } = req.params;
    const user = await User.findById(req.user._id);
    user.watched_lectures.splice(watched_index, 1);
    await user.save();
    req.flash('error', '시청한 영상 목록에서 제거');
    res.redirect('/lectures');
}))

module.exports = router;