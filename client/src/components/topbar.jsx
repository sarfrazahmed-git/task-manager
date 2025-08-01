import { useUsercontext } from "../context/usercontext";
import { useNavigate } from "react-router-dom";
import {Menu, MenuHeading, Transition} from '@headlessui/react';
import {User, LogOut} from 'lucide-react'
import { Fragment } from "react";
function Topbar(){
    const nav = useNavigate();
    async function logout(){
        try{
            resp = await fetch("http://localhost:8100/logout",{
                method: "POST",
                credentials: "include",
            })
            if(resp.ok){

            }
            else{
                throw new Error("problem logging out")
            }
        } catch(err){
            console.error(err);
        }
    }
    return (
        <div className="bg-white shadow-sm w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px6 lg:px-8">
                <div className="flex items-center justify-end h-16 w-full">

                    <Menu as="div" className="relative ml-3">

                        <div>
                            <Menu.Button className="flex items-center text-sm rounded-full p-1 text-gray-600 hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-offset-2 focus:ring-indigo-500">
                                <span className="sr-only text-gray-600 hover:text-gray-800">Open menu</span>
                                <User className="h-6 w-6 text-gray-600 hover:text-gray-800"/>
                            </Menu.Button>
                        </div>
                        <Transition 
                        as = {Fragment}
                        enter='transition ease-out duration-100'
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave = "transition ease-in duration-75"
                        leaveFrom="transfrom opacity-100 scale-100"
                        leaveTo = "tranform opacity-0 scale-95"
                        >

                            <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                <Menu.Items>
                        
                                    <Menu.Item>
                                        {({active})=>(
                                            <button onClick = {()=>nav('/profile')}
                                            className={`${active?'bg-gray-100':''} group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900`}>Profile</button>
                                        )
                                    }
                                    </Menu.Item>

                                    <Menu.Item>
                                        {({active})=>(
                                            <button onClick = {()=>{logout()
                                                nav("/login")
                                            }}
                                            className={`${active?'bg-gray-100':''} group flex w-full items-center rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900`}>Logout</button>
                                        )
                                    }
                                    </Menu.Item>

                                </Menu.Items>
                            </Menu.Items>
                        </Transition>
                    </Menu>
            </div>
            </div>
        </div>
    )
}
export default Topbar