import express from "express"
import Validation from "../middleware/inputvalidation.js";
import dupValidate from "../middleware/duplicatechecker.js"
import jwt from "jsonwebtoken";
export const router = express.Router();
export const secret = "$sarf@pk@26100145@ryk@tcs@May"
import authenticate from "../middleware/Authentication.js";
import con from "../configdb.js"
import RolebasedAuth from "../middleware/RolebasedAuth.js";
import eventBus from "../../eventbus.js";
import bcrypt from "bcrypt";
import UserService from "../services/UserService.js";
const attachAuth = async (Token, res) => {
    res.cookie("auth", Token, {
        httponly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 10 * 60 * 1000,
    })

}

router.get("/Profile", authenticate, async (req, res) => {
    const user = await UserService.GetProfile(req.user.id);
    res.status(200).json(user);
})

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const {token, user} = await UserService.login(username,password);
    await attachAuth(token,res);
    res.status(200).json({user:user})
}
);

router.post("/addUser", authenticate, RolebasedAuth.add_user, Validation("adduser"), dupValidate, async (req, res) => {
   await UserService.adduser(req.body)
   return res.status(200).json();
})

router.get("/usersList", authenticate, async (req, res) => {
    const users = await UserService.getUsersList();
    return res.status(200).json(users)
})

router.get("/tasksList", authenticate, RolebasedAuth.view_tasks, async (req, res) => {

    const tasks = await UserService.getTasklist(req.user.id);
    res.status(200).json(tasks);
})

router.post("/updatetask", authenticate, RolebasedAuth.add_task, async (req, res) => {

    await UserService.updateTask(req.user,req.body.taskid,req.body.assigned_to);
    res.status(200).json();
})

router.get("/tasksListteam", authenticate, RolebasedAuth.add_task, async (req, res) => {
    
    console.log("entered")
    const tasks = await UserService.GetTeamtasksLead(req.user.id)
    console.log(tasks,"tasks")
    res.status(200).json(tasks)
})

router.post("/addtask", Validation("addtask"), authenticate, RolebasedAuth.add_task, async (req, res) => {
    console.log("added")
    const obj = req.body;
    const taskdata = {
        task: obj.task,
        assigned_to: obj.assigned,
        assigned_by: req.user.id,
        deadline: obj.deadline
    }
    await UserService.AddTaskLead(taskdata);
    res.status(200).json();
})

router.get("/deleteTask/:id", authenticate, RolebasedAuth.delete_task, async (req, res) => {
    const id = Number(req.params.id);
    await UserService.Deletetask(id,req.user)
    res.status(200).json();
})

router.get("/deleteUser/:id", authenticate, RolebasedAuth.delete_user, async (req, res) => {
    await UserService.DeleteUser(req.params.id);
    res.status(200).json();
    // const id = Number(req.params.id);
    // let connection;
    // try {
    //     connection = await con.getConnection()
    // }
    // catch (err) {
    //     throw err
    // }
    // try {
    //     await connection.beginTransaction()
    //     const sql1 = `SELECT u.*, t.team_name AS team_name FROM users u 
    //     JOIN teams t ON u.team_id = t.id WHERE u.id = ?`
    //     const values1 = [id]
    //     const [rows, fields] = await connection.query(sql1, values1);
    //     if (rows.length > 0) {
    //         if (rows[0].role === 2) {
    //             if (rows[0].team_id !== 34) {
    //                 const sql2 = `SELECT * FROM users WHERE team_id = ?`
    //                 const values2 = [rows[0].team_id]
    //                 const [rows2, fields2] = await connection.query(sql2, values2)
                    
    //                 const sql3 = `SELECT * FROM tasks WHERE assigned_by = ? OR assigned_team = ?`
    //                 const values3 = [rows[0].id, rows[0].team_id]
    //                 const [rows3,fields3] = await connection.query(sql3, values3)
                    
    //                 const sqlnew = `SELECT * FROM users WHERE role = 1`
    //                 const [rows4, fields4] = await connection.query(sqlnew)
    //                 if (rows4.length === 0) {
    //                     throw new Error("No admin user found")
    //                 }
    //                 const admin_id = rows4[0].id;
    //                 const temp3 = rows3.map((o1) => o1.id);
    //                 console.log(temp3, "temp3")
    //                 const sql4 = `UPDATE tasks SET assigned_to = ?,assigned_by = ?, assigned_team = ?, assigned_by_main = CASE 
    //                 WHEN assigned_by_main IS NULL
    //                 THEN ?
    //                 ELSE assigned_by_main END
    //                 WHERE id IN (?)`

    //                 const values4 = [null,null,null, admin_id, temp3]
    //                 await connection.query(sql4, values4)
                    
    //                 const temp4 = rows2.map((o1) => o1.id);
    //                 const sql5 = `UPDATE users SET team_id = DEFAULT WHERE id IN (?)`
    //                 const values5 = [temp4]
    //                 await connection.query(sql5, values5)
                    
    //                 const sql6 = `DELETE FROM teams WHERE id = ?`
    //                 const values6 = [rows[0].team_id]
    //                 await connection.query(sql6, values6)
                    
    //                 const sql7 = `DELETE FROM users WHERE id = ?`
    //                 const values7 = [id]
    //                 await connection.query(sql7, values7)
    //                 const sql8 = `SELECT team_name, JSON_ARRAYAGG(JSON_OBJECT('username', username, 'role', role)) AS members
    //     FROM teams JOIN users ON users.team_id = teams.id
    //     WHERE team_name = "DEFAULT"
    //     GROUP BY team_name`
    //                 const [rows8, fields8] = await connection.query(sql8)
    //                 const sql9 = `SELECT * FROM tasks WHERE id IN (?)`
    //                 const values9 = [temp3]
    //                 const [rows9, fields9] = await connection.query(sql9, values9)
    //                 console.log(rows9, "rows9")
    //                 await connection.commit()
    //                 eventBus.emit("userdelete", { data: { id: id } });
    //                 eventBus.emit("teamchange", { ids: temp4 });
    //                 eventBus.emit("updateteams", { data: rows8[0], ids: rows4.map((o1) => o1.id)});
    //                 eventBus.emit("deleteteams", { data: rows[0].team_name, ids: rows4.map((o1) => o1.id)});
    //                 eventBus.emit("taskdeleteall", { data: temp3, ids: rows2.map((o1) => o1.id)});
    //                 let admintasks = rows9
    //                 admintasks = admintasks.sort((a,b)=>a.assigned_by_main - b.assigned_by_main)
    //                 let sender = []
    //                 if(admintasks.length > 0){
    //                     sender.push(admintasks[0])
    //                 }
    //                 for(let i = 1; i < admintasks.length; i++){
    //                     if(admintasks[i].assigned_by_main === sender[0].assigned_by_main){
    //                         sender.push(admintasks[i])
    //                     }
    //                     else{
    //                         console.log(sender);
    //                         eventBus.emit("updateAdminteam", {
    //                             data: {
    //                                 rows: sender,
    //                                 ids: sender.map((o1) => o1.id)
    //                             }, ids: [sender[0].assigned_by_main]
    //                         })
    //                         eventBus.emit("Admintaskdelete", { data: sender.map((o1) => o1.id), ids: [sender[0].assigned_by_main] })
    //                         sender = [admintasks[i]]
    //                     }
    //                 }
    //                 if (sender.length > 0) {
    //                     console.log(sender);
    //                     eventBus.emit("updateAdminteam", {
    //                         data: {
    //                             rows: sender,
    //                             ids: sender.map((o1) => o1.id)
    //                         }, ids: [sender[0].assigned_by_main]
    //                     })
    //                     eventBus.emit("Admintaskdelete", { data: sender.map((o1) => o1.id), ids: [sender[0].assigned_by_main] })
    //                 }
    //             }
    //             else {
    //                 const sql2 = `DELETE FROM users WHERE id = ?`
    //                 const sql3 = `SELECT id,role FROM users WHERE team_id = 34`
    //                 const values2 = [id]
    //                 await connection.query(sql2, values2)
    //                 const [rows3, fields3] = await connection.query(sql3)
    //                 const temp3 = rows3.map((o1) => o1.id);
    //                 const temp4 = rows3.map((o1) => {
    //                     if (o1.role === 1) {
    //                         return o1.id
    //                     }
    //                     else {
    //                         return null
    //                     }
    //                 });
    //                 const sql4 = `SELECT team_name, JSON_ARRAYAGG(JSON_OBJECT('username', username, 'role', role)) AS members
    //     FROM teams JOIN users ON users.team_id = teams.id
    //     WHERE team_name = "DEFAULT"
    //     GROUP BY team_name`
    //                 const [rows4, fields4] = await connection.query(sql4)
    //                 await connection.commit()
    //                 eventBus.emit("userdelete", { data: { id: id } });
    //                 eventBus.emit("teamchange", { ids: temp3 })
    //                 eventBus.emit("teamupdate", { data: rows4[0], ids: temp4 })
    //             }
    //         }
    //         else {
    //             const sql2 = `SELECT * FROM users WHERE role = 1`
    //             const [rows2, field2] = await connection.query(sql2)
    //             if (rows2.length === 0) {
    //                 throw new Error
    //             }
    //             else {
    //                 const sql3 = `SELECT * FROM tasks WHERE assigned_to = ?`
    //                 const values3 = [id]
    //                 const [rows3, fields3] = await connection.query(sql3, values3)
    //                 const sql4 = `UPDATE tasks SET assigned_to = ?, assigned_team = ?,assigned_by_main = ? WHERE assigned_to = ?`
    //                 let values4;
    //                 console.log(rows3, "rows3")
    //                 if (rows3.length > 0) {
    //                     values4 = [null, rows[0].team_id, rows2[0].id, id]

    //                 }
    //                 else {
    //                     values4 = [null, null, rows2[0].id, id]
    //                 }
    //                 const resp = await connection.query(sql4, values4)
    //                 const sql5 = `DELETE FROM users WHERE id = ?`
    //                 const values5 = [id]
    //                 await connection.query(sql5, values5)
    //                 const sql6 = `SELECT id FROM users WHERE team_id = ?`
    //                 const values6 = [rows[0].team_id]
    //                 const [rows6, fields6] = await connection.query(sql6, values6)
    //                 const temp6 = rows6.map((o1) => o1.id);
    //                 await connection.commit()
    //                 eventBus.emit("userdelete", { data: { id: id } });
    //                 eventBus.emit("teamchange", { ids: temp6 })
    //                 console.log(rows3, "rows")
    //                 if (rows3.length > 0) {
    //                     eventBus.emit("taskdelete", { data: rows3.map((o1) => o1.id), ids: [rows3[0].assigned_by] })
    //                 }
    //                 const temp = rows3.map((o1) => { return { ...o1, assigned_to: null, assigned_teams: rows[0].team_id, assigned_by_main: rows2[0].id } })
    //                 for (let i = 0; i < rows3.length; i++) {
    //                     eventBus.emit("teamupdate", { data: temp[i], ids: [temp[i].assigned_by] });
    //                 }
    //             }
    //         }
    //     } else {
    //         const error = new Error("invalid user");
    //         error.code = 404
    //         throw error
    //     }
    // }
    // catch (err) {
    //     connection.rollback()
    //     throw err
    // }
    // finally {
    //     connection.release()
    // }
    // return res.status(200).send();
})

router.post("/update", authenticate, Validation("updateuser"), dupValidate, async (req, res) => {
    const id = req.user.id;
    let { username, password, email } = req.body;
    //console.log(id);
    password = await bcrypt.hash(password, 10);
    const sql = "UPDATE users SET username = ?, pass = ?, email = ? WHERE id = ?";
    const values = [username, password, email, id];
    try {
        const [result] = await con.query(sql, values);
        const sql2 = `SELECT t.*, t1.team_name AS team_name, t2.role_name AS position
        FROM users t
        JOIN teams t1 ON t.team_id = t1.id
        JOIN roles t2 ON t.role = t2.id
        WHERE t.id = ?`;
        const values2 = [id];
        const [rows, fields] = await con.query(sql2, values2);
        const temp = rows[0];
        temp.team_id = "";
        temp.Pass = "";
        eventBus.emit("userupdate", { data: temp });
        //console.log("User updated successfully:", result);
        return res.status(200).send();
    }
    catch (err) {
        throw err
        //        console.error("Error updating user:", err);
        //        return res.status(400).json({ err: "Error updating user" });
    }
})

router.get("/getroles", authenticate, async (req, res) => {

    try {
        const [rows] = await con.query("SELECT * FROM roles")
        res.status(200).json(rows);
    } catch (err) {
        throw err
        //      res.status(404).json({err:err})
    }
})

router.post("/addteam", authenticate, RolebasedAuth.add_teams, Validation("addteam"), async (req, res) => {
    console.log("addteam request received");
    const { lead, teamName, members } = req.body;
    members.push(lead);
    let connection;
    try {
        connection = await con.getConnection();
    }
    catch (err) {
        throw new Error("Database connection error: " + err.message);
    }
    try {
        await connection.beginTransaction();
        const createsql = "INSERT INTO teams (team_name, team_lead) VALUES (?, ?)";
        const values = [teamName, lead];
        const result = await connection.query(createsql, values)
        const sql2 = `SELECT team_name, JSON_ARRAYAGG(JSON_OBJECT('username', username, 'role', role)) AS members
        FROM teams JOIN users ON users.team_id = teams.id
        WHERE teams.id = ?
        GROUP BY team_name`
        const sql3 = `DELETE FROM teams WHERE (team_lead = ? AND id != ?)`
        const values3 = [lead, result[0].insertId]
        const sql4 = `UPDATE users SET team_id = DEFAULT WHERE team_id IS NULL`
        const sql5 = `SELECT team_name,id FROM teams WHERE (team_lead = ? AND id != ?)`
        const sql6 = `SELECT team_name, JSON_ARRAYAGG(JSON_OBJECT('username', username, 'role', role)) AS members
        FROM teams JOIN users ON users.team_id = teams.id
        WHERE team_name = "DEFAULT"
        GROUP BY team_name`
        const sql7 = `SELECT t.*, u1.username AS assigned_by_main_username FROM tasks t
    JOIN users u1 ON t.assigned_by_main = u1.id
    WHERE t.assigned_team IN (?) AND t.assigned_by_main = ?`
        const sql8 = `SELECT id FROM users WHERE (team_id = 34 OR team_id = ?) AND role != 1`
        const sql9 = `UPDATE tasks SET assigned_to = NULL, assigned_by = NULL WHERE assigned_to IN (?)`
        //console.log(result)
        //console.log(result[0].insertId);

        const newsql = "UPDATE users SET team_id = ? WHERE id IN (?)";
        const updateValues = [result[0].insertId, members];
        const [rows5, fields5] = await connection.query(sql5, values3)
        console.log(rows5)
        const temp2 = rows5.map((row) => row.team_name)
        const temp3 = rows5.map((row) => row.id)
        const values7 = [temp3, req.user.id]
        let rows7;
        let fields7;
        if (temp3.length > 0) {
        [rows7, fields7] = await connection.query(sql7, values7)
    }
    else{
        rows7 = []
    }
        const resp = await connection.query(newsql, updateValues);
        const resp2 = await connection.query(sql3, values3)
        const resp3 = await connection.query(sql4)

        const [rows, fields] = await connection.query(sql2, [result[0].insertId])
        const [rows2, fields2] = await connection.query("SELECT id FROM users WHERE role = 1")
        const temp = rows2.map((row) => { return row.id })
        const [rows6, fields6] = await connection.query(sql6)
        const [rows8, fields8] = await connection.query(sql8, [result[0].insertId])
        const temp4 = rows8.map((o1) => o1.id);
        console.log(temp4)
        if (temp4.length > 0) {
            const resp4 = await connection.query(sql9, [temp4])
        }
        console.log(temp)
        console.log(temp2)
        await connection.commit();
        eventBus.emit("taskdeleteall", { ids: temp4 })
        eventBus.emit("updateteams", { data: rows[0], ids: temp })
        eventBus.emit("updateteams", { data: rows6[0], ids: temp })
        eventBus.emit("deleteteams", { data: temp2, ids: temp })
        eventBus.emit("teamchange", { ids: temp4 })
        eventBus.emit("updateAdminteam", {
            data: {
                rows: rows7.map((o1) => {
                    return { ...o1, assigned_team: null }
                }), ids: rows7.map((o1) => o1.id)
            }, ids: [req.user.id]
        })
        eventBus.emit("Admintaskdelete", { data: rows7.map((o1) => o1.id), ids: [req.user.id] })
    }
    catch (err) {
        await connection.rollback();
        throw new Error(err.message)
    }
    finally {
        await connection.release();
    }
    res.status(200).json();
})
router.get("/admin/pending", authenticate, RolebasedAuth.add_teams, async (req, res) => {
    const sql = `SELECT t.*, u1.username AS assigned_by_main_username FROM tasks t
    JOIN users u1 ON u1.id = t.assigned_by_main
    WHERE t.assigned_by_main = ? AND assigned_team IS NULL`
    const values = [req.user.id]
    const [rows, fields] = await con.query(sql, values)
    res.status(200).json(rows)
})
router.get("/getteams", authenticate, RolebasedAuth.view_teams, async (req, res) => {
    const sql = "SELECT * FROM teams";
    const [rows] = await con.query(sql);
    //console.log(rows, "teams");
    res.status(200).json(rows);
})

router.post("/addtaskteam", authenticate, RolebasedAuth.add_teams, async (req, res) => {

    //console.log("addtaskteam request received");

    const assigned_by = req.user.id;
    const { task, assigned, deadline } = req.body;
    //console.log(assigned)
    const sql = "INSERT INTO tasks (Task, assigned_team, assigned_by_main, deadline) VALUES (?, ?, ?, ?)";
    const values = [task, assigned, assigned_by, deadline];
    try {
        const [result] = await con.query(sql, values);
        const sql2 = `SELECT t.*, u1.username AS assigned_by_main_username,t2.team_lead AS leadid, t2.team_name AS assigned_team_name FROM tasks t
    JOIN users u1 ON t.assigned_by_main = u1.id
    JOIN teams t2 ON t.assigned_team = t2.id
    WHERE (assigned_by_main = ? AND t.id = ?)`
        const values2 = [req.user.id, result.insertId]
        const [rows, fields] = await con.query(sql2, values2)
        const temp = rows[0];
        temp.team_name = temp.assigned_team_name;
        temp.main_name = temp.assigned_by_main_username
        console.log(rows[0].leadid)
        eventBus.emit("teamupdate", { data: temp, ids: [rows[0].leadid] })
        eventBus.emit("Admintaskupdate", { data: rows[0], ids: [req.user.id] })
        //console.log("Task added successfully:", result);
        return res.status(200).send();
    } catch (err) {
        console.error("Error adding task:", err);
        throw err
        //return res.status(400).json({ err: "Error adding task" });
    }
})

router.get("/tasksListAdmin", authenticate, RolebasedAuth.add_teams, async (req, res) => {
    ////console.log("entered_admin")
    const sql = `SELECT t.*, u1.username AS assigned_by_main_username, t2.team_name AS assigned_team_name FROM tasks t
    JOIN users u1 ON t.assigned_by_main = u1.id
    JOIN teams t2 ON t.assigned_team = t2.id
    WHERE assigned_by_main = ?`
    const values = [req.user.id];
    const [rows, field] = await con.query(sql, values);
    console.log(rows);
    res.status(200).json(rows);
})

router.get("/deleteTaskadmin/:id", authenticate, RolebasedAuth.add_teams, async (req, res) => {
    const { id } = req.params
    const sql = "DELETE FROM tasks WHERE id = ?"
    const values = [id]
    const sql2 = "SELECT t.*, t2.team_lead FROM tasks t JOIN teams t2 ON t2.id = t.assigned_team WHERE t.id = ?"
    const [rows, fields] = await con.query(sql2, values)
    const result = await con.query(sql, values)
    eventBus.emit("Admintaskdelete", { data: [rows[0].id], ids: [req.user.id] })
    eventBus.emit("teamdelete", { data: { id: rows[0].id }, ids: [rows[0].team_lead] })
    eventBus.emit("taskdelete", { data: [rows[0].id], ids: [rows[0].Assigned_to, rows[0].team_lead] })
    res.status(200).json()
})

router.post("/logout", authenticate, (req, res) => {
    ////console.log("logging_out");
    eventBus.emit("logout", { ids: [req.user.id] });
    res.clearCookie("auth");
    return res.status(200).json()
})

router.get('/Team', authenticate, async (req, res) => {

    if (req.user.role === 1) {

        const sql = `SELECT team_name, JSON_ARRAYAGG(JSON_OBJECT('username', username, 'role', role)) AS members
        FROM teams JOIN users ON users.team_id = teams.id
        GROUP BY team_name;`
        const [rows, fields] = await con.query(sql);
        //console.log(rows)
        res.status(200).json(rows);
    }
    else {
        const user = req.user.id;
        //console.log(user);
        const sql = `SELECT t1.username AS user, t1.role AS userrole, t1.id AS id FROM users t
        JOIN users t1 ON t.team_id = t1.team_id WHERE t.id = ?`
        const values = [user];
        const [rows, fields] = await con.query(sql, values);
        res.status(200).json(rows);
    }
})

router.post('/complete/task', authenticate, Validation("progress"), RolebasedAuth.Update_task, async (req, res) => {

    if (req.user.role === 1) {
        let sql;
        //console.log("entered+role1")
        if (req.body.progress === 100) {
            sql = "UPDATE tasks SET statuss = 'complete', progress = ?, old_progress = ? WHERE id = ?"
        }
        else {
            sql = "UPDATE tasks SET statuss = 'partial', progress = ?, old_progress = ? WHERE id = ?"
        }
        const values = [req.body.progress, req.body.progress, req.body.id]
        const resp = await con.query(sql, values)
        res.status(200).json()
    }
    else if (req.user.role === 2) {
        let sql;
        if (req.body.progress === 100) {
            sql = `UPDATE tasks SET statuss = CASE
         WHEN assigned_by_main IS NULL then 'complete' 
         ELSE 'admin_review'
         END,
         old_progress = CASE
         WHEN assigned_by_main IS NULL then progress
         ELSE old_progress
         END
         progress = ?
         WHERE id = ?`
        }
        else {
            sql = `UPDATE tasks SET statuss = CASE
         WHEN assigned_by_main IS NULL then 'partial' 
         ELSE 'admin_review'
         END,
         progress = ?,
         old_progress = CASE
         WHEN assigned_by_main IS NULL then progress
         ELSE old_progress
         END
         WHERE id = ?
         
         `
        }
        const values = [req.body.progress, req.body.id]
        const resp = await con.query(sql, values)
        res.status(200).json()

    }
    else {
        const sql = "UPDATE tasks SET statuss = 'review', progress = ? WHERE id = ?"
        const values = [req.body.progress, req.body.id]
        const resp = await con.query(sql, values)
        res.status(200).json()
    }
})

router.get("/review", authenticate, RolebasedAuth.add_task, async (req, res) => {
    if (req.user.role !== 1) {
        const sql = `SELECT t.*, u1.username AS assigned_to_username, u2.username AS assigned_by_username
    FROM tasks t JOIN users u1 ON t.assigned_to = u1.id
    JOIN users u2 ON t.assigned_by = u2.id WHERE (t.assigned_to = ? OR t.assigned_by = ?) AND statuss = "review"`;
        const values = [req.user.id, req.user.id]
        const [rows, fields] = await con.query(sql, values)

        res.status(200).json(rows)
    }
    else {
        const sql = `SELECT t.*, u1.username AS assigned_by_username, t2.team_name AS assigned_to_username FROM tasks t
    JOIN users u1 ON t.assigned_by_main = u1.id
    JOIN teams t2 ON t.assigned_team = t2.id
    WHERE assigned_by_main = ? AND statuss = "admin_review"`
        const values = [req.user.id]
        const [rows, fields] = await con.query(sql, values)
        res.status(200).json(rows)
    }
})

router.get("/roll_back/:id", authenticate, RolebasedAuth.add_task, async (req, res) => {
    const id = req.params.id;
    const sql = "UPDATE tasks SET progress = old_progress, statuss = 'partial' WHERE id = ?"
    const values = [id];
    const result = await con.query(sql, values)
    res.status(200).json()
})

router.post("/progress", authenticate, RolebasedAuth.Update_task, Validation("progress"), async (req, res) => {
    //console.log("entered")
    if (req.body.type === 1 && req.user.id > 2) {
        const error = new Error("lack permission")
        error.status(400)
        throw error;
    }
    const sql = "INSERT INTO progress (comments, task_id,created_at,type) VALUES (?,?,?,?)"
    const values = [req.body.comments, req.body.taskid, req.body.date, req.body.type]
    const result = await con.query(sql, values)
    res.status(200).json()
})

router.get("/Task/:taskid", authenticate, RolebasedAuth.Update_task, async (req, res) => {
    const sql = `SELECT t.*, t1.username AS assigned_by_username, t2.username AS assigned_to_username FROM tasks t
    JOIN users t1 ON t.assigned_by = t1.id
    JOIN users t2 ON t.assigned_to = t2.id
    WHERE t.id = ?
    `
    const values = [req.params.taskid]
    const [rows, field] = await con.query(sql, values)
    let sql2;
    if (req.user.role === 1) {
        console.log("here")
        sql2 = `SELECT * FROM progress WHERE task_id = ? AND type = 1`
    }
    else {
        sql2 = `SELECT * FROM progress WHERE task_id = ?`
    }
    const [rows2, field2] = await con.query(sql2, values)
    let temp = rows[0];
    //console.log(temp)
    temp = { ...temp, progress: rows2 }
    //console.log(temp)
    res.status(200).json(temp)
})

router.get("/userinfo/:id", authenticate, RolebasedAuth.add_user, async (req, res) => {
    const id = req.params.id;
    //console.log(id);
    const sql = `SELECT * FROM users WHERE id = ?`;
    const values = [id];
    const [rows, fields] = await con.query(sql, values);
    if (rows.length === 0) {
        throw new Error("User not found");
    }
    let temp = rows[0]
    temp.Pass = "";
    res.status(200).json(temp);
})

router.post("/updateuseradmin", authenticate, RolebasedAuth.add_user, Validation("updateuser2"), dupValidate, async (req, res) => {
    const id = req.body.id;
    console.log("Updating user with ID:", id);
    let { username, password, email, role } = req.body;
    password = await bcrypt.hash(password, 10);
    const sql = "UPDATE users SET username = ?, pass = ?, email = ?, role = ? WHERE id = ?";
    const values = [username, password, email, role, id];
    try {
        const [result] = await con.query(sql, values);
        const sql2 = `SELECT t.*, t1.team_name AS team_name, t2.role_name AS position
        FROM users t
        JOIN teams t1 ON t.team_id = t1.id
        JOIN roles t2 ON t.role = t2.id
        WHERE t.id = ?`;
        const values2 = [id];
        const [rows, fields] = await con.query(sql2, values2);
        const temp = rows[0];
        temp.team_id = "";
        temp.Pass = "";
        eventBus.emit("userupdate", { data: temp });
        return res.status(200).json();
    }
    catch (err) {
        throw err
    }
})