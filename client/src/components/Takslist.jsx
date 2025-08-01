import { Children, useState } from "react";
import { useUsercontext } from "../context/usercontext";
import Addtask from "./Addtask";
import Drawer from "./drawer";
import { Fragment } from "react";
import {Transition, Menu} from "@headlessui/react"
import { MoreVertical } from "lucide-react";
import Addprogress from "./Addprogress";
import Task from "./Expanded_task";
function Tasklist() {
    const { tasks,role,current_user} = useUsercontext()
    const [error, seterror] = useState("");
    const [add, setadd] = useState(false);
    const [showprog, setprog] = useState({});
    const [task1,settask] = useState({});
    const [progress, setprogess] = useState({})
    async function deleteTask(id) {
        try {
            const res = await fetch(`http://localhost:8100/deleteTask/${id}`, {
                credentials: "include"
            })
            if (res.ok) {
                console.log("deleted");
                seterror("");
            }
            else {
                const err = await res.json();
                console.error(err.err)
            }
        }
        catch (err) {
            console.error(err.message);
            seterror("An error occurred while deleting the task.");
        }
    }
    async function progress_handler(index,id,val){
        try{
            const resp = await fetch("http://localhost:8100/complete/task",{
                method: "POST",
                headers:{
                    'Content-Type': 'application/json'
                },
                credentials: "include",
                body: JSON.stringify({id: id, progress: progress[index]||val})
            })

            if(resp.ok){

            }
            else{

            }
        }
        catch(err){

        }

    }

    return (
        <div className="w-full h-full">
                <Drawer close={()=>setadd(false)} isOpen={add} props={{close: ()=>{setadd(false)}}} Children={Addtask} title="Add title"/>
                <div className=" flex flex-col w-full h-full bg-gray-200 p-1 flex-1">
                        {(role === 2 )&& (<div className="w-full flex flex-row justify-end itmes-center">
                            <button onClick={()=>{
                                setadd(true)
                            }} type="button" className=" rounded-md text-white flex justify-center itmes-center p-2 hover:bg-black/50">Add task</button>
                        </div>)}
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
                                    tasks.map((task, index) => {
                                        
                                        return (
                                            <tr className="hover:bg-gray-50 transition-colors" key={index}>
                                                <Drawer close={()=>{setprog((old)=>{
                                                const temp = {...old, [index]:false}
                                                return temp
                                            })}} isOpen={showprog[index]||false} props={{close: ()=>{setprog((old)=>{
                                                const temp = {...old, [index]:false}
                                                return temp
                                            })}, taskid: task.id}} Children={Addprogress}/>



                                            <Drawer close={()=>{settask((old)=>{
                                                const temp = {...old, [index]:false}
                                                return temp
                                            })}} isOpen={task1[index]||false} props={{taskid: task.id}} Children={Task}/>



                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.task}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.assigned_by_username}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.assigned_to_username}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{(new Date(task.created_at)).toLocaleString("en-US")}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{(new Date(task.deadline)).toLocaleString("en-US")}</td>
                                                {(<td className ="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
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
                                                                    {(role === 2) && (<Menu.Item>
                                                                        {({active})=>(
                                                                            <button onClick={()=>{
                                                                                deleteTask(task.id)
                                                                            }}
                                                                            className = {`${active?'bg-gray-100':''} group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
                                                                            >Delete</button>
                                                                        )}
                                                                    </Menu.Item>)}

                                                                    {(current_user.id === task.assigned_to || current_user.id === task.assigned_by) && (<Menu.Item>
                                                                        {({active})=>(
                                                                            <button onClick={()=>{
                                                                                setprog((old)=>{
                                                                                    const temp = {...old, [index]:true}
                                                                                    return temp
                                                                                })
                                                                                
                                                                            }}
                                                                            className = {`${active?'bg-gray-100':''} group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
                                                                            >Add Progress</button>
                                                                        )}
                                                                    </Menu.Item>)}

                                                                    <Menu.Item>
                                                                        {({active})=>(
                                                                            <button onClick={()=>{
                                                                                settask((old)=>{
                                                                                    const temp = {...old, [index]:true}
                                                                                    return temp
                                                                                })
                                                                                
                                                                            }}
                                                                            className = {`${active?'bg-gray-100':''} group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
                                                                            >See details</button>
                                                                        )}
                                                                    </Menu.Item>
                                                                </Menu.Items>
                                                            </Transition>
                                                        </Menu>

                                                </td>)}
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
        </div>
    )

}
export default Tasklist;