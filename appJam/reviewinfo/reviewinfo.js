var express = require('express');
var mysql = require('mysql');
var router = express.Router();
var connection = mysql.createConnection({
    host : '',
    user : '',
    password : '',
    database : 'reviewinfo',
});

router.get('/:reviewinfo_reviewcode',function(req,res,next){
    connection.query('select * from reviewinfo where reviewcode=?',[req.params.reviewinfo_reviewcode], function(error,cursor){
        if(cursor.length>0) res.json(cursor[0]);
        else res.status(503).json({ 
            result : false, 
            reason : "Cannot find selected reviewcode" 
        });
    });
});

router.post('/', function(req, res, next) {
    connection.query('insert into reviewinfo(reviewcode, depth, hardness, ability, reasonability, communication, review, like, dislike) values(?, ?, ?, ?, ?, ?, ?, ?, ?);', 
                     [req.body.reviewcode, req.body.depth, req.body.hardness, req.body.ability, req.body.reasonability, req.body.communication, req.body.review, req.body.like, req.body.dislike], function(error, info){
        if(error == null) {
            connection.query('select * from reviewinfo where id=?',[info.insertId], function (error, cursor){
                if( cursor.length >0) {
                    res.json({ 
                        result : true, 
                        id : cursor[0].id, 
                        reviewcode : cursor[0].reviewcode,
                        depth : cursor[0].depth, 
                        hardness : cursor[0].hardness,
                        ability : cursor[0].ability,
                        reasonability : cursor[0].reasonability,
                        communication : cursor[0].communication,
                        review : cursor[0].review,
                        like : cursor[0].like,
                        dislike : cursor[0].dislike,
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
                            