import { useEffect, useState } from "react";

function Task({taskid}){

    const [task,settask] = useState()
    async function get_task(){
        try{
            const resp = await fetch(`http://localhost:8100/Task/${taskid}`, {
                credentials: "include"
            })
            if(resp.ok){
                const tsk = await resp.json()
                console.log(tsk,"tsk_logging")
                settask(tsk)
            }
            else{
                console.log("error_new_", resp.status)
                settask()
            }
        }
        catch(err){
            console.error(err)
            settask()
        }
    }  
    useEffect(()=>{
        get_task()
    },[])

    return (
        <div className="p-4 sm:p-6 space-y-6 bg-gray-50 min-h-full"> {/* Outer container for the drawer content */}
            {!task && (
                <div className="flex justify-center items-center h-32">
                    <h1 className="text-gray-500 text-lg">Loading task details or task not found...</h1>
                    {/* You can add a spinner here if you want a loading indicator */}
                </div>
            )}
            {task && (
                <div className="space-y-6"> {/* Container for task sections if task exists */}
                    {/* Main Task Info Card */}
                    <div className="bg-white shadow-lg rounded-lg p-5 border border-gray-200">
                        <h2 className="text-2xl font-semibold text-indigo-700 mb-4 break-words">
                            {task.task_name || task.task} {/* Task Name/Title */}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                            <div className="text-gray-700">
                                <span className="font-medium text-gray-800">Task Name:</span> {task.task_name || task.task}
                            </div>
                            <div className="text-gray-700">
                                <span className="font-medium text-gray-800">Created At:</span> {(new Date(task.created_at)).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                            </div>
                            <div className="text-gray-700">
                                <span className="font-medium text-gray-800">Assigned By:</span> {task.assigned_by_username || 'N/A'}
                            </div>
                            <div className="text-gray-700">
                                <span className="font-medium text-gray-800">Assigned To:</span> {task.assigned_to_username || task.assigned_team_name || 'N/A'}
                            </div>
                            {task.deadline && (
                                <div className="text-gray-700 md:col-span-2">
                                    <span className="font-medium text-gray-800">Deadline:</span> {(new Date(task.deadline)).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                                </div>
                            )}
                            {task.description && (
                                <div className="text-gray-700 md:col-span-2 mt-2 pt-2 border-t border-gray-200">
                                    <h3 className="font-medium text-gray-800 mb-1">Description:</h3>
                                    <p className="text-gray-600 whitespace-pre-wrap break-words">{task.description}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress History Section */}
                    {task.progress && task.progress.length > 0 && (
                        <div className="bg-white shadow-lg rounded-lg p-5 border border-gray-200">
                            <h3 className="text-xl font-semibold text-indigo-600 mb-4">Progress History</h3>
                            <div className="space-y-4 max-h-[30rem] overflow-y-auto pr-3"> {/* Scrollable container for progress items */}
                                {task.progress.map((prog, index) => (
                                    <div key={index} className={`p-3 ${prog.type === 0 ? 'bg-indigo-50' : prog.type === 1 ? 'bg-yellow-50' : 'bg-red-50'} rounded-md border border-indigo-200 shadow-sm`}>
                                        {prog.comments && prog.comments.trim() !== "" && (
                                            <div className="mb-1">
                                                <p className="text-sm text-gray-700 italic">"{prog.comments}"</p>
                                            </div>
                                        )}
                                        <div className="text-xs text-gray-500 flex justify-between items-center">
                                            <span>
                                                Updated by: <span className="font-medium text-gray-600">{prog.updated_by_username || 'System'}</span>
                                                {prog.progress_value !== undefined && prog.progress_value !== null && (
                                                    <span className="ml-2 text-indigo-700 font-semibold">({prog.progress_value}%)</span>
                                                )}
                                            </span>
                                            <span>
                                                {(new Date(prog.created_at || prog.timestamp)).toLocaleString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                     {(!task.progress || task.progress.length === 0) && (
                        <div className="bg-white shadow-md rounded-lg p-5 border border-gray-200 text-center">
                            <p className="text-sm text-gray-500">No progress history available.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
export default Task