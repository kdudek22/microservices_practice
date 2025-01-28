import {useState, useRef, ChangeEvent} from "react";
import {requestService} from "../services/requestService.ts";

const Login = () => {
    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    const [errorMessage, setErrorMessage] = useState<string>("")

    const handleLogin = async (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()

        const username = usernameRef.current!.value
        const password = passwordRef.current!.value

        try{
            const response = await requestService.post("http://localhost:5050/login", {"username": username, "password": password})
            if(!response.ok){
                setErrorMessage("Failed to login")
            }
            const body = await response.json()
            const token = body.token
        }
        catch{
            setErrorMessage("Failed to login")
        }
    }

    return (
        <div className="w-screen h-screen flex justify-center">
            <div className="flex items-center">
                <div className="shadow-lg px-8 py-8 rounded-xl border border-2 border-blue-600">
                    <form className="flex flex-col gap-4 items-center" onSubmit={handleLogin}>
                        <div>
                            <input type="text" placeholder="username" ref={usernameRef} className="bg-gray-100 rounded px-2"/>
                        </div>
                        <div>
                            <input type="password" placeholder="password" ref={passwordRef} className="bg-gray-100 rounded px-2"/>
                        </div>
                        <div className="text-sm text-red-600 min-h-6">{errorMessage}</div>
                        <button type="submit" className="px-2 bg-blue-500 shadow cursor-pointer rounded text-white text-xl">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;