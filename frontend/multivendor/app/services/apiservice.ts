
import { getAccessToken } from "../lib/actions";

const apiService = {
    get: async function (url: string): Promise<any> {
        // console.log('get', url);

        const token = await getAccessToken();
        // console.log('Token:', token);


        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then((json) => {
                    // console.log('Response:', json);

                    resolve(json);
                })
                .catch((error => {
                    reject(error);
                }))
        })
    },
    getwithouttoken: async function (url: string): Promise<any> {
        // console.log('get', url);

        const token = await getAccessToken();
        // console.log('Token:', token);


        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            })
                .then(response => response.json())
                .then((json) => {
                    // console.log('Response:', json);

                    resolve(json);
                })
                .catch((error => {
                    reject(error);
                }))
        })
    },

    post: async function(url: string, data: any): Promise<any> {
        console.log('post', url, data);
    
        const token = await getAccessToken();
    
        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',  // Make sure content-type is set as json
                    'Authorization': `Bearer ${token}`, // If token is required
                },
                body: JSON.stringify(data),  // Ensure data is stringified
            })
            .then(response => response.json())
            .then((json) => {
                console.log('Response:', json);  // Optional debugging
                resolve(json);
            })
            .catch((error) => {
                console.error('Error:', error);  // Optional error logging
                reject(error);
            });
        });
    },

    postWithoutToken: async function(url: string, data: any): Promise<any> {
        console.log('post', url, data);
    
        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'POST',
                body: typeof data === 'object' ? JSON.stringify(data) : data, // Ensure data is stringified if it's an object
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then((json) => {
                // console.log('Response:', json);
                resolve(json);
            })
            .catch((error => {
                reject(error);
            }))
        })
    },
    // handleDelete: async function (url: string): Promise<any> {
        delete: async function (url: string): Promise<any> {
            const token = await getAccessToken();
        
            return new Promise((resolve, reject) => {
                fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to delete item');
                        }
                        return response.json();
                    })
                    .then((json) => {
                        resolve(json);
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        reject(error);
                    });
            });
        },
        
        
}

export default apiService;