var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var connection = mysql.createConnection({
    host : '',
    user : '',
    password : '',
    database : 'schoolinfo',
});

router.get('/:schoolinfo_schoolcode',function(req,res,next){
    connection.query('select * from schoolinfo where schoolcode=?',[req.params.schoolinfo_schoolcode], function(error,cursor){
        if(cursor.length>0) res.json(cursor[0]);
        else res.status(503).json({ 
            result : false, 
            reason : "Cannot find selected schoolcode" 
        });
    });
});

router.post('/', function(req, res, next) {
    connection.query('insert into schoolinfo(schoolcode, schoolname) values(?, ?);', 
                     [req.body.schoolcode, req.body.schoolname], function(error, info){
        if(error == null) {
            connection.query('select * from schoolinfo where id=?',[info.insertId], function (error, cursor){
                if( cursor.length >0) {
                    res.json({ 
                        result : true, 
                        id : cursor[0].id, 
                        schoolcode : cursor[0].schoolcode, 
                        schoolname : cursor[0].schoolname,
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
                            