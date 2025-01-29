import {ChangeEvent, useEffect, useState} from 'react';
import {requestService} from "../services/requestService.ts";

enum State {
    BeforeStartOfConversion,
    AfterStartOfConversion,
    ConversionFinished
}

const Home = () => {
    const [state, setState] = useState<State>(State.AfterStartOfConversion)
    const [selectedFile, setSelectedFile] = useState<File|null>(null)
    const [errorMessage, setErrorMessage] = useState("")
    const [canConvert, setCanConvert] = useState<boolean>(false)
    const [fileId, setFileId] = useState<string>("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        const file = selectedFile!

        try{
            const formData = new FormData()
            formData.append("file", file)
            const response = await requestService.postFile("http://localhost:5050/encode", formData)

            if(!response.ok){
                const error = await response.json()
                alert(error.error)
                return
            }
            const data = await response.json()
            console.log(data)
            setState(State.AfterStartOfConversion)
        }
        catch (e: any){
            console.log(e.message)
        }
    }

    useEffect(() => {
        if(state === State.AfterStartOfConversion){
            setInterval(async () => {
                const response = await requestService.get("http://localhost:5050/image?image_id=" + "679a2a7b9a1d1a50aa6920f7")
                if(response.ok){
                    console.log(response)
                    setState(State.ConversionFinished)
                }
            }, 10000)
        }

    }, [state]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCanConvert(false)
        if(!e.target.files){
            setErrorMessage("Please select a file")
            return
        }
        if(!e.target.files[0].name.endsWith(".jpg")){
            setErrorMessage("Please select a jpg file!")
            return
        }
        setCanConvert(true)
        setErrorMessage("")
        setSelectedFile(e.target.files[0])
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
                { state === State.BeforeStartOfConversion &&
                    <>
                        <p>Easily convert your files :)</p>
                        <form className="flex flex-col gap-8 items-center" onSubmit={handleSubmit}>
                            <label htmlFor="file-input"
                                   className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-600">Select
                                the file</label>
                            <input id="file-input" type="file" className="hidden" onChange={handleFileChange}/>
                            {selectedFile && <p className="text-gray-600">{selectedFile.name}</p>}
                            {errorMessage && <p className="text-red-600 underline">{errorMessage}</p>}
                            <button disabled={!canConvert} type="submit"
                                    className="disabled:bg-gray-400 cursor-pointer bg-orange-500 text-white rounded-lg px-4 py-2">Convert
                            </button>
                        </form>
                    </>}

                { state === State.AfterStartOfConversion &&
                    <>
                        <p>The conversion is ongoing, please </p>
                    </>}

                { state === State.ConversionFinished &&
                    <>
                        <a href="http://localhost/image">Download the converted file</a>
                    </>}
            </div>
        </div>
    </>
  )
};

export default Home;