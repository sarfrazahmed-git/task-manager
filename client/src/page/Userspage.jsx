import Userlist from "../components/Userlist"
import Adduser from "../components/Adduser";
import { useUsercontext } from "../context/usercontext"
function Userpage(){
    const {loggedin,role} = useUsercontext();
    console.log("role_list_page",role)
    return(
        <div className="h-full w-full">
        {loggedin && (<Userlist/>)}
        </div>
    )
}
export default Userpage;