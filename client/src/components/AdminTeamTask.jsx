import { useState } from "react";
import { useUsercontext } from "../context/usercontext";

function AdminTeamTasklist(){
    const {Admin_team_task,teams} = useUsercontext()
    const [error,seterror] = useState("");
    const [assignes, set_assignes] = useState({})
    async function handler(index,id){
        const res = await fetch("http://localhost:8100/updatetask",{
            method: "POST",
            headers: {
                    "Content-Type": "application/json"
                },
            credentials: "include",
            body: JSON.stringify({assigned_to: assignes[index], taskid: id})
        })

        if(res.ok){
            
        }
        else{

        }
    }
    console.log(Admin_team_task, "in list")

    return(
        <div className="flex flex-col w-full h-full bg-gray-200 p-1 flex-1">
            <table className=" rounded-md w-full bg-white shadow-md rounded-md overflow-x-auto divide-y overflow-y-auto divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope = "col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
                        <th scope = "col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned by</th>
                        <th scope = "col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">created at</th>
                        <th scope = "col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">deadline</th>
                        <th scope = "col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
            {
                Admin_team_task.map((task,index1)=>{
                    console.log(task, "task in list")
                    return(
                            <tr className="hover:bg-gray-50 transition-colors" key = {index1}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.task}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.assigned_by_main_username}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{(new Date(task.created_at)).toLocaleString("en-US")}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{(new Date(task.deadline)).toLocaleString("en-US")}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                { (task.assigned_team === null) && (<form onSubmit={(e)=>{
                                        e.preventDefault();
                                        handler(index1, task.id);
                                    }}>
                                        <select className="text-black bg-white rounded-md" required onChange={(e)=>{
                                            set_assignes((old)=>{
                                                const temp = {...old, [index1]:e.target.value}
                                                return temp
                                            })
                                        }}>
                                            <option value = ""></option>
                                            {
                                                teams.map((team,index)=>{
                                                    return (<option key = {index} value = {team.id}>{team.team_name}</option>)
                                                })
                                            }
                                        </select>
                                        <button type="submit" className="text-gray-600 rounded-md p-2 flex justify-center items-center bg-gray-100 hover:bg-gray-200 hover-text-gray-800 ">Assign</button>
                                    </form>)
                }
                                </td>
                            </tr>
                    )
                })
            }
            </tbody>
            </table>
            {error !== "" && (
                <div className="bg-red-500 rounded-md p-5 border">
                    <p>{error}</p>
                </div>
            )}
        </div>
    )

}
export default AdminTeamTasklist;