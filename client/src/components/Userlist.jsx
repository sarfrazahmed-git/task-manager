import { useState, useEffect } from "react";
import { useUsercontext } from "../context/usercontext";
import Adduser from "./Adduser";
import { MoreVertical } from "lucide-react"
import { Menu, Transition } from "@headlessui/react"
import { Fragment } from "react";
import Drawer from "./drawer";
import Updateuser from "./Updateuser";
function Userlist() {
    const { users, role } = useUsercontext();
    const [error, seterror] = useState("");
    const [update, setupdate] = useState(false);
    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [id, setid] = useState("");
    const [add, setadd] = useState(false);
    const [updates, setupdates] = useState({})
    //console.log(role, 'role_list')
    
    function setups(idx, val){
        setupdates((old)=>{
            const temp = {...old, [idx]:val}
            console.log("updatetemp",temp)
            return temp
        })
    }
    async function updateUser(id) {
        setupdate(false);
        try {
            const res = await fetch(`http://localhost:8100/updateUser/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ username, password, id })
            }
            );
            if (res.ok) {
                console.log("User updated");
                seterror("");
            }
            else {
                const err = await res.json();
                console.error(err);
                seterror(err.err);
            }
        }
        catch (err) {
            console.error(err);
            seterror("An error occurred while updating the user.");
        }
    }



    async function deleteUser(id) {
        try {
            const res = await fetch(`http://localhost:8100/deleteUser/${id}`, {
                credentials: "include"
            });
            if (res.ok) {
                console.log("deleted");
                seterror("");
            } else {
                const err = await res.json();
                console.error(err);
                seterror(err.err);
            }
        } catch (err) {
            console.error(err);
            seterror("An error occurred while deleting the user.");
        }
    }
    //console.log("setups::::", updates)
    useEffect(()=>{
        console.log("users", users)
    },[users])
    return (
        <div className="w-full h-full">
                    <Drawer close={()=>{setadd(false)}} isOpen={add} props={{close: ()=>{setadd(false)}}} Children={Adduser} />
                    <div className=" flex flex-col w-full h-full bg-gray-200 p-1 flex-1">
                        {(role === 1 || role === 4) && (<div className="w-full flex flex-row justify-end itmes-center">
                            <button onClick={() => { setadd(true) }} type="button" className="flex justify-center items-center p-2 hover:bg-black/50 rounded-md text-white">Add user</button>
                        </div>)}
                        {(update === false) && (<div className="h-full w-full bg-white shadow-md rounded-md overflow-x-auto">
                            <table className="w-full divide-y overflow-y-auto divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">username</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">email</th>
                                        {(role === 1 || role === 4) && (
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {
                                        users.map((user, index) => {
                                            return (
                                                <tr className="hover:bg-gray-50 transition-colors" key={index}>
                                                    <Drawer close={()=>{setups(index,false)}} isOpen={updates[index]||false} Children={Updateuser} props={{id: user.id, close: ()=>{setups(index,false)}} }/>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.username}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>

                                                    {(role === 1 || role === 4) && (<td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">

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
                                                                                deleteUser(user.id)
                                                                            }}
                                                                            className = {`${active?'bg-gray-100':''} group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
                                                                            >Delete</button>
                                                                        )}
                                                                    </Menu.Item>
                                                                    <Menu.Item>
                                                                    {({active})=>(
                                                                            <button onClick={()=>{
                                                                                    console.log("calling setups")
                                                                                    setups(index,true);
                                                                                
                                                                            }}
                                                                            className = {`${active?'bg-gray-100':''} group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900`}
                                                                            >Update this</button>
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
                            {error !== "" && (
                                <div className="bg-red-500 rounded-md p-5 border">
                                    <p>{error}</p>
                                </div>
                            )}
                        </div>)}


                        {update && (
                            <div className="p-4 border border-white m-10">
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    updateUser(id);
                                }}>
                                    <input type="text" placeholder="username" onChange={(e) => {
                                        setusername(e.target.value)
                                    }}></input>
                                    <input type="password" placeholder="password" onChange={(e) => {
                                        setpassword(e.target.value)
                                    }}></input>
                                    <button type="submit">Update</button>
                                </form>
                            </div>
                        )}
                    </div>
        </div>
    )

}

export default Userlist