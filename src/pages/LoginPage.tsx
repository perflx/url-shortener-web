import { useState } from "react";
import { Link, useNavigate } from "react-router";

export default function LoginPage(){
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        try{
            e.preventDefault();
            setError("");
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: login, password: password }),
            });

            const data = await response.json();
            console.log(`status: ${response.status}`);
            if (!response.ok) {
                if (response.status === 401 || response.status === 400){
                    setError("Invalid login or password");
                    return;
                } else if (response.status === 429) {
                    setError("Too many attempts, try again later");
                    return;
                }
                setError("Something went wrong");
                return;
            }
            localStorage.setItem("token", data.token);
            navigate("/dashboard", { replace: true });
    }catch(err){
        setError("Can't reach the server");
    }finally{
        setLoading(false);
    }
}


    return(<>
    <div className="min-h-screen bg-gray-100 pt-20">

        <form className="mx-auto flex max-w-sm flex-col gap-4 rounded-xl bg-white p-6 shadow" onSubmit={handleSubmit}>
        <h1 className="self-center">Login</h1>

        <input required type="email" className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
        value={login} onChange={e => setLogin(e.target.value)} placeholder="Login"/>
        <input required type="password" className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
        value={password} minLength={8} maxLength={72} onChange={e => setPassword(e.target.value)} placeholder="Password"/>
        <button className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700" 
        type="submit">Log in</button>
        <div>{error? <p>{`${error}`}</p>: ``}</div>
        <div>{loading? <p>Loading...</p>: ``}</div>

        <Link to="/register"
        className="font-medium text-blue-600 hover:underline">Register</Link>
        </form>

    </div>
    </>);
}