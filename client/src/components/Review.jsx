import { useUsercontext } from "../context/usercontext";



async function handler_rollback(id) {
    try{
        const res = await fetch(`http://localhost:8100/roll_back/${id}`,{
            credentials:"include"
        })
        if(res.ok){

        }
        else{

        }
    }
    catch(err){

    }
}

async function handler_approve(progress, id){
    try{
        const res = await fetch("http://localhost:8100/complete/task",
            {
                method:"POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials:'include',
                body:JSON.stringify({id,progress})
            }
        )
        if(res.ok){

        }
        else{
        }
    }
    catch(err){
        console.error(err)

    }
}
function Review(){
    const {review_tasks} = useUsercontext()
    console.log(review_tasks);
    return(
        <div className="h-full w-full">
        <div className="w-full flex flex-col text-white p-5 overflow-y-auto h-full justify-start overflow-x-hidden bg-black/85">
            <table className="p-4 border-white m-10">
                <thead>
                    <tr className="p-4 border border-white m-10 font-bold">
                        <td className="p-4 border border-white m-10">Taks</td>
                        <td className="p-4 border border-white m-10">Assigned by</td>
                        <td className="p-4 border border-white m-10">Assigned to</td>
                        <td className="p-4 border border-white m-10">created at</td>
                        <td className="p-4 border border-white m-10">deadline</td>
                    </tr>
                </thead>
                <tbody>
            {
                review_tasks.map((task,index)=>{
                    return(
                            <tr className="p-4 border border-white m-10" key = {index}>
                                <td className="p-4 border border-white m-10">{task.task}</td>
                                <td className="p-4 border border-white m-10">{task.assigned_by_username}</td>
                                <td className="p-4 border border-white m-10">{task.assigned_to_username}</td>
                                <td className="p-4 border border-white m-10">{(new Date(task.created_at)).toLocaleString("en-US")}</td>
                                <td className="p-4 border border-white m-10">{(new Date(task.deadline)).toLocaleString("en-US")}</td>
                                <td className="p-4 border border-white m-10">
                                    <input type= "range" value = {task.progress} min = {0} max = {100} disabled/>
                                    <div className="flex flex-row justify-center items-center">
                                    <button type = "button" onClick={()=>{handler_approve(task.progress, task.id)}} className="text-white rounded-md p-2 hover:bg-black/50">Approve</button>
                                    <button type = "button" onClick={()=>{handler_rollback(task.id)}} className="text-white rounded-md p-2 hover:bg-black/50">ROLL_BACK</button>
                                    </div>
                                </td>
                            </tr>
                    )
                })
            }
            </tbody>
            </table>
        </div>
        </div>
    )
}
export default Review