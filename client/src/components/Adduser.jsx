import { useEffect, useState } from "react";
import { useUsercontext } from "../context/usercontext";
function Adduser({ close }) {
    const [username, setuser] = useState("")
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const { getroles, roles } = useUsercontext();
    const [role, setrole] = useState("")
    const [show, setshow] = useState(true)
    console.log(roles)
    useEffect(() => {
        setshow(true)
        getroles()
    }, [])
    const [error, seterror] = useState("")
    async function clickHandler(e) {
        setshow(false)
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8100/addUser", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                credentials: "include",
                body: JSON.stringify({ username, email, password, role })
            })
            setshow(true)
            if (!res.ok) {
                const body = await res.json()
                console.log(body);
                seterror(body.err);
                //close()
            }
            else {
                //seterror("problem");
                close()
            }

        }
        catch (err) {
            //close()
            setshow(true)
            console.log("here");
            console.error(err)
            seterror(err);
        }
    }

    return (
        <div className="bg-gray-50 px-6 flex flex-col justify-center items-center h-full">
            <form
                className="w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-xl px-6 py-8 space-y-5"
                onSubmit={clickHandler}
            >
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700">Username</label>
                    <input
                        type="text"
                        placeholder="Enter username"
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) => setuser(e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        placeholder="Enter email"
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) => setemail(e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        placeholder="Enter password"
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) => setpassword(e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700">Role</label>
                    <select
                        value={role}
                        onChange={(e) => setrole(e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Select role</option>
                        {roles.map((rol, index) => (
                            <option key={index} value={rol.id}>
                                {rol.role_name}
                            </option>
                        ))}
                    </select>
                </div>

                {show ? (
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Submit
                    </button>
                ) : (
                    <p className="text-sm text-gray-500">Submitting...</p>
                )}
            </form>


            {error !== "" && (<div className="bg-red-300/50 rounded-md px-4 py-2 border border-1 border-red-400 mt-4 text-red-500">
                <p>{error}</p>
            </div>)}
        </div>
    )
}

export default Adduser;