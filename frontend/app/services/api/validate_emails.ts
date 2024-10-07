import { getClient } from ".";

const validateEmails = async (data: any, file?: File) => {
    try {
        let response;
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('columnsToScan', data.columnsToScan);
            response = await (await getClient()).post('validate_emails', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } else {
            response = await (await getClient()).post('validate_emails', data);
        }
        return response.data;
    } catch (error: any) {
        if (error?.message?.includes('429')) return { error: error?.response?.data }
        else {
            console.error('Error:', error);
            throw error;
        }
    }
};

export default validateEmails;