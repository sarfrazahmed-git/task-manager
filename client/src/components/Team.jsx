import { useUsercontext } from "../context/usercontext";
import {User} from "lucide-react"
function Team(){
    const {team, current_user} = useUsercontext();
    console.log(team, current_user, "logg");

    return (<div className="flex flex-row justify-center items-center w-full h-full">
        {(team && current_user) && (
        <div className="flex flex-col rounded-md shadow-md min-w-[300px] text-white p-8 bg-black/70">
            <p><span>Team_Name:  </span> {current_user.team_name}</p>
            <div className="w-full h-px bg-gray-400"></div>

            {
                team.map((val,index)=>{
                    console.log("val_team", val)
                    if(val.userrole === 2){
                        return (<div className = " mt-4 flex flex-row" key = {index}>
                            <User className="mr-4"/>
                            <p> {val.user}  <span>(Team_lead)</span></p>
                        </div>)
                    }
                    else{
                        return (<div className=" mt-4 flex flex-row" key = {index}>
                            <User className="mr-4"/>
                            <p> {val.user}</p>
                        </div>)

                    }
                })
            }
        </div>)}
    </div>)

}

export default Team