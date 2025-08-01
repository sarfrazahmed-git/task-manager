import { useEffect, useState } from "react"
import {useUsercontext} from "../context/usercontext"

function Updateuser({id,close}){
    const [user, setuser] = useState({})
    const {roles}   = useUsercontext()
    const [error,seterror] = useState(null)
    async function getuser(){
        try{
            const resp = await fetch(`http://localhost:8100/userinfo/${id}`,{
                credentials: "include"
            })
            if(resp.ok){
                const thisuser = await resp.json()
                setuser(thisuser)
                seterror(null)
            }
            else{
                const error = await resp.json()
                console.error("Error fetching user:", error.err)
                seterror(error.err)

            }
        }
        catch(err){
            seterror(err)
            console.error(err)
        }
    }
    
    useEffect(()=>{
        getuser()
    },[id])

    async function updateuser(e){
        e.preventDefault()
        try{
            const resp = await fetch(`http://localhost:8100/updateuseradmin`,{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({id:user.id, username: user.username, email: user.email, password: user.password, role: user.role})
            })
            if(resp.ok){
                close()
            }
            else{
                const error = await resp.json()
                seterror(error.err)
                console.error("Error updating user:", error)
            }
        }
        catch(err){
            seterror(err)
            console.error("Error in updateuser function:", err)
        }
    }
    return(<div className="flex flex-col justify-center items-center bg-gray-50 h-full">
        <form onSubmit = {updateuser} className="rounded-md shadow-md border border-1 flex flex-col border-gray-100 bg-white justify-center items-center px-8 py-6">
            <div className="flex justify-between mt-2 items-center w-full">
                <label className = "mr-2" htmlFor="name">Username: </label>
                <input id = "name" onChange={(e)=>{setuser({...user, username: e.target.value})}} className = "bg-blue-300/50 border border-2 focus:outline-none focus:ring-blue-500 px-2 py-1 border-blue-400 rounded-md" value={user.username || ""}/>
            </div>
            <div className="flex justify-between mt-2 items-center w-full">
                <label className="mr-2" htmlFor="email">Email:</label>
                <input  className = "bg-blue-300/50 border border-2 focus:outline-none focus:ring-blue-500 px-2 py-1 border-blue-400 rounded-md" id = "email" onChange={(e)=>{setuser({...user, email: e.target.value})}} value={user.email || ""}/>
            </div>
            <div className="flex justify-between mt-2 items-center w-full">
                <label className = "mr-2" htmlFor="password">Password:</label>
                <input  className = "bg-blue-300/50 border border-2 focus:outline-none focus:ring-blue-500 px-2 py-1 border-blue-400 rounded-md" id = "password" type="password" onChange={(e)=>{setuser({...user, password: e.target.value})}} value={user.password || ""}/>
            </div>
            <div className="flex justify-between mt-2 items-center w-full">
                <label className = "mr-2" htmlFor="role">Role:</label>
                <select onChange={(e)=>{setuser({...user, role: e.target.value})}} className = "bg-blue-300/50 border border-2 focus:outline-none focus:ring-blue-500 px-2 py-1 border-blue-400 rounded-md" id = "role" value={user.role || ""}>
                <option value="">Select a role</option>
                {roles.map((role,index) => (
                    <option key={index} value={role.id}>{role.role_name}</option>
                ))}
                </select>   
            </div>
            <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Update User</button>
        </form>
        {error && <div className="mt-4 text-red-500 bg-red-300/50 border border-2 px-3 py-1 rounded-md border-red-400">{error}</div>}
    </div>)
}
export default Updateuser