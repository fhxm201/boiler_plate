const { User } = require('../models/User');

let auth = (req, res, next) => {
    //인증처리
    //클라이언트 쿠키에서 토큰을 가져온다.
    let token = req.cookies.x_auth;
    //토큰 복호화한 후 유저 찾음
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ isAuth: false, error: true })

        req.token = token;
        req.user = user;
        next();//미들웨어로 갈 수 있도록 넣어줘야 함
    })
}

module.exports = { auth };