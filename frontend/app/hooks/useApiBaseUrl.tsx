import { useState, useEffect } from "react";
import { getApiBaseUrl } from "~/constants/api";
import { useErrorOccurredModal } from "~/contexts/ErrorOccurredModalContext";

export function useApiBaseUrl() {
    const [apiBaseUrl, setApiBaseUrl] = useState<string | null>(null);
    const { setErrorOccurredModalVisible } = useErrorOccurredModal();

    useEffect(() => {
        const fetchApiBaseUrl = async () => {
            try {
                const url = await getApiBaseUrl();
                setApiBaseUrl(url);
            } catch (error) {
                setErrorOccurredModalVisible(true);
            }
        };

        fetchApiBaseUrl();
    }, [setErrorOccurredModalVisible]);

    return apiBaseUrl;
}
