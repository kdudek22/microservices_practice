class RequestService{
    async get(url: string){
        return await fetch(url, {
            method: "GET",
            headers: {'Content-Type': 'application/json'}
        })
    }

    async post(url: string, body: any){
        return await fetch(url, {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
    }
}

export const requestService= new RequestService();