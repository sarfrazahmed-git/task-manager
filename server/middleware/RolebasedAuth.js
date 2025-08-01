import con from "../configdb.js";
const Authentication = {
    add_user: async (req,res,next)=>{
        const [rows] = await con.query("SELECT * FROM permissions WHERE permission_name = 'add_users'")
        const [user] = await con.query("SELECT * FROM rolehaspermissions WHERE role_id = ? AND permission_id = ?", [req.user.role,rows[0].id]);
        if(user.length === 0){
            const error =  new Error("You do not have the required security clearance");
            error.code = 404;
            throw error
        }
        else{
            next();
        }},
    add_task: async (req,res,next)=>{
        const [rows] = await con.query("SELECT * FROM permissions WHERE permission_name = 'add_tasks'")
        const [user] = await con.query("SELECT * FROM rolehaspermissions WHERE role_id = ? AND permission_id = ?", [req.user.role,rows[0].id]);
        if(user.length === 0){
            const error =  new Error("You do not have the required security clearance");
            error.code = 404;
            throw error
        }
        else{
            next();
        }
    },

    delete_task: async (req,res,next)=>{
        const [rows] = await con.query("SELECT * FROM permissions WHERE permission_name = 'delete_tasks'")
        const [user] = await con.query("SELECT * FROM rolehaspermissions WHERE role_id = ? AND permission_id = ?", [req.user.role,rows[0].id]);
        if(user.length === 0){
            const error =  new Error("You do not have the required security clearance");
            error.code = 404;
            throw error
        }
        else{
            next();
        }
    },

    Update_task: async(req,res,next)=>{
        const[rows] = await con.query("SELECT * FROM permissions WHERE permission_name = 'change_tasks'")
        const[user] = await con.query("SELECT * FROM rolehaspermissions WHERE role_id = ? AND permission_id = ?",[req.user.role, rows[0].id])
        if(user.length === 0){
            const error =  new Error("You do not have the required security clearance");
            error.code = 404;
            throw error
        }
        else{
            next();
        }
    },
    delete_user: async (req,res,next)=>{
        const [rows] = await con.query("SELECT * FROM permissions WHERE permission_name = 'delete_users'")
        const [user] = await con.query("SELECT * FROM rolehaspermissions WHERE role_id = ? AND permission_id = ?", [req.user.role,rows[0].id]);
        if(user.length === 0){
            const error =  new Error("You do not have the required security clearance");
            error.code = 404;
            throw error
        }
        else{
            next();
        }
    },
    update_user: async (req,res,next)=>{
        const [rows] = await con.query("SELECT * FROM permissions WHERE permission_name = 'change_users'")
        console.log("users", rows);
        const [user] = await con.query("SELECT * FROM rolehaspermissions WHERE role_id = ? AND permission_id = ?", [req.user.role,rows[0].id]);
        if(user.length === 0){
            const error =  new Error("You do not have the required security clearance");
            error.code = 404;
            throw error
        }
        else{
            next();
        }
    },
    view_users: async (req,res,next)=>{
        const [rows] = await con.query("SELECT * FROM permissions WHERE permission_name = 'view_users'")
        const [user] = await con.query("SELECT * FROM rolehaspermissions WHERE role_id = ? AND permission_id = ?", [req.user.role,rows[0].id]);
        if(user.length === 0){
            const error =  new Error("You do not have the required security clearance");
            error.code = 404;
            throw error
        }
        else{
            next();
        }
    },
    view_tasks: async (req,res,next)=>{
        const [rows] = await con.query("SELECT * FROM permissions WHERE permission_name = 'view_tasks'")
        const [user] = await con.query("SELECT * FROM rolehaspermissions WHERE role_id = ? AND permission_id = ?", [req.user.role,rows[0].id]);
        if(user.length === 0){
            const error =  new Error("You do not have the required security clearance");
            error.code = 404;
            throw error
        }
        else{
            next();
        }
    },
    add_teams: async (req,res,next)=>{
        const [rows] = await con.query("SELECT * FROM permissions WHERE permission_name = 'add_teams'")
        const [user] = await con.query("SELECT * FROM rolehaspermissions WHERE role_id = ? AND permission_id = ?", [req.user.role,rows[0].id]);
        if(user.length === 0){
            const error =  new Error("You do not have the required security clearance");
            error.code = 404;
            throw error
        }
        else{
            next();
        }
    },
    delete_teams: async (req,res,next)=>{
        const [rows] = await con.query("SELECT * FROM permissions WHERE permission_name = 'delete_teams'")
        const [user] = await con.query("SELECT * FROM rolehaspermissions WHERE role_id = ? AND permission_id = ?", [req.user.role,rows[0].id]);
        if(user.length === 0){
            const error =  new Error("You do not have the required security clearance");
            error.code = 404;
            throw error
        }
        else{
            next();
        }
    },
    update_teams: async (req,res,next)=>{
        const [rows] = await con.query("SELECT * FROM permissions WHERE permission_name = 'change_teams'")
        const [user] = await con.query("SELECT * FROM rolehaspermissions WHERE role_id = ? AND permission_id = ?", [req.user.role,rows[0].id]);
        if(user.length === 0){
            const error =  new Error("You do not have the required security clearance");
            error.code = 404;
            throw error
        }
        else{
            next();
        }
    },
    view_teams: async (req,res,next)=>{
        const [rows] = await con.query("SELECT * FROM permissions WHERE permission_name = 'view_teams'")
        const [user] = await con.query("SELECT * FROM rolehaspermissions WHERE role_id = ? AND permission_id = ?", [req.user.role,rows[0].id]);
        if(user.length === 0){
            const error =  new Error("You do not have the required security clearance");
            error.code = 404;
            throw error
        }
        else{
            next();
        }
    } 
}


export default Authentication;