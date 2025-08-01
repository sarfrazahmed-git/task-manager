import { useState } from "react";
import { useUsercontext } from "../context/usercontext";
import { User } from "lucide-react";
import Drawer from "./drawer";
import Addteams from "./Addteams";

function Teams() {
    const [add, setadd] = useState(false);
    function close() {
        setadd(false);
    }

    const { team, loggedin } = useUsercontext();

    return (
        <div className="w-full h-full">
            {loggedin && (
                <div className="w-full h-full">
                    <Drawer isOpen={add} close={close} Children={Addteams} props={{ close }} />

                    <div className="flex flex-col w-full h-full bg-gray-200 p-1 overflow-y-auto">
                        <div className="w-full flex flex-row justify-end items-center mb-2">
                            <button
                                type="button"
                                onClick={() => setadd(true)}
                                className="rounded-md text-white flex justify-center items-center p-2 hover:bg-black/50 bg-gray-700"
                            >
                                Add team
                            </button>
                        </div>

                        <div className="flex flex-row flex-wrap gap-4 p-2">
                            {team.map((t, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col bg-white shadow-md rounded-md p-4 min-w-[200px] max-w-xs w-full"
                                >
                                    <p className="text-gray-900 font-semibold text-lg mb-2">{t.team_name}</p>
                                    <div className="h-px w-full bg-gray-300 mb-2"></div>

                                    {t.members.map((t1, index1) => (
                                        <div key={index1} className="flex flex-row items-center mb-1">
                                            <User className="text-gray-700 mr-2" size={18} />
                                            <p className="text-gray-800 text-sm">
                                                {t1.username}
                                                {t1.role === 2 && " (team lead)"}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Teams;
