const express= require('express');


const router= express.Router();
const db =require('../database');
router.get('user-list',(req, res)=>{
    const sql ='SELECT * FROM users';
    db.query(sql, (err,data) =>{
        if (err)throw err;
        res.render('users-list',{title:'users-list',userData: data});
    });
})
module.exports = router;