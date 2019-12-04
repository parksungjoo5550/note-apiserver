exports.get = (req, res) => {
    res.clearCookie('token');
    
    res.render('auth/login', {
        message: '정상적으로 로그아웃 됐습니다.'
    });
}