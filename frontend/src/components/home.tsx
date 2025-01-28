import {ChangeEvent} from 'react';

const Home = () => {
    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        if(!e.target.files){
            alert("You must select a file")
            return
        }
        const file = e.target.files[0]

        console.log(file)
        // send the request to the api gateway to handle the file
    }

  return (
    <>
        <nav className="w-screen bg-blue-600 py-8 px-8 shadow-lg">
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