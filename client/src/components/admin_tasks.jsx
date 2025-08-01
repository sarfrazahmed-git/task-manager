import { Children, useState } from "react";
import { useUsercontext } from "../context/usercontext";
import { MoreVertical } from "lucide-react";
import {Transition, Menu} from "@headlessui/react"
import { Fragment } from "react";
import Addtaskteams from "./Addtaskteam";
import Expaned_task from "./Expanded_task";
import Drawer from "./drawer";
function AdminTasklist(){
    const {tasks_admin} = useUsercontext()
    const [error,seterror] = useState("");
    const [add,setadd] = useState(false);
    const [open,setopen] = useState({})
    function opening(index, val){
        setopen((old)=>{
            const temp = {...old, [index]:val}
            return temp
        })
    }
    async function deleteTask(id){
        try{
        const res = await fetch(`http://localhost:8100/deleteTaskadmin/${id}`,{
            credentials: "include"
        })
        if(res.ok){
            console.log("deleted");
            seterror("");
        }
        else{
            const err = await res.json();
            seterror(err.err);
        }}
        catch(err){
            console.error(err);
            seterror("An error occurred while deleting the task.");
        }
    }
    console.log("checker",tasks_admin)

    return(
        <div className="h-full w-full">
        <Drawer isOpen={add} close={()=>{setadd(false)}} Children={Addtaskteams} props={{close: ()=>{setadd(false)}}}/>
        <div className="w-full flex flex-col text-white p-5 overflow-y-auto h-full justify-start overflow-x-hidden bg-gray-200">
            <div className="flex justify-end  flex-row items-center">
                <button onClick={()=>{setadd(true)}} className="flex justify-center items-center rounded-md hover:bg-black/50 p-2">Add task</button>
            </div>
            <table className=" rounded-md w-full bg-white shadow-md rounded-md overflow-x-auto divide-y overflow-y-auto divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tasks</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned by</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned to</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">created at</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">deadline</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
            {
                tasks_admin.map((task,index)=>{
                    return(
                            <tr className="hover:bg-gray-50 transition-colors" key = {index}>
                                <Drawer isOpen={open[index]||false} Children={Expaned_task} props={{taskid: task.id}} close={()=>{opening(index,false)}}/>
                                <td  className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.task}</td>
                                <td  className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.assigned_by_main_username}</td>
                                <td  className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.assigned_team_name}</td>
                                <td  className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{(new Date(task.created_at)).toLocaleString("en-US")}</td>
                                <td  className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{(new Date(task.deadline)).toLocaleString("en-US")}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                     <Menu as="div" className="relative ml-3">
                                    
                                                                                                <div>
                                                                                                    <Menu.Button className="flex items-center text-sm rounded-full p-1 hover:bg-gray-200">
                                                                                                        <MoreVertical className="h-6 w-6 text-gray-600 hover:text-gray-800" />
                                                                                                    </Menu.Button>
                                                                                                </div>
                                                                                                    <Transition
                                                                                                        as={Fragment}
                                                                                                        enter='transition ease-out duration-100'
                                                                                                        enterFrom="transform opacity-0 scale-95"
                                                                                                        enterTo="transform opacity-100 scale-100"
                                                                                                        leave="transition ease-in duration-75"
                                                                                                        leaveFrom="transfrom opacity-100 scale-100"
                                                                                                        leaveTo="tranform opacity-0 scale-95"
                                                                                                    >
                                                                                                    <Menu.Items className = "origin-top-right absolute right-0 mt-2 w-48 shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                                                                                    <Menu.Item>
                                                                                                            {({active})=>(
                                                                                                                <button onClick={()=>{
                                                                                                                    deleteTask(task.id)
                                                                                                                }}
                                                                                                                className = {`${active?'bg-gray-100':''} group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
                                                                                                                >Delete</button>
                                                                                                            )}
                                                                                                    </Menu.Item>
                                                                                                    <Menu.Item>
                                                                                                        {({active})=>(
                                                                                                            <button onClick={()=>{{opening(index,true)}}} className = {`${active?'bg-gray-100':''} group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
                                                                                                            >See details</button>
                )}
                                                                                                    </Menu.Item>
                                
                                                                                                    </Menu.Items>
                                                                                                </Transition>
                                                                                            </Menu>
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
        </div>
    )

}
export default AdminTasklist;