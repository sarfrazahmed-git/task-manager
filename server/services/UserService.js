import con from "../configdb.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { secret } from "../controllers/main.js";
import eventBus from "../../eventbus.js";


const imp_queries = {
    GetTasks: `SELECT t.*, u1.username AS assigned_to_username, u2.username AS assigned_by_username
    FROM tasks t JOIN users u1 ON t.assigned_to = u1.id
    JOIN users u2 ON t.assigned_by = u2.id WHERE (t.assigned_to = ? OR t.assigned_by = ?) AND (t.statuss = "partial" OR t.statuss = "active")`
}

async function GetTasks(con,userId) {
    const sql = imp_queries.GetTasks;
    const values = [userId, userId];
    const [rows, fields] = await con.query(sql, values);
    return rows;
}


async function GetTasksById(con, taskId) {
    if(taskId.length === 0){
        return [];
    }
    console.log("taskId,dele", taskId)
    const sql = `SELECT t.*, u1.username AS assigned_to_username, u2.username AS assigned_by_username
    FROM tasks t JOIN users u1 ON t.assigned_to = u1.id
    JOIN users u2 ON t.assigned_by = u2.id WHERE t.id IN (?) AND (t.statuss = "partial" OR t.statuss = "active")`
    const values = [taskId];
    const [rows, fields] = await con.query(sql, values);
    if (rows.length === 0) {
        const error = new Error("Task not found");
        error.code = 404;
        throw error;
    }
    return rows;
}

async function updateTaskAdmin(con, userId, taskId, team_id) {
    if(taskId.length === 0){
        return;
    }
    const sql = `UPDATE tasks SET assigned_by_main = ?, assigned_team = ? WHERE id = ?`;
    const values = [userId, team_id, taskId];
    const result = await con.query(sql, values);
    if (result[0].affectedRows === 0) {
        const error = new Error("Task not found or you do not have permission to update it");
        error.code = 404; // Not Found
        throw error;
    }
    return
}
async function GetTeamTasks(con, taskid) {
    if(taskid.length === 0){
        return [];
    }
    const sql2 = `SELECT t.*, t2.team_name AS team_name,t2.team_lead AS lead_id, u1.username AS main_name FROM tasks t
         JOIN teams t2 ON t.assigned_team = t2.id
         JOIN users u1 ON t.assigned_by_main = u1.id
         WHERE t.id IN (?) AND (t.statuss != "complete" AND t.statuss != "admin_review")`;
    const values2 = [taskid]
    const [rows, fields] = await con.query(sql2, values2
    );
    return rows;
}
async function AdminUpdateMeta(con,userID, taskId, teamId) {
    await updateTaskAdmin(con,userID, taskId, teamId);
    const tasks = await GetTeamTasks(con,[taskId]);
    const events = ["Admintaskupdate", "teamupdate", "deleteAdminteam"];
    const props = [
        { data: tasks[0], ids: [userID] },
        { data: tasks[0], ids: [tasks[0].lead_id] },
        { data: [taskId], ids: [userID] }
    ];
    event_emmitter(events, props);
}

async function updateTaskLead(con,user, assigned_to, taskid) {
    if(taskid.length === 0){
        return;
    }
    const sql = `UPDATE tasks SET assigned_by = ?, assigned_to = ? WHERE id = ?`
    const values = [user.id, assigned_to, taskid]
    const result = await con.query(sql, values)
    return
}
async function GetTeamLeadTasks(con,taskid) {
    if(taskid.length === 0){
        return [];
    }
    const sql2 = `SELECT t.*, t2.team_name AS team_name, u1.username AS main_name FROM tasks t
    JOIN teams t2 ON t.assigned_team = t2.id
    JOIN users u1 ON t.assigned_by_main = u1.id
    WHERE t.id IN (?)`;
    const values2 = [taskid]
    const [rows, field] = await con.query(sql2, values2);
    console.log("rows", rows)
    return rows;
}
async function TeamUpdateMeta(con,user, assigned_to, taskid) {
    console.log(assigned_to, "assigend_to")
    await updateTaskLead(con,user, assigned_to, taskid);
    const leadtasks = await GetTeamLeadTasks(con,[taskid]);
    const membertask = await GetTasksById(con,[taskid]);

    const events = ["taskupdate", "teamupdate"];
    const props = [
        { data: membertask[0], ids: [user.id, assigned_to] },
        { data: leadtasks[0], ids: [user.id] }
    ];
    event_emmitter(events, props);
}
async function Checkcredentials(con,username, password) {
    const [rows, fields] = await con.query(`SELECT * FROM users WHERE username = ?`, [username]);
    if (rows.length === 0) {
        const error = new Error("Invalid username or password");
        error.code = 401;
        throw error;
    }
    else {
        const bool = await bcrypt.compare(password, rows[0].Pass);
        if (!bool) {
            const error = new Error("Invalid username or password");
            error.code = 401;
            throw error;
        }
    }
    return rows[0].id
}
async function Getuser(con,id) {
    const [rows, fields] = await con.query(`SELECT t.*, t1.team_name AS team_name, t2.role_name AS position
            FROM users t
            JOIN teams t1 ON t.team_id = t1.id
            JOIN roles t2 ON t.role = t2.id
            WHERE t.id = ?`, [id]);
    if (rows.length === 0) {
        const error = new Error("User not found");
        error.code = 404; // Not Found
        throw error;
    }
    let user = rows[0];
    user.Pass = "";
    return user;
}

async function GetteamtasksID(con,team_id) {
    const sql = `SELECT * FROM tasks WHERE assigned_team = ?`;
    const values = [team_id];
    const [rows, fields] = await con.query(sql, values)
    return rows.map((o1) => o1.id)
}

async function add_user(con,{ password, username, email, role }) {
    const sql = `
    INSERT INTO users (pass, username, email,role)
    VALUES (?, ?, ?,?)
  `;
    password = await bcrypt.hash(password, 10);
    const values = [password, username, email, role];
    const result = await con.query(sql, values)
    const team = await getteams(con, [34]);
    return result[0].insertId
}

async function add_task_lead(con,{ task, assigned_to, assigned_by, deadline }) {
    const query = `INSERT INTO tasks (Task, assigned_to, assigned_by, deadline) VALUES (?, ?, ?, ?)`;
    const values = [task, assigned_to, assigned_by, deadline];
    const result = await con.query(query, values);
    return result[0].insertId;
}

async function deleteTasksLead(con, taskid) {
    if(taskid.length === 0){
        return;
    }
    const sql = `DELETE FROM tasks WHERE id IN (?)`;
    const values = [taskid];
    const result = await con.query(sql, values);
    return taskid;
}

async function deleteAdminTaskLead(con,taskid) {
    if (taskid.length === 0) {
        return;
    }
    const sql2 = `UPDATE tasks SET assigned_to = null , assigned_by = null WHERE id IN (?)`
    const values = [taskid];
    const result2 = await con.query(sql2, values);
    return taskid;
}

function event_emmitter(events, props) {
    for (let i = 0; i < events.length; i++) {
        console.log(events[i], props[i])
        eventBus.emit(events[i], props[i]);
    }
}

async function MetaDeleteTasksLead(con, taskid) {
    console.log("metadeltasktaskid", [taskid]);
    const ntask = await GetTasksById(con, [taskid]);
    if (ntask.length === 0) {
        const error = new Error("Task not found");
        error.code = 404; // Not Found
        throw error;
    }

    console.log("ntask", ntask);
    deleteTasksLead(con, taskid);
    const events = ["taskdelete"]
    const props = [{ data: [taskid], ids: [ntask[0].assigned_by, ntask[0].assigned_to] }];
    console.log("props", props);
    event_emmitter(events, props);
}

async function MetaDeleteAdminTasksLead(con, tasks) {
    const ids = [tasks[0].assigned_by, tasks[0].assigned_to]
    tasks[0].assigned_by = null;
    tasks[0].assigned_to = null;
    deleteAdminTaskLead(con,[tasks[0].id]);
    const events = ["taskdelete", "teamupdate"];
    const props = [
        { data: [tasks[0].id], ids: ids },
        { data: tasks[0], ids: [ids[0]] }
    ];
    event_emmitter(events, props);
}

async function Establishcon() {
    let connection;
    try {
        connection = await con.getConnection()
        return connection;
    }
    catch (err) {
        throw err
    }
}
async function deleteTeamLead(connection,user) {
    if (user.team_id !== 34) {
        deleteLeadWithTeam(connection,user);
    }
    else {
        deleteLeadwithoutTeam(connection,user)
    }
}
async function deleteuser(connection, id){
    const sql = `DELETE FROM users WHERE id = ?`
    const values = [id]
    await connection.query(sql,values);
    return
}

async function deleteLeadWithTeam(connection, user) {
    const data = await GetPreData(connection,user);
    const taskids = data.allTasks.map((t1)=>t1.id)
    const adminid = data.admins[0].id;
    await Reassign(connection,taskids,adminid);
    await changeteam(connection,data.teamMembers.map((o1)=>o1.id))
    await deleteam(connection,[user.team_id]);
    await deleteuser(connection,user.id);
    const teams = await getteams(connection);
    console.log("here",taskids);
    let tasks;
    if(taskids.length === 0){
        tasks = []
    }
    else{
    tasks = await connection.query(`SELECT * FROM tasks WHERE id IN (?)`, [taskids]);
    tasks = tasks[0];    
}
    const events = ["userdelete", "teamchange", "updateteams", "deleteteams", "taskdeleteall"];
    const props = [
        {data: { id: user.id }},
        { ids: data.teamMembers.map((o1) => o1.id)},
        { data: teams[0], ids: data.admins.map((o1) => o1.id) },
        {data: user.team_name, ids: data.admins.map((o1) => o1.id) },
        {data: taskids, ids: data.teamMembers.map((o1) => o1.id) }
    ];
    console.log("tasks", tasks);
    tasks.sort((a, b) => a.assigned_by_main - b.assigned_by_main);
    let taskEvents = [];
    if(tasks.length > 0){
        taskEvents.push(tasks[0]);
    }

    for (let i = 1; i < tasks.length; i++) {
        if(taskEvents[0].assigned_by_main === tasks[i].assigned_by_main){
            taskEvents.push(tasks[i]);
        }
        else{
            console.log("taskEvents", taskEvents);
            events.push("updateAdminteam");
            props.push({ data: {rows: taskEvents, ids: taskEvents.map((t1)=>t1.id)}, ids: [taskEvents[0].assigned_by_main]});
            events.push("Admintaskdelete");
            props.push({ data: taskEvents.map((t1)=>t1.id), ids: [taskEvents[0].assigned_by_main] });
            taskEvents = [tasks[i]];
        }
    }
    if(taskEvents.length > 0){
        console.log("taskEvents", taskEvents);
        events.push("updateAdminteam");
        props.push({ data: {rows: taskEvents, ids: taskEvents.map((t1)=>t1.id)}, ids: [taskEvents[0].assigned_by_main]});
        events.push("Admintaskdelete");
        props.push({ data: taskEvents.map((t1)=>t1.id), ids: [taskEvents[0].assigned_by_main] });
    }
    connection.commit();
    console.log("events", events);
    console.log("props", props);
    event_emmitter(events, props);
}

async function deleteLeadwithoutTeam(connection, user){
    await deleteuser(connection,user.id)
    const teams = await getteams(connection);
    const members = await GetteamMembers(connection, 34);
    const admins = await getAdmins(connection);
    const events = ["userdelete", "teamchange","teamupdate"]
    const props = [{data: user.id}, {ids:members}, {data:teams[0],ids:admins}]
    await connection.commit();
    event_emmitter(events,props);
}

async function GetteamMembers(connection,teamid) {
    const sql2 = `SELECT * FROM users WHERE team_id IN (?)`
    const values2 = [teamid]
    const [rows2, fields2] = await connection.query(sql2, values2)
    return rows2
}

async function GetAllTasks(connection,id, teamid) {
    const sql3 = `SELECT * FROM tasks WHERE assigned_by = ? OR assigned_team = ?`
    const values3 = [id, teamid]
    const [rows3, fields3] = await connection.query(sql3, values3)
    return rows3
}

async function getAdmins(connection) {
    const sqlnew = `SELECT * FROM users WHERE role = 1`
    const [rows4, fields4] = await connection.query(sqlnew)
    if (rows4.length === 0) {
        throw new Error("No admin user found")
    }
    return rows4
}

async function GetPreData(connection,user) {
    const teamMembers = await GetteamMembers(connection,user.team_id)
    const allTasks = await GetAllTasks(connection,user.id, user.team_id)
    const admins = await getAdmins(connection)

    return { teamMembers, allTasks, admins }
}

async function Reassign(connection, taskids, adminid, team = null) {
    console.log("here");
    if(taskids.length === 0){
        return;
    }
    const sql4 = `UPDATE tasks SET assigned_to = ?,assigned_by = ?, assigned_team = ?, assigned_by_main = CASE 
    WHEN assigned_by_main IS NULL
    THEN ?
    ELSE assigned_by_main END
    WHERE id IN (?)`
    const values = [null,null, team, adminid, taskids]
    await connection.query(sql4, values)
    return;
}

async function changeteam(connection,members, team = 34) {
    const sql5 = `UPDATE users SET team_id = ? WHERE id IN (?)`
    const values5 = [team,members]
    await connection.query(sql5, values5)
    return
}

async function deleteam(connection,team_ids){
    const sql6 = `DELETE FROM teams WHERE id IN (?)`
    const values6 = [team_ids]
    await connection.query(sql6, values6)
    return;
}

async function getteams(connection, team = [34]){
    console.log("err")
    const sql8 = `SELECT team_name, JSON_ARRAYAGG(JSON_OBJECT('username', username, 'role', role)) AS members
        FROM teams JOIN users ON users.team_id = teams.id
        WHERE teams.id IN (?)
        GROUP BY team_name`
    const values = [team]
    const [rows8, fields8] = await connection.query(sql8, values)
    return rows8;
}



const UserService = {
    login: async (username, password) => {

        const id = await Checkcredentials(con,username, password);
        let user = await Getuser(con,id);
        const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: "10m" });
        return { user, token };
    },
    adduser: async (obj) => {
        const id = await add_user(con,{ ...obj })
        const user = await Getuser(con,id);
        const events = ["userupdate"]
        const props = [{ data: user }]
        event_emmitter(events, props)
        return
    },

    getUsersList: async () => {
        const sql = `Select * from users`;
        const [rows, fields] = await con.query(sql);
        const users = rows.map((user) => {
            const plainUser = { ...user };
            plainUser.password = "";
            return plainUser;
        })
        return users;
    },

    getTasklist: async (userID) => {
        const tasks = await GetTasks(con,userID);
        return tasks;
    },

    updateTask: async (user, taskid, assigned_to) => {
        assigned_to = Number(assigned_to)
        if (user.role === 1) {
            AdminUpdateMeta(con,user.id, taskid, assigned_to);
        }
        else if (user.role === 2) {
            TeamUpdateMeta(con,user, assigned_to, taskid);
        }
    },

    GetTeamtasksLead: async (userid) => {
        const user = await Getuser(con,userid)
        console.log("user", user);
        const taskid = await GetteamtasksID(con,user.team_id)
        console.log("taskid", taskid)
        const tasks = await GetTeamLeadTasks(con,taskid);
        console.log("tasks", tasks)
        return tasks;
    },

    GetProfile: async (id) => {
        const user = await Getuser(con,id);
        return user;
    },

    AddTaskLead: async (taskData) => {
        const taskId = await add_task_lead(con,taskData);
        const task = await GetTasksById(con,[taskId]);
        const events = ["taskupdate"]
        const props = [{ data: task[0], ids: [taskData.assigned_to, taskData.assigned_by] }];
        event_emmitter(events, props);
        return
    },

    Deletetask: async (taskid, user) => {
        const tasks = await GetTeamTasks(con,[taskid]);
        if (tasks.length === 0) {
            console.log("here")
            await MetaDeleteTasksLead(con,taskid)
        }
        else {
            console.log("here2")
            await MetaDeleteAdminTasksLead(con,tasks)
        }
        return
    },

    DeleteUser: async (id) => {
        const connection = await Establishcon();
        try{
        const user = await Getuser(connection,id);
        if (user.role === 2) {
            deleteTeamLead(connection,user);
            /*
            tasks_assigned_by go back to admin,
            tasks_assigned_to go back to admin,
            team members go to default team,
            team deleted,
            user deleted,
            events emmited:
            teammembers: delete all tasks, change team.
            admin: delete task, change unnasigned_tasks, update teams (default), delete team
            all: user delete.
            */
        }
        else {
            console.log("assigne_delete")
            const user = await Getuser(connection,id);
            const tasks = await GetTasks(connection,[user.id])
            const ids = tasks.map((t1)=>t1.id);
            const admins = await getAdmins(connection)
            await Reassign(connection, ids,admins[0].id,user.team_id)
            const teams = await getteams(connection,[user.team_id, 34])
            console.log("teams", teams);
            const team_members = await GetteamMembers(connection, user.team_id)
            const new_tasks = await GetTasksById(connection,ids)
            await connection.query(`DELETE FROM users WHERE id = ?`, user.id);
            const events = ["userdelete", "teamchange","updateteams"]
            const props = [{data: {id:user.id}}, {ids:team_members.map((o1)=>o1.id)}, {data:teams[0],ids:admins.map((o1)=>o1.id)}]
            await connection.commit();
            event_emmitter(events,props);
        }}
        catch(err){
            console.log("err", err);
            await connection.rollback()
            throw err;
        }
        finally{
            await connection.release()
        }
        return
    }
}

// const id = Number(req.params.id);
//     let connection;
//     try {
//         connection = await con.getConnection()
//     }
//     catch (err) {
//         throw err
//     }
//     try {
//         await connection.beginTransaction()
//         const sql1 = `SELECT u.*, t.team_name AS team_name FROM users u 
//         JOIN teams t ON u.team_id = t.id WHERE u.id = ?`
//         const values1 = [id]
//         const [rows, fields] = await connection.query(sql1, values1);
//         if (rows.length > 0) {
//             if (rows[0].role === 2) {
//                 if (rows[0].team_id !== 34) {
//                     const sql2 = `SELECT * FROM users WHERE team_id = ?`
//                     const values2 = [rows[0].team_id]
//                     const [rows2, fields2] = await connection.query(sql2, values2)

//                     const sql3 = `SELECT * FROM tasks WHERE assigned_by = ? OR assigned_team = ?`
//                     const values3 = [rows[0].id, rows[0].team_id]
//                     const [rows3,fields3] = await connection.query(sql3, values3)

//                     const sqlnew = `SELECT * FROM users WHERE role = 1`
//                     const [rows4, fields4] = await connection.query(sqlnew)
//                     if (rows4.length === 0) {
//                         throw new Error("No admin user found")
//                     }
//                     const admin_id = rows4[0].id;
//                     const temp3 = rows3.map((o1) => o1.id);
//                     console.log(temp3, "temp3")
//                     const sql4 = `UPDATE tasks SET assigned_to = ?,assigned_by = ?, assigned_team = ?, assigned_by_main = CASE 
//                     WHEN assigned_by_main IS NULL
//                     THEN ?
//                     ELSE assigned_by_main END
//                     WHERE id IN (?)`

//                     const values4 = [null,null,null, admin_id, temp3]
//                     await connection.query(sql4, values4)

//                     const temp4 = rows2.map((o1) => o1.id);
//                     const sql5 = `UPDATE users SET team_id = DEFAULT WHERE id IN (?)`
//                     const values5 = [temp4]
//                     await connection.query(sql5, values5)

//                     const sql6 = `DELETE FROM teams WHERE id = ?`
//                     const values6 = [rows[0].team_id]
//                     await connection.query(sql6, values6)

//                     const sql7 = `DELETE FROM users WHERE id = ?`
//                     const values7 = [id]
//                     await connection.query(sql7, values7)
//                     const sql8 = `SELECT team_name, JSON_ARRAYAGG(JSON_OBJECT('username', username, 'role', role)) AS members
//         FROM teams JOIN users ON users.team_id = teams.id
//         WHERE team_name = "DEFAULT"
//         GROUP BY team_name`
//                     const [rows8, fields8] = await connection.query(sql8)
//                     const sql9 = `SELECT * FROM tasks WHERE id IN (?)`
//                     const values9 = [temp3]
//                     const [rows9, fields9] = await connection.query(sql9, values9)
//                     console.log(rows9, "rows9")
//                     await connection.commit()
//                     eventBus.emit("userdelete", { data: { id: id } });
//                     eventBus.emit("teamchange", { ids: temp4 });
//                     eventBus.emit("updateteams", { data: rows8[0], ids: rows4.map((o1) => o1.id)});
//                     eventBus.emit("deleteteams", { data: rows[0].team_name, ids: rows4.map((o1) => o1.id)});
//                     eventBus.emit("taskdeleteall", { data: temp3, ids: rows2.map((o1) => o1.id)});
//                     let admintasks = rows9
//                     admintasks = admintasks.sort((a,b)=>a.assigned_by_main - b.assigned_by_main)
//                     let sender = []
//                     if(admintasks.length > 0){
//                         sender.push(admintasks[0])
//                     }
//                     for(let i = 1; i < admintasks.length; i++){
//                         if(admintasks[i].assigned_by_main === sender[0].assigned_by_main){
//                             sender.push(admintasks[i])
//                         }
//                         else{
//                             console.log(sender);
//                             eventBus.emit("updateAdminteam", {
//                                 data: {
//                                     rows: sender,
//                                     ids: sender.map((o1) => o1.id)
//                                 }, ids: [sender[0].assigned_by_main]
//                             })
//                             eventBus.emit("Admintaskdelete", { data: sender.map((o1) => o1.id), ids: [sender[0].assigned_by_main] })
//                             sender = [admintasks[i]]
//                         }
//                     }
//                     if (sender.length > 0) {
//                         console.log(sender);
//                         eventBus.emit("updateAdminteam", {
//                             data: {
//                                 rows: sender,
//                                 ids: sender.map((o1) => o1.id)
//                             }, ids: [sender[0].assigned_by_main]
//                         })
//                         eventBus.emit("Admintaskdelete", { data: sender.map((o1) => o1.id), ids: [sender[0].assigned_by_main] })
//                     }
//                 }
//                 else {
//                     const sql2 = `DELETE FROM users WHERE id = ?`
//                     const sql3 = `SELECT id,role FROM users WHERE team_id = 34`
//                     const values2 = [id]
//                     await connection.query(sql2, values2)
//                     const [rows3, fields3] = await connection.query(sql3)
//                     const temp3 = rows3.map((o1) => o1.id);
//                     const temp4 = rows3.map((o1) => {
//                         if (o1.role === 1) {
//                             return o1.id
//                         }
//                         else {
//                             return null
//                         }
//                     });
//                     const sql4 = `SELECT team_name, JSON_ARRAYAGG(JSON_OBJECT('username', username, 'role', role)) AS members
//         FROM teams JOIN users ON users.team_id = teams.id
//         WHERE team_name = "DEFAULT"
//         GROUP BY team_name`
//                     const [rows4, fields4] = await connection.query(sql4)
//                     await connection.commit()
//                     eventBus.emit("userdelete", { data: { id: id } });
//                     eventBus.emit("teamchange", { ids: temp3 })
//                     eventBus.emit("teamupdate", { data: rows4[0], ids: temp4 })
//                 }
//             }
//             else {
//                 const sql2 = `SELECT * FROM users WHERE role = 1`
//                 const [rows2, field2] = await connection.query(sql2)
//                 if (rows2.length === 0) {
//                     throw new Error
//                 }
//                 else {
//                     const sql3 = `SELECT * FROM tasks WHERE assigned_to = ?`
//                     const values3 = [id]
//                     const [rows3, fields3] = await connection.query(sql3, values3)
//                     const sql4 = `UPDATE tasks SET assigned_to = ?, assigned_team = ?,assigned_by_main = ? WHERE assigned_to = ?`
//                     let values4;
//                     console.log(rows3, "rows3")
//                     if (rows3.length > 0) {
//                         values4 = [null, rows[0].team_id, rows2[0].id, id]

//                     }
//                     else {
//                         values4 = [null, null, rows2[0].id, id]
//                     }
//                     const resp = await connection.query(sql4, values4)
//                     const sql5 = `DELETE FROM users WHERE id = ?`
//                     const values5 = [id]
//                     await connection.query(sql5, values5)
//                     const sql6 = `SELECT id FROM users WHERE team_id = ?`
//                     const values6 = [rows[0].team_id]
//                     const [rows6, fields6] = await connection.query(sql6, values6)
//                     const temp6 = rows6.map((o1) => o1.id);
//                     await connection.commit()
//                     eventBus.emit("userdelete", { data: { id: id } });
//                     eventBus.emit("teamchange", { ids: temp6 })
//                     console.log(rows3, "rows")
//                     if (rows3.length > 0) {
//                         eventBus.emit("taskdelete", { data: rows3.map((o1) => o1.id), ids: [rows3[0].assigned_by] })
//                     }
//                     const temp = rows3.map((o1) => { return { ...o1, assigned_to: null, assigned_teams: rows[0].team_id, assigned_by_main: rows2[0].id } })
//                     for (let i = 0; i < rows3.length; i++) {
//                         eventBus.emit("teamupdate", { data: temp[i], ids: [temp[i].assigned_by] });
//                     }
//                 }
//             }
//         } else {
//             const error = new Error("invalid user");
//             error.code = 404
//             throw error
//         }
//     }
//     catch (err) {
//         connection.rollback()
//         throw err
//     }
//     finally {
//         connection.release()
//     }
//     return res.status(200).send();

export default UserService;