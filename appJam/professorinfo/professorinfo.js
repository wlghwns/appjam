var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var connection = mysql.createConnection({
    host : '',
    user : '',
    password : '',
    database : 'professorinfo',
});

router.get('/:professorinfo_professorname',function(req,res,next){
    connection.query('select * from professorinfo where professorname=?',[req.params.professorinfo_professorname], function(error,cursor){
        if(cursor.length>0) res.json(cursor[0]);
        else res.status(503).json({ 
            result : false, 
            reason : "Cannot find selected professorname" 
        });
    });
});

router.post('/', function(req, res, next) {
    connection.query('insert into professorinfo(professorcode, professorname, professorschoolcode, totalpoint) values(?, ?, ?, ?);', 
                     [req.body.professorcode, req.body.professorname, req.body.professorschoolcode, req.body.totalpoint], function(error, info){
        if(error == null) {
            connection.query('select * from professorinfo where id=?',[info.insertId], function (error, cursor){
                if( cursor.length >0) {
                    res.json({ 
                        result : true, 
                        id : cursor[0].id, 
                        professorcode : cursor[0].professorcode, 
                        professorname : cursor[0].professorname,
                        professorschoolcode : cursor[0].professorschoolcode,
                        totalpoint : cursor[0].totalpoint,
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
                            