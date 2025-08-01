import { useState } from "react"
import { useUsercontext } from "../context/usercontext"

function Addprogress({ taskid, close }) {
    const { role } = useUsercontext()
    const [progress, setprogess] = useState("")
    const [date, setdate] = useState(new Date())
    const [type, settype] = useState()
    async function handleSubmit() {
        try {
            const resp = await fetch("http://localhost:8100/progress", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ taskid, date, comments: progress, type }),
                credentials: "include"
            })
            if (resp.ok) {
                close();
            }
            else {
                close()

            }
        }
        catch (err) {
            console.log("why")
            console.error(err);
            close()
        }
    }

    return (
        <div className=" flex flex-col justify-center items-center bg-gray-50 h-full p-10">
            <form
                className="bg-white w-full max-w-md p-6 space-y-5 rounded-xl shadow-xl border border-gray-200"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit();
                }}
            >
                <div className="flex flex-col">
                    <label htmlFor="date" className="text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                        type="date"
                        id="date"
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        value={date}
                        required
                        onChange={(e) => setdate(e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="progress" className="text-sm font-medium text-gray-700 mb-1">Details</label>
                    <textarea
                        id="progress"
                        rows={5}
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 resize-none"
                        value={progress}
                        required
                        onChange={(e) => setprogess(e.target.value)}
                    />
                </div>

                <div className="flex flex-col">
                    <label htmlFor="type" className="text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                        id="type"
                        className="rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        onChange={(e) => settype(e.target.value)}
                    >
                        <option value="">Select type</option>
                        <option value={0}>Internal</option>
                        {role === 2 && <option value={1}>External</option>}
                    </select>
                </div>

                <div className="text-right">
                    <button
                        type="submit"
                        className="inline-block px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                        Submit
                    </button>
                </div>
            </form>

        </div>

    )
}

export default Addprogress