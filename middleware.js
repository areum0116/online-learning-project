const { boardSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError.js');
const Board = require('./models/board.js');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', '먼저 로그인을 해야 합니다.');
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if(req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateBoard = (req, res, next) => {
    const { error } = boardSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const board = await Board.findById(id);
    if (!board.author.equals(req.user._id)) {
        req.flash('error', '수정 권한이 없습니다.');
        return res.redirect(`/boards/${id}`);
    }
    next();
}