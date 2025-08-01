import { useEffect, useReducer,useRef } from "react";
import {useContext, createContext, useState} from "react";
import {io} from "socket.io-client";

const userContext = createContext()

export const useUsercontext = ()=>{
    const temp = useContext(userContext);
    if(temp === null){
        throw new Error("not inside provider");

    }
    return temp;
}

export const Contextprovider = ({children})=>{
    const [role, setrole] = useState(() => {
        try{
  const storedRole = localStorage.getItem('role');
  return storedRole ? JSON.parse(storedRole) : 1000000;}
  catch(err){
    return 1000000
  }
});

    const sockref = useRef(null);
    const [connected,setconnected] = useState(false);
    const [users,setusers] = useState([])
    const [tasks, settasks] = useState([]);
    const [error, seterror] = useState("");
    const [roles, setroles] = useState([]);
    const [teams, setteams] = useState([]);
    const [team_task, set_team_task] = useState([]);
    const [tasks_admin, set_tasks_admin] = useState([]);
    const [loggedin, setlogin] = useState(false)
    const [current_user, set_user] = useState()
    const [team,setteam] = useState([])
    const[review_tasks, set_review] = useState([])
    const [Admin_team_task,set_admin_team] = useState([])


    function connectSocket() {
        try {
            const socket = io("http://localhost:8100", {
                transports: ["websocket"],
                withCredentials: true,
            });
            sockref.current = socket;
            console.log("Socket connected");
        } catch (error) {
            console.error("Socket connection error:", error);
            setconnected(false);
        }
    }

     async function getAdminTeamTasks(){
        try{
            const res = await fetch("http://localhost:8100/admin/pending",{
                credentials:"include"
            })
            if(res.ok){
                const response = await res.json();
                set_admin_team(response)
            }
            else{

            }
        }
        catch(err){
            console.log(err)
        }
    }



    async function getusers(){
        console.log("calledusers")
        const res = await fetch("http://localhost:8100/usersList",{
            headers: {
                "Content-Type": "application/json"
            },
            method: "GET",
            credentials: "include",
        });
        if(res.ok){
            console.log("returned, user");
            const usersres = await res.json();
            setusers(usersres);
            seterror("");
            setlogin(true);
        }
        else{
            const err = await res.json();
            seterror(err.err);
            setusers([])
            console.log("error");
            setlogin(false);
        }
    }


    async function gettasks(){
        console.log('calledtasks');
        const res = await fetch("http://localhost:8100/tasksList",{
            credentials: "include",
        });
        try{
        if(res.ok){
            console.log("returned, tasks");
            const taskres = await res.json();
            settasks(taskres);
        }
        else{
            console.log("error");
            const err = await res.json();
            settasks([])
            seterror(err.err);
        }}
        catch(err){
            settasks([])
            console.error(err)
        }
    }

    async function getroles(){
        const res = await fetch("http://localhost:8100/getroles",{
            credentials: "include",
        });
        if(res.ok){
            const rolesres = await res.json();
            setroles(rolesres);
        }
        else{
            const err = await res.json();
            seterror(err.err);
        }
    }

    async function getteams(){
        const res = await fetch("http://localhost:8100/getteams",{
            credentials:"include"
        })
        if(res.ok){
            const teamsres = await res.json();
            console.log("returned, teams", teamsres);
            setteams(teamsres);
        }
        else{
            const err = await res.json();
            seterror(err.err);
        }
    }

    async function getTaskteams(){
        try{
        const res = await fetch("http://localhost:8100/tasksListteam",{
            credentials: "include"
        })
        if(res.ok){
            const ntasks = await res.json()

            console.log('returned_from_here', ntasks)
            set_team_task(ntasks)
        }
        else{
            set_team_task([])
        }}
        catch(err){
            console.error(err)
        }
    }

    async function getcurr_user(){
        try{
            const res = await fetch("http://localhost:8100/Profile",{
                credentials: "include"
            })
            if(res.ok){
                const user = await res.json()
                console.log(user, 'Profile')
                set_user(user);
                setrole(user.role)
            }
        } catch(err){
            console.error(err);
        }
    }

    useEffect(()=>{
        getroles()
        getcurr_user()
    },[loggedin])

    async function getreview(){
        try{
            const res = await fetch("http://localhost:8100/review", {
                credentials: "include"
            })
            if(res.ok){
                const temp = await res.json()
                set_review(temp)
            }
            else{
                set_review([])
            }
        }
        catch(err){
            set_review([])
        }
    }


    async function getTeam(){
        try{
            const res = await fetch("http://localhost:8100/Team",{
                credentials: "include"
            })
            if(res.ok){
                const team = await res.json()
                setteam(team);
            }
            else{
                throw new Error("error")
            }
        } catch(err){
            console.error(err);
        }
    }

    async function getTaskAdmin(){
        try{
        const res = await fetch("http://localhost:8100/tasksListAdmin",{
            credentials: "include"
        })
        if(res.ok){
            const ntasks = await res.json()
            console.log('returned_from_here', ntasks)
            set_tasks_admin(ntasks)
        }
        else{
            set_tasks_admin([])
        }}
        catch(err){
            console.error(err)
        }

    }



    useEffect(() => {
        if(loggedin){
        connectSocket();
        sockref.current?.on("connect", () => {
            console.log("Socket connected successfully");
            setconnected(true);
        }
        );

        sockref.current?.on("taskupdate", (data) => {
        settasks((task1)=>{
            const temp = task1.filter((task) => task.id !== data.id);
            console.log("Task updated:", data);
            return [...temp, data]});
        })

        sockref.current?.on("taskdelete", (data) => {

        settasks((task1)=>task1.filter((task) => !data.includes(task.id)));

        }
        );
        sockref.current?.on("taskdeleteall",(data)=>{
            settasks([])
            set_team_task([])
        })

        sockref.current?.on("Admintaskupdate", (data) => {
        set_tasks_admin((task1)=>{
            const temp = task1.filter((task) => task.id !== data.id);
            console.log("Task updated:", data);
            return [...temp, data]});
        })

        sockref.current?.on("Admintaskdelete", (data) => {
            console.log(data,"delete_admin_task")
        set_tasks_admin((task1)=>task1.filter((task) => !data.includes(task.id)));
        }
        );


        sockref.current?.on("teamtaskupdate", (data) => {
        set_team_task((task1)=>{
            const temp = task1.filter((task) => task.id !== data.id);
            console.log("Task updated:", data);
            return [...temp, data]});
        })


        sockref.current?.on("teamtaskdelete", (data) => {
        set_team_task((task1)=>task1.filter((task) => task.id !== data.id));
        }
        );}

        sockref.current?.on("userupdate", (data) => {
            console.log("User updated:", data);
        setusers((users1)=>{
            const temp = users1.filter((user) => user.id !== data.id);
            return [...temp, data]}
        );
        }
        );
        sockref.current?.on("userdelete", (data) => {
            console.log("User deleted:", data);
        setusers((users1)=>users1.filter((user) => user.id !== data.id));
        }
        );
        sockref.current?.on("teamsupdate",(data)=>{
            console.log("update_teams",data)
            setteam((old)=>{
                console.log("teamupdate",old,data)
                let temp = old.filter((o1)=>o1.team_name !== data.team_name)
                temp = [...temp, data]
                return temp;
            })
        })

        sockref.current?.on("teamsdelete",(data)=>{
            console.log("delete_teams",data)
            setteam((old)=>{
                return old.filter((o1)=>!data.includes(o1.team_name))
            })
        })
        sockref.current?.on("disconnect", () => {
            console.log("Socket disconnected");
            setconnected(false);
            setlogin(false);
        }
        );
        sockref.current?.on("updateAdminteamtask", (data) => {
            console.log("Admin team task updated:", data);
            set_admin_team((task1)=>{
                const temp = task1.filter((task) => !data.ids.includes(task.id));
                return [...temp, ...data.rows]});
        }
        );
        sockref.current?.on("deleteAdminteamtask", (data) => {
            console.log("Admin team task deleted:", data);
            set_admin_team((task1)=>task1.filter((task) => !data.includes(task.id)));
        }
        );
        sockref.current?.on("teamchange",(data)=>{
            console.log("hit")
            getTeam();
            getteams();
            getcurr_user();
        })
        return () => {
            if (sockref.current) {
                sockref.current.disconnect();
                console.log("Socket disconnected");
            }
        };
    }, [loggedin]);

    useEffect(()=>{
        getteams()
    },[team])
    useEffect(()=>{
        getTaskAdmin();
        getTaskteams();
        gettasks();
        getteams();
        getTeam();
        getreview();
        getusers();
        getAdminTeamTasks();
    },[loggedin])

    const context = {
        users,
        setusers,
        tasks,
        error,
        seterror,
        roles,
        teams,
        team_task,
        role,
        setrole,
        tasks_admin,
        loggedin,
        setuser_context: set_user,
        current_user,
        team,
        getcurr_user,
        review_tasks,
        getroles,
        setlogin,
        Admin_team_task
    }

    useEffect(() => {
  localStorage.setItem('role', JSON.stringify(role));
}, [role]);

    return (
        <userContext.Provider value={context}>
            {children}
        </userContext.Provider>
    )
}