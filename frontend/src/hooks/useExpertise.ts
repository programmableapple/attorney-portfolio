import useSWR from 'swr';
import api from '@/lib/api';

interface Expertise {
    _id: string;
    name: string;
    description: string;
    icon: string;
    lawyerCount: number;
}

const fetcher = (url: string) => api.get(url).then(res => res.data);

export function useExpertise() {
    const { data, error, isLoading, mutate } = useSWR<Expertise[]>(
        '/expertise',
        fetcher,
        {
            refreshInterval: 15000,
            revalidateOnFocus: true,
        }
    );

    return {
        sectors: data || [],
        isLoading,
        isError: !!error,
        mutate,
    };
}

export type { Expertise };
