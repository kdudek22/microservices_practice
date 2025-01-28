
const getJWTToken = () => {
    return localStorage.getItem("token")
}

class RequestService{
    async get(url: string){
        return await fetch(url, {
            method: "GET",
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${getJWTToken()}`}
        })
    }

    async post(url: string, body: any){
        return await fetch(url, {
            method: "POST",
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${getJWTToken()}`},
            body: JSON.stringify(body)
        })
    }

    async postFile(url: string, formData: FormData) {
        return await fetch(url, {
            method: "POST",
            headers: {'Authorization': `Bearer ${getJWTToken()}`},
            body: formData
        })
    }
}

export const requestService= new RequestService();