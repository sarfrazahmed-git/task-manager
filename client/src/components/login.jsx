import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUsercontext } from "../context/usercontext";

function Login(){
    
    const nav = useNavigate();
    const [user,setuser] = useState("");
    const [pass,setpass] = useState("");
    const [error, seterror] = useState("");
    const {setrole, setuser_context,loggedin,setlogin} = useUsercontext()
    console.log("loggedib: ", loggedin)
    useEffect(()=>{
        if(loggedin){
        nav("/mainpage")}
    },[loggedin]);
    async function login(e){
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:8100/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username: user, password: pass }),
                credentials: "include"
            });
            if (res.ok) {
                const role = await res.json()
                console.log(role.user.role,"role");
                console.log(role.user, "user_go_current");
                setrole(role.user.role);
                setuser_context(role.user);
                console.log("Login successful");
                seterror("");
                setlogin(true);
            } else {
                const err = await res.json();
                console.error(err);
                seterror(err.err);
                setlogin(false);
            }
        } catch (err) {
            console.error(err);
            seterror(err.err)
            setlogin(false);
        }

    } 
    
    return (
  <div className="flex justify-center items-center w-full h-full bg-gray-50">
    {!loggedin && (
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 w-full max-w-sm">
        <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">Login</h2>
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            login(e);
          }}
        >
          <input
            required
            type="text"
            value={user}
            onChange={(e) => setuser(e.target.value)}
            placeholder="Username"
            className="bg-gray-100 rounded-md px-3 py-2 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            required
            type="password"
            value={pass}
            onChange={(e) => setpass(e.target.value)}
            placeholder="Password"
            className="bg-gray-100 rounded-md px-3 py-2 border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    )}

    {error !== "" && (
      <div className="absolute top-10 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded shadow-md max-w-sm w-full text-center">
        <p>{error}</p>
      </div>
    )}
  </div>
);

}

export default Login;