import Addtask from "../components/Addtask"
import Addtaskteams from "../components/Addtaskteam"
import Tasklist from "../components/Takslist"
import AdminTasklist from "../components/admin_tasks"
import { useUsercontext } from "../context/usercontext"
function Taskpage(){
    const {role, loggedin} = useUsercontext();
    console.log("roles: ", role)
return( 
    <>
    { loggedin && (<div className='h-full w-full'>
    {(role === 1) ? (<AdminTasklist/>): (<Tasklist/>)}
</div>)}
</>)
}
export default Taskpage