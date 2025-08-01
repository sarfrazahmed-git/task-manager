import { useNavigate } from "react-router-dom";
function SideBar({options}){
    const nav = useNavigate();
    console.log("sidebar")
    return (
        <div className="flex flex-col w-64 bg-white h-full mt-1 shadow-md text-gray-600">
        {options.map((opt,index)=>{
            return(
        <div key = {index} className="p-4 flex justify-start items-center transition-transform duration-300 hover:shadow-md hover:bg-gray-200 hover:text-gray-800 rounded-sm w-full" onClick={()=>{
            console.log("going_out, nav");
            nav(opt.path)
        }
        }>
            <opt.icon className = "mr-3"/>
            {opt.name}
        </div>)
    })}
    </div>)
}

export default SideBar;