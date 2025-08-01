import { useEffect, useState } from "react";
import { useUsercontext } from "../context/usercontext";
import { useNavigate } from "react-router-dom";
import { use } from "react";
function Addtask({ close }) {
    const nav = useNavigate()
    const { users, team } = useUsercontext();
    const [task, settask] = useState();
    const [deadline, setdead] = useState();
    const [assigned, set_assigned] = useState();
    const [assignedby, set_by] = useState();
    const [error, seterror] = useState("");
    const [show, setshow] = useState(true);

    useEffect(() => {
        console.log("users", users);
        set_assigned(users[1]?.username);
        set_by(users[1]?.username);
        setshow(true);
    }, [])

    async function Adder(e) {
        setshow(false)
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8100/addtask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ task, deadline, assigned, assignedby })
            })
            if (res.ok) {
                console.log("setting true")
                setshow(true)
                close()
                seterror("")
            }
            else {
                close()
                console.log("settign true")
                setshow(true)
                const err = await res.json()
                seterror(err.err);
                console.log("error");
            }
        }
        catch (err) {
            close()
            console.log("setting true");
            setshow(true)
            seterror(err)
        }

    }

    return (
        <div className="px-5 flex flex-col h-full bg-gray-50 items-center justify-center">
            <form
                className="w-full max-w-md bg-white border border-gray-200 shadow-xl rounded-xl px-6 py-8 space-y-5"
                onSubmit={Adder}
            >
                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700">Task</label>
                    <input
                        required
                        type="text"
                        placeholder="Enter task name"
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) => settask(e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700">Deadline</label>
                    <input
                        required
                        type="date"
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        onChange={(e) => setdead(e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium text-gray-700">Assign to</label>
                    <select
                        required
                        value={assigned}
                        onChange={(e) => set_assigned(e.target.value)}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        <option value="">Select user</option>
                        {team.map((user, index) => (
                            <option key={index} value={user.id}>{user.user}</option>
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

            {error !== "" && (<div className="bg-red-500 rounded-md p-5 border">
                <p>{error}</p>
            </div>)}
        </div>
    )
}

export default Addtask;