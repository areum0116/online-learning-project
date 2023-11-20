const Lecture = require('../../models/lecture');
const User = requrie('../../models/user');

async function is_like_btn_checked(like_box, user_id) {
    const user = await User.findById(user_id);
    const lecture_id = like_box.value;
    const lecture = await Lecture.findById(lecture_id);

    if(like_box.checked) {
        user.liked_lectures.push(lecture);
        await user.save();
        req.flash('success', '좋아요가 표시된 영상에 추가하였습니다.');
    } 
    else {
        const index = user.liked_lectures.indexOf(lecture_id);
        if(index > -1) {
            user.liked_lectures.splice(index, 1);
            await user.save();
        }
        req.flash('error', '좋아요가 표시된 영상에서 삭제되었습니다.');
    }
    

    document.getElementById(`result1`).innerText = user_id;
}


async function is_playlist_btn_checked(playlist_box, user_id) {
    var txt = '';
    const user = await User.findById(user_id);
    const lecture_id = playlist_box.value;
    const lecture = await Lecture.findById(lecture_id);

    if(playlist_box.checked) {
        // txt = playlist_box.value;
        txt = user.username;
    }
    else {
        txt = lecture.title;
    }


    document.getElementById(`result2`).innerText = txt;
}



async function is_watched_btn_checked(n, lecture_id, user_id) {
    const checkbox = document.getElementById(`watched-btn-${n}`);
    const is_checked = checkbox.checked;



    document.getElementById(`result3`).innerText = '';
}