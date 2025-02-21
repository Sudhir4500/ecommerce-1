import { getAccessToken } from "../lib/actions";

const apiService = {
    get: async function (url: string): Promise<any> {
        const token = await getAccessToken();
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
                    resolve(json);
                })
                .catch((error => {
                    reject(error);
                }))
        })
    },
    getwithouttoken: async function (url: string): Promise<any> {
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
                    resolve(json);
                })
                .catch((error => {
                    reject(error);
                }))
        })
    },

    post: async function(url: string, data: any, config: { headers?: Record<string, string> } = {}): Promise<any> {
        const token = await getAccessToken();
        const headers = {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...config.headers
        };

        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'POST',
                headers: data instanceof FormData ? { 'Authorization': `Bearer ${token}` } : headers,
                body: data instanceof FormData ? data : JSON.stringify(data)
            })
            .then(response => response.json())
            .then((json) => {
                resolve(json);
            })
            .catch((error) => {
                reject(error);
            });
        });
    },

    postWithoutToken: async function(url: string, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'POST',
                body: typeof data === 'object' ? JSON.stringify(data) : data,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then((json) => {
                resolve(json);
            })
            .catch((error => {
                reject(error);
            }))
        })
    },

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
                    if (response.status === 204) {
                        resolve();
                        return;
                    }
                    return response.text().then(text => {
                        try {
                            return text ? JSON.parse(text) : {};
                        } catch (error) {
                            console.error('Error parsing JSON:', error);
                            return {};
                        }
                    });
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

    patch: async function (url: string, data: any): Promise<any> {
        const token = await getAccessToken();
        return new Promise((resolve, reject) => {
            fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            })
                .then(response => response.json())
                .then((json) => {
                    resolve(json);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
}

export default apiService;