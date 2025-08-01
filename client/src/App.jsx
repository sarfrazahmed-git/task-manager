import './App.css'
import { useUsercontext } from "./context/usercontext"
import Login from "./components/login"
import Mainpage from './page/mainpage'
import Userpage from "./page/Userspage"
import Taskpage from './page/Taskpage'
import MyUser from './components/Myuser'
import Teampage from './page/Teampage'
import { BrowserRouter as Router, Route, Routes, useLocation} from "react-router-dom"
import SideBar from "./components/Sidebar";
import Topbar from './components/topbar'
import TeamTasklist from './components/teamTask'
import Teams from './components/Teams'
import Review from './components/Review'
import AdminTeamTasklist from './components/AdminTeamTask'
import { User, CheckSquare, Users, Group, ListChecks } from 'lucide-react';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
function App() {
  const nav = useNavigate()
  const loc = useLocation()
  const {loggedin,role} = useUsercontext();
   useEffect(()=>{
    if(!loggedin){
      nav("/login")
    }
  },[loggedin])
  console.log("checking role", role)
  let nav_options;
  if(role === 1){
     nav_options = [
        {name: "users", path: "/users", icon: Users},
        {name: "tasks", path: "/tasks", icon: CheckSquare},
        {name: "Unassigned_tasks", path: "/Admin/unassigned",icon: ListChecks},
        {name: "teams", path: "/teams", icon: Group}
    ]
  }
  else if(role === 2){
    nav_options = [
        {name: "users", path: "/users", icon: Users},
        {name: "tasks", path: "/tasks", icon: CheckSquare},
        {name: "Team tasks", path: "/teamtasks", icon: CheckSquare},
        //{name: "review tasks", path: '/review',icon: ListChecks},
        {name: "My team", path: "/myteam", icon: Group}
      ]
  }
  else{
    nav_options = [
        {name: "users", path: "/users", icon: Users},
        {name: "tasks", path: "/tasks", icon: CheckSquare},
        {name: "My team", path: "myteam", icon: Group}
      ]
  }
  return (
        <div className='flex flex-col h-full w-full'>
          {loggedin && (<Topbar/>)}
        <div className='flex flex-row w-full h-full'>
        {loggedin && (<SideBar options={nav_options}/>)}
        {(!loggedin && loc.pathname !== "/login") && (<div className='h-full w-full flex flex-col justify-center items-center'>
          <div className='w-[300px] h-[150px] bg-red-300/70 border-red-300 text-red-600 rounded-md border-2 flex justify-center items-center'>
          SESSION EXPIRED, LOGIN AGAIN
          </div>
        </div> )}
        <Routes>
          <Route path = "/Admin/unassigned" element = {<AdminTeamTasklist/>}/>
          <Route path = "/review" element = {<Review/>}/> 
          <Route path = "/teams" element = {<Teams/>}/>
          <Route path = "/teamtasks" element = {<TeamTasklist/>}/>
          <Route path = "/myteam" element = {<Teampage/>}/>
          <Route path = '/profile' element = {<MyUser/>}/>
          <Route path='/tasks' element = {<Taskpage/>}/>
          <Route path = "/users" element = {<Userpage/>}/>
          <Route path="/" element={<div className='flex flex-col justify-center items-center'>Welcome to Task Manager</div>} />
          <Route path = "/mainpage" element={<Mainpage />} />
      </Routes>
      </div>
      </div>
  )
}

export default App
