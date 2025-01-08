import { useState, useEffect } from 'react';

const BASE_URL = '/api/'; 

export function useFetchGet(url) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [data, setData] = useState(null);

    useEffect(() => {
        const controller = new AbortController();
        
        const fetchData = async () => {
            try {
                setLoading(true);
                setError('');
                const resp = await fetch(BASE_URL + url, controller, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    signal: controller.signal,
                });
                if (!resp.ok) {throw new Error('Algo salio mal')}
                
                const Data = await resp.json();
                setData(Data);
        
            } catch (err) {

                setError(err.message);
            } finally {
                setLoading(false);
            }

            return () => {
                controller.abort();
            }
        }
        fetchData();

    },[url])
    return {data, loading, error};
}
