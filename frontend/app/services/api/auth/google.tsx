import apiClientInstance from "..";

const googleAuth = (data: any) => {
    return apiClientInstance.post('auth/google', data)
        .then(response => {
            return response.data;
        })
        .catch(error => {
            console.error('Error:', error);
            throw error;
        });
};

export default googleAuth;