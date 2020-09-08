var express = require('express');
var router = express.Router();

var passport = require('passport'); //passport 추가
var NaverStrategy = require('passport-naver').Strategy;

import config from '../config';

//처리 후 callback 처리 부분 성공/실패 시 리다이렉트 설정
router.get('/naver/callback', passport.authenticate('naver', {
      successRedirect : '/',
      failureRedirect : '/main/login'
    })
);

//별도 config 파일에 '네아로'에 신청한 정보 입력
passport.use(new NaverStrategy({
      clientID: config.federation.naver.clientId,
      clientSecret: config.federation.naver.clientSecret,
      callbackURL: config.federation.naver.callbackURL
    },
    function (accessToken, refreshToken, profile, done) {
      process.nextTick(function() {
        var user = {
          name : profile.displayName,
          email : profile.emails[0].value,
          username : profile.displayName,
          provider : 'naver',
          naver ; profile._json
        };
        console.log("user=");
        console.log(user);

        return done(null, user);
      });
    }
    ));

//failed to serialize user into session 에러 발생 시 아래의 내용을 추가 한다.
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(req, user, done) {
  //passport로 로그인 처리 후 해당 정보를 session에 담는다.
  seq.session.sid = user.name;
  console.log("Session Check :"+req.session.sid);
  done(null, user);
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//naver 로그인
router.get('/auth/login/naver',
    passport.authenticate('naver')
);
//naver 로그인 연동 콜백
router.get('http://127.0.0.1:3000',
    passport.authenticate('naver', {
      successRedirect: '/',
      failureRedirect: '/login'
    })
);

module.exports = router;
