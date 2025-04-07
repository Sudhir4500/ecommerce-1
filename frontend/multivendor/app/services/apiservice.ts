//services/apiservice.ts
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
        const headers: Record<string, string> = {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...config.headers
        };
    
        // Set Content-Type to application/json if data is not FormData
        if (!(data instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }
    
        return fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
            method: 'POST',
            headers: data instanceof FormData ? { 'Authorization': `Bearer ${token}` } : headers,
            body: data instanceof FormData ? data : JSON.stringify(data)
        })
        .then(async (response) => {
            if (!response.ok) {
                // Handle HTTP errors (e.g., 400, 500)
                const errorResponse = await response.json();
                throw new Error(errorResponse.detail || 'Something went wrong');
            }
            return response.json();
        })
        .then((json) => {
            return json;
        })
        .catch((error) => {
            console.error('API Error:', error);
            throw error;
        });
    },

    postWithoutToken: async function (url: string, data: any): Promise<any> {
        const headers: Record<string, string> = {
          Accept: "application/json",
        };
    
        // Only set Content-Type to application/json if data is not FormData
        if (!(data instanceof FormData)) {
          headers["Content-Type"] = "application/json";
        }
    
        return fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
          method: "POST",
          headers,
          body: data instanceof FormData ? data : JSON.stringify(data), // Don’t stringify FormData
        })
          .then(async (response) => {
            if (!response.ok) {
              const errorResponse = await response.json();
              throw new Error(errorResponse.detail || "Something went wrong");
            }
            return response.json();
          })
          .then((json) => {
            return json;
          })
          .catch((error) => {
            console.error("API Error:", error);
            throw error;
          });
      },

    // delete: async function (url: string): Promise<any> {
    //     const token = await getAccessToken();
    //     return new Promise<void>((resolve, reject) => {
    //         fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}/`, {
    //             method: 'DELETE',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`
    //             }
    //         })
    //             .then(response => {
    //                 if (!response) {
    //                     throw new Error('No response received from the server');
    //                 }
    //                 if (!response.ok) {
    //                     throw new Error('Failed to delete item');
    //                 }
    //                 if (response.status === 204) {
    //                     resolve();
    //                     return;
    //                 }
    //                 return response.text().then(text => {
    //                     try {
    //                         return text ? JSON.parse(text) : {};
    //                     } catch (error) {
    //                         console.error('Error parsing JSON:', error);
    //                         return {};
    //                     }
    //                 });
    //             })
    //             .then((json) => {
    //                 resolve(json);
    //             })
    //             .catch((error) => {
    //                 console.error('Error:', error);
    //                 reject(error);
    //             });
    //     });
    // },
    delete: async function (url: string): Promise<void> {
        const token = await getAccessToken();
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, { // Removed extra trailing slash
            method: 'DELETE',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json', // Optional for DELETE, can be omitted
              'Authorization': `Bearer ${token}`,
            },
          });
    
          if (!response.ok) {
            const errorText = await response.text(); // Get raw text for error details
            let errorDetail;
            try {
              errorDetail = JSON.parse(errorText).detail || errorText;
            } catch {
              errorDetail = errorText || 'Unknown error';
            }
            throw new Error(`Failed to delete: ${response.status} - ${errorDetail}`);
          }
    
          // 204 No Content is expected, no need to parse body
          if (response.status === 204) {
            return; // Resolve with void as expected
          }
    
          // If server returns unexpected content, parse it (optional)
          const json = await response.json();
          return json; // Only if your backend deviates from 204
        } catch (error) {
          console.error('Delete API Error:', error);
          throw error; // Re-throw to be caught in the calling function
        }
      },

    // patch: async function (url: string, data: any): Promise<any> {
    //     const token = await getAccessToken();
    //     return new Promise((resolve, reject) => {
    //         fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
    //             method: 'PATCH',
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `Bearer ${token}`
    //             },
    //             body: JSON.stringify(data)
    //         })
    //             .then(response => response.json())
    //             .then((json) => {
    //                 resolve(json);
    //             })
    //             .catch((error) => {
    //                 reject(error);
    //             });
    //     });
    // },
    
patch: async function (url: string, data: any): Promise<any> {
    const token = await getAccessToken();
    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  
    // Do not set Content-Type for FormData; let the browser handle it
    if (!(data instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }
  
    return fetch(`${process.env.NEXT_PUBLIC_API_HOST}${url}`, {
      method: 'PATCH',
      headers: data instanceof FormData ? { 'Authorization': `Bearer ${token}` } : headers,
      body: data instanceof FormData ? data : JSON.stringify(data),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(errorResponse.detail || 'Something went wrong');
        }
        return response.json();
      })
      .then((json) => {
        return json;
      })
      .catch((error) => {
        console.error('API Error:', error);
        throw error;
      });
  },
}

export default apiService;