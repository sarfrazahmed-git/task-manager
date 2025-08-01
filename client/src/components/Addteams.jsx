import { useState } from "react";
import { useUsercontext } from "../context/usercontext";
function Createteams({ close }) {
    const [selected, set_selected] = useState([])
    const [teamName, setteam] = useState("")
    const [lead, setlead] = useState("")
    const { users } = useUsercontext();
    const [error, seterror] = useState("");
    const [loading, setloading] = useState(false);

    async function handlesubmite(e) {
        setloading(true);
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8100/addteam", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    teamName,
                    lead,
                    members: selected
                }),
                credentials: "include"
            });

            setloading(false);
            if (response.ok) {
                seterror("");
                close()
            }
            else {
                //close()
                console.error("this_culprit")
                const err = await response.json();
                seterror(err.err);
            }

        }
        catch (err) {
            //close()
            setloading(false);
            console.error(err);
            seterror(err.message);
        }

    }

    function addselected() {
        set_selected((old) => {
            return [...old, 0]
        })
    }
    function changeselected(index, val) {
        set_selected((old) => {
            console.log("here", typeof (val), val)
            const newarr = [...old];
            newarr[index] = Number(val);
            return newarr;
        })
    }

    return (
        <div className="bg-gray-50 h-full flex flex-col justify-center items-center p-5">
            <form
                onSubmit={handlesubmite}
                className="w-full max-w-md p-6 space-y-4 bg-white shadow-md border border-gray-100 rounded-lg"
            >
                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Team Name</label>
                    <input
                        required
                        className="bg-blue-50 border border-blue-300 rounded-md px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={teamName}
                        onChange={(e) => setteam(e.target.value)}
                        placeholder="Enter team name"
                    />
                </div>

                <div className="flex flex-col">
                    <label className="text-sm font-medium text-gray-700 mb-1">Team Lead</label>
                    <select
                        className="bg-blue-50 border border-blue-300 rounded-md px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={lead}
                        onChange={(e) => setlead(e.target.value)}
                    >
                        <option value="">Select Lead</option>
                        {users.map((user, index) =>
                            user.role === 2 ? (
                                <option key={index} value={user.id}>
                                    {user.username}
                                </option>
                            ) : null
                        )}
                    </select>
                </div>

                <div className="flex flex-col space-y-2">
                    <label className="text-sm font-medium text-gray-700">Team Members</label>
                    {selected.map((sel, index1) => (
                        <select
                            key={index1}
                            className="bg-blue-50 border border-blue-300 rounded-md px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            value={sel}
                            onChange={(e) => changeselected(index1, e.target.value)}
                        >
                            <option value="">Select Member</option>
                            {users.map((user, index) => {
                                if (
                                    (user.role === 3 &&
                                        (!selected.includes(user.id) || selected[index1] === user.id))
                                ) {
                                    return (
                                        <option key={index} value={user.id}>
                                            {user.username}
                                        </option>
                                    );
                                } else {
                                    return null;
                                }
                            })}
                        </select>
                    ))}
                </div>

                <button
                    type="button"
                    onClick={addselected}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-sm font-medium text-gray-700 py-2 px-4 rounded-md transition"
                >
                    Add Member
                </button>

                {loading ? (
                    <p className="text-center text-sm text-gray-500">Loading...</p>
                ) : (
                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
                    >
                        Submit
                    </button>
                )}
            </form>

            {(error) &&
                (<p className="bg-red-300/50 border border-1 border-red-300 px-2 py-1 m-3 rounded-md">
                    {error}
                </p>)}
        </div>
    )
}

export default Createteams;