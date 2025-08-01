
import con from "../configdb.js";
export default async function checkuser(req, res, next){
    
    let sql;
    let values;
    if(req.user){
        sql = "SELECT * FROM users WHERE (username = ? OR email = ?) AND id != ?"
        values = [req.body.username,req.body.email,req.user.id]
    }
    else{
        sql = "SELECT * FROM users WHERE username = ? OR email = ?";
        values = [req.body.username, req.body.email];
    }
    const [rows] = await con.query(sql, values);
    console.log(rows, "rows in duplicate checker");
    if(rows.length > 0){
        const error =  new Error("Username or email already in use");
        error.code = 404;
        throw error;
    }
    next();
}

