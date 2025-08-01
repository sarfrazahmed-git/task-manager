import { useEffect, useState } from "react";
import { useUsercontext } from "../context/usercontext";

function Addtaskteams({close}) {
    const { teams, users } = useUsercontext();
    const [task, settask] = useState();
    const [deadline, setdead] = useState();
    const [assigned, set_assigned] = useState();
    const [assignedby, set_by] = useState();
    const [error, seterror] = useState("");
    const [show, setshow] = useState(true);

    console.log("teams_check_final", teams);
    async function Adder(e) {
        setshow(false)
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8100/addtaskteam", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ task, deadline, assigned})
            })
            if (res.ok) {
                console.log("setting true")
                setshow(true)
                seterror("")
                close()
            }
            else {
                //close()
                console.log("settign true")
                setshow(true)
                const err = await res.json()
                seterror(err.err);
                console.log("error");
            }
        }
        catch (err) {
            //close()
            console.log("setting true");
            setshow(true)
            seterror(err)
        }

    }

    return (
        <div className="h-full flex flex-col justify-center items-center bg-gray-50 px-6">
             <form
      onSubmit={Adder}
      className="w-full max-w-md bg-white border border-gray-200 shadow-lg rounded-xl px-6 py-8 space-y-5"
    >
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Task</label>
        <input
          required
          type="text"
          placeholder="Enter task"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => settask(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Deadline</label>
        <input
          required
          type="date"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setdead(e.target.value)}
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">Assign To</label>
        <select
          required
          value={assigned}
          onChange={(e) => set_assigned(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Team</option>
          {teams.map((user, index) => (
            <option key={index} value={user.id}>
              {user.team_name}
            </option>
          ))}
        </select>
      </div>

      {show ? (
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Submit
        </button>
      ) : (
        <p className="text-sm text-gray-500 text-center">Submitting...</p>
      )}
    </form>
            {error !== "" && (<div className="bg-red-500 rounded-md p-5 border">
                <p>{error}</p>
            </div>)}
        </div>
    )
}

export default Addtaskteams;