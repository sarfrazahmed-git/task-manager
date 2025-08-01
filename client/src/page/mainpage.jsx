import {useNavigate} from 'react-router-dom';
import Tasklist from '../components/Takslist';
import Addtask from '../components/Addtask';
import Userlist from '../components/Userlist';
import Adduser from '../components/Adduser';
import Createteams from '../components/Addteams';
import Addtaskteams from "../components/Addtaskteam"
import TeamTasklist from '../components/teamTask';
import { useUsercontext } from '../context/usercontext';
import AdminTasklist from '../components/admin_tasks';
import SideBar from '../components/Sidebar';
import { User, CheckSquare, Users, Group } from 'lucide-react';
function Mainpage() {
    const {role} = useUsercontext();
    const nav = useNavigate();
    return null
    return(
        <div className='flex flex-row'>
            <div>
                {role < 2 && (<Createteams/>)}
            </div>
            <div className='flex flex-col justify-center items-center'>
                  <div className='flex flex-col m-10'>
                  {(role === 1)? (<AdminTasklist/>) :(<Tasklist/>)}
                  {(role === 2) && (<Addtask/>)}
                  {role === 2 && (<TeamTasklist/>)}
                  {role < 2 && <Addtaskteams/>}
                  </div>
                  <div className='flex flex-col m-10'>
                  <Userlist/>
                  {(role === 1 || role === 4) && (<Adduser/>)}
                  </div>
                </div>
        </div>
    )
}

export default Mainpage;