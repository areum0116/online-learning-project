const Board = require('../models/board');

module.exports.index = async (req, res) => {
    const boards = await Board.find({}).populate('author');
    res.render('boards/index', { boards });
}

module.exports.renderNewForm = (req, res) => {
    res.render('boards/new');
}

module.exports.createBoard = async (req, res, next) => {
    const board = new Board(req.body.board);
    board.author = req.user._id;
    var time = new Date();
    board.writtenTime = time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
    await board.save();
    req.flash('success', '새로운 글 작성');
    res.redirect(`/boards/${board._id}`);
}

module.exports.showBoard = async (req, res) => {
    const board = await Board.findById(req.params.id).populate({
        path: 'comments',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!board) {
        req.flash('error', '해당 글은 삭제되었거나 존재하지 않습니다.');
        return res.redirect('/boards');
    }
    res.render('boards/show', { board });
}

module.exports.renderEditForm = async (req, res) => {
    const board = await Board.findById(req.params.id);
    if (!board) {
        req.flash('error', '해당 글은 삭제되었거나 존재하지 않습니다.');
        return res.redirect('/boards');
    }
    res.render('boards/edit', { board });
}

module.exports.updateBoard = async (req, res) => {
    const { id } = req.params;
    const board = await Board.findByIdAndUpdate(id, { ...req.body.board });
    req.flash('success', '수정 완료');
    res.redirect(`/boards/${board._id}`);
}

module.exports.deleteBoard = async (req, res) => {
    const { id } = req.params;
    await Board.findByIdAndDelete(id);
    req.flash('success', '삭제 완료');
    res.redirect('/boards');
}
