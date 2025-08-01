import { useEffect, useState } from "react";
import { useUsercontext } from "../context/usercontext";
import { useNavigate } from "react-router-dom";
function User(){
    const nav = useNavigate()
    const {current_user,loggedin,getcurr_user} = useUsercontext();
    const [edit, setedit] = useState(false)
    const [username, setusername] = useState(current_user?.username || "")
    const [email,setemail] = useState(current_user?.email || "")
    const [password, setpassword] = useState("")


    useEffect(()=>{
        setusername(current_user?.username || "")
        setemail(current_user?.email || "")
    },[current_user])
    async function submit_handler(e) {
        e.preventDefault();
        try{
        const resp = await fetch("http://localhost:8100/update", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({username, email, password})
        })

        if(resp.ok){
            await getcurr_user()
            setedit(false)
        }
        else{

        }
    }
        catch(err){

        }
    }
    console.log(current_user, loggedin, "this is user");
    return (<>
    {(loggedin && current_user) && (
        <div className="flex flex-row py-8 w-full overflow-y-auto justify-center bg-gray-100 items-center">
            <form
                className="rounded-md mt-20 shadow-md bg-white w-full max-w-2xl flex flex-col p-8 text-black"
                onSubmit={(e) => {
                    e.preventDefault();
                    if (edit) submit_handler(e);
                }}
            >
                <div className="flex flex-row justify-end items-center w-full">
                    <button
                        type="button"
                        className="h-[25px] w-[25px] rounded-full p-1 flex justify-center items-center hover:bg-gray-400"
                        onClick={() => {
                            edit ? setedit(false) : nav(-1);
                        }}
                    >
                        X
                    </button>
                </div>

                <div className="flex flex-row justify-start items-center w-full mb-4">
                    <img
                        className="rounded-full w-16 h-16 p-2 bg-gray-400 mr-8"
                        src=""
                        alt="temporary"
                    />
                    <p className="font-bold text-gray-800 text-lg">{current_user.username}</p>
                </div>

                <div className="w-full h-px bg-gray-300 my-2"></div>

                <div className="flex flex-col space-y-4 mt-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600">Name</label>
                        {edit ? (
                            <input
                                type="text"
                                className="p-2 bg-white rounded-md border w-full"
                                placeholder="name"
                                value={username}
                                onChange={(e) => setusername(e.target.value)}
                            />
                        ) : (
                            <p className="text-gray-800">{current_user.username}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Email</label>
                        {edit ? (
                            <input
                                type="text"
                                className="p-2 bg-white rounded-md border w-full"
                                placeholder="email"
                                value={email}
                                onChange={(e) => setemail(e.target.value)}
                            />
                        ) : (
                            <p className="text-gray-800">{current_user.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Password</label>
                        {edit ? (
                            <input
                                type="text"
                                className="p-2 bg-white rounded-md border w-full"
                                placeholder="password"
                                value={password}
                                onChange={(e) => setpassword(e.target.value)}
                            />
                        ) : (
                            <p className="text-gray-800">••••••••</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Team</label>
                        <p className="text-gray-800">{current_user?.team_name || "-"}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600">Position</label>
                        <p className="text-gray-800">{current_user?.position || "-"}</p>
                    </div>
                </div>

                <div className="flex flex-row justify-center mt-6">
                    {edit ? (
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                        >
                            Submit
                        </button>
                    ) : (
                        <button
                            onClick={() => setedit(true)}
                            type="button"
                            className="rounded-md bg-blue-300 py-1 px-3 hover:bg-blue-500 text-white"
                        >
                            Edit
                        </button>
                    )}
                </div>
            </form>
        </div>
    )}
</>)

}

export default User;