import { useState } from "react";
import { useNavigate, Navigate } from "react-router";
import { useEffect } from "react";
import type { User, Link } from "../types";


export default function DashboardPage(){
    const token = localStorage.getItem("token");
    const navigate = useNavigate(); 
    const [user, setUser] = useState<User | null>(null);
    const [links, setLinks] = useState<Link[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [newURL, setNewURL] = useState<string>("");
    const [update, setUpdate] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [copiedId, setCopiedId] = useState<number | null>(null);


    useEffect(() => {
        async function load() {
            try{
                if (!token) return;
                setLoading(true);
                const userResponse = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
                    method: "GET",
                    headers: { "Authorization": `Bearer ${token}` },
                });
                if (!userResponse.ok){
                    if (userResponse.status === 401){
                        localStorage.removeItem("token")
                        navigate("/login", {replace: true});
                        return;
                    }
                    console.error(userResponse);
                    return;
                }

                const userData = await userResponse.json();
                const linksResponse = await fetch(`${import.meta.env.VITE_API_URL}/links`, {
                    method: "GET",
                    headers: {"Authorization": `Bearer ${token}`}
                });

                const linksData = await linksResponse.json();
                if (!linksResponse.ok){
                    if (linksResponse.status === 401){
                        localStorage.removeItem("token")
                        navigate("/login", {replace: true});
                        return;
                    }
                    setError(linksData.message);
                    return;
                }

                setUser(userData);
                setLinks(linksData.links);

            }catch(err){
                console.log(err);
            }finally{
                setLoading(false);
            }
        }
        load();
        }, [update]); 


    if (!token){
        return (<Navigate to="/login" replace />);
    }

    async function logOut(){
        localStorage.removeItem("token");
        navigate("/login", {replace: true});
    }  
    
    async function createLink(e: React.FormEvent<HTMLFormElement>){
        try{
            e.preventDefault();
            setError("");
            const response = await fetch(`${import.meta.env.VITE_API_URL}/links`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json","Authorization": `Bearer ${token}`},
                    body: JSON.stringify({link: newURL})
                });
            setUpdate(u => !u)
            const data = await response.json();
            if (!response.ok){
                setError(data.message);
                return;
            }
            setNewURL("");
        }catch(err){
            setError("Can't reach the server")
        }
    }

    async function handleCopy(link: string, id: number){
        try{
            await navigator.clipboard.writeText(link);
            setCopiedId(id);

            setTimeout(() => setCopiedId(null), 1200);
        }catch(err){
            console.error("Copying Error");
        }
        
    }




    return(<>
    <div className="min-h-screen bg-gray-100">
         <header className="flex items-center justify-between bg-white px-6 py-4 shadow">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button onClick={logOut} className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Log out
            </button>
        </header>
        <main className="mx-auto max-w-3xl p-6">
            <div>
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Shorten Link</h2>
                <form className="mb-8 flex flex-col gap-3" onSubmit={createLink}>
                    <input required type="text" className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
        value={newURL} onChange={e => setNewURL(e.target.value)} placeholder="URL"/>
                
                <button className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700" 
        type="submit">Create Short link</button>
                {error? <p className="text-sm text-red-600">{error}</p> : ``}
                </form>
            </div>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">Your Links</h2>
        <ul className="space-y-3">
            {links.map(link => (
                <li key={link.id} className="rounded-xl bg-white p-4 shadow">
                <a
                    href={`${import.meta.env.VITE_API_URL}/${link.shortCode}`}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all font-medium text-blue-600 hover:underline"
                >
                    {`${import.meta.env.VITE_API_URL}/${link.shortCode}`}
                </a>
                <p className="mt-1 truncate text-sm text-gray-500">{link.originalUrl}</p>
                <div className="mt-2 flex gap-4 text-xs text-gray-400">
                    <span>{new Date(link.createdAt).toLocaleDateString()}</span>
                    <span>{link.clicks} clicks</span>
                </div>
                <button onClick={()=> handleCopy(`${import.meta.env.VITE_API_URL}/${link.shortCode}`, link.id)}
                 className="font-medium text-blue-600 hover:underline">
                    {copiedId === link.id? `` : `Copy`}
                 </button>
                 <button onClick={()=> handleCopy(`${import.meta.env.VITE_API_URL}/${link.shortCode}`, link.id)}
                 className="font-medium text-violet-700 hover:underline">
                    {copiedId === link.id? `Copied!` : ``}
                 </button>
                </li>
            ))}
        </ul>
        {loading? <p>Loading...</p> : ``}
        {!loading && links.length === 0? <p className="rounded-xl bg-white p-6 text-center text-gray-500">No links yet</p> : ``}
        </main>
    </div>
    </>);

}