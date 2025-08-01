import mysql from "mysql2/promise";


let con;
try{
    con = mysql.createPool({
    host: "172.29.64.1",
    user: "root",
    password: "Pass137920word",
    database: "tutorial",
    waitForConnections: true,
    connectionLimit: 10,
});

    console.log("Connected to MySQL database successfully!");
}catch(err){
    con = null;
    console.error("Error connecting to MySQL database:", err);
}



export default con;