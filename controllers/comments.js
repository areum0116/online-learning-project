const Board = require('../models/board');
const Comment = require('../models/comment');

module.exports.createComment = async (req, res) => {
    const board = await Board.findById(req.params.id);
    const comment = new Comment(req.body.comment);
    comment.author = req.user._id;
    board.comments.push(comment);
    await comment.save();
    await board.save();
    req.flash('success', '댓글 등록');
    res.redirect(`/boards/${board._id}`);
}

module.exports.deleteComment = async (req, res) => {
    const { id, commentId } = req.params;
    await Board.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    req.flash('success', '댓글 삭제');
    res.redirect(`/boards/${id}`);
}