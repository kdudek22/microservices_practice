import {ChangeEvent} from 'react';
import {requestService} from "../services/requestService.ts";

const Home = () => {
    const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files){
            alert("You must select a file")
            return
        }
        const file = e.target.files[0]
        console.log(file)

        try{
            const formData = new FormData()
            formData.append("file", file)
            const response = await requestService.postFile("http://localhost:5050/encode", formData)

            if(!response.ok){
                console.log("everything ok")
                return
            }
        }
        catch{
            console.log("bad")
        }
    }

  return (
    <>
        <nav className="w-screen bg-blue-600 py-8 px-8 shadow-lg rounded-b-lg">
            <div className="flex items-center h-full">
                <div>
                    <p className="font-bold text-xl text-white">Simple file converter</p>
                </div>
            </div>
        </nav>
        <div className="py-16">
            <div className="flex flex-col items-center gap-16">
                <p>Easily convert your files :)</p>
                <label htmlFor="file-input" className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600">Select the file</label>
                <input id="file-input" type="file" className="hidden" onChange={handleFileSelect}/>
            </div>
        </div>
    </>
  )
};

export default Home;