var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var connection = mysql.createConnection({
    host : '',
    user : '',
    password : '',
    database : 'userinfo',
});

router.get('/:userinfo_userid',function(req,res,next){      // 로그인부분 get
    connection.query('select * from userinfo where userid=?',[req.params.userinfo_userid], function(error,cursor){
        if(cursor.length>0) res.json(cursor[0]);   // 아이디,비밀번호, 학교코드를 뿌려준다.
        else res.status(503).json({ 
            result : false, 
            reason : "Cannot find selected userid" 
        });
    });
});

router.post('/', function(req, res, next) {         // 회원가입부분 post
    connection.query('insert into userinfo(userid, password, schoolcode) values(?, ?, ?);', 
                     [req.body.userid, req.body.password, req.body.schoolcode], function(error, info){
        if(error == null) {
            connection.query('select * from userinfo where id=?',[info.insertId], function (error, cursor){
                if( cursor.length >0) {
                    res.json({ 
                        result : true, 
                        id : cursor[0].id, 
                        userid : cursor[0].userid, 
                        password : cursor[0].password,
                        schoolcode : cursor[0].schoolcode,
                    });
                }
                else res.status(503).json({ 
                    result : false, 
                    reason : "Cannot post information"
                });
            });
        }
        else res.status(503).json(error);
    });
});
module.exports = router;
                            