
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
        
            return new Promise<void>((resolve, reject) => {
                fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                    method: 'DELETE',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                })
                    .then(response => {
                        if (!response) {
                            throw new Error('No response received from the server');
                        }
                        
                        if (!response.ok) {
                            throw new Error('Failed to delete item');
                        }
        
                        // If the response is 204 (No Content), resolve immediately without parsing
                        if (response.status === 204) {
                            resolve(); // No content to parse, just resolve the promise
                            return;
                        }
        
                        // If there is content, parse it as JSON
                        return response.text().then(text => {
                            try {
                                return text ? JSON.parse(text) : {}; // Try to parse JSON
                            } catch (error) {
                                console.error('Error parsing JSON:', error);
                                return {}; // Return an empty object if parsing fails
                            }
                        });
                    })
                    .then((json) => {
                        resolve(json); // Resolve with the parsed JSON or empty object
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                        reject(error); // Reject with error if any
                    });
            });
        },
        
        
        
        
        
}

export default apiService;