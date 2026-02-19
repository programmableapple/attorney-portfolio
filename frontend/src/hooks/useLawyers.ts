import useSWR from 'swr';
import api from '@/lib/api';

interface Lawyer {
    _id: string;
    name: string;
    email: string;
    phone: string;
    bio: string;
    avatar: string;
    sectors: string[];
    experience: number;
    rating: number;
    available: boolean;
    userId?: string;
}

const fetcher = (url: string) => api.get(url).then(res => res.data);

export function useLawyers(sector?: string, search?: string) {
    const params = new URLSearchParams();
    if (sector) params.set('sector', sector);
    if (search) params.set('search', search);
    const query = params.toString();
    const url = `/lawyers${query ? `?${query}` : ''}`;

    const { data, error, isLoading, mutate } = useSWR<Lawyer[]>(url, fetcher, {
        refreshInterval: 10000,
        revalidateOnFocus: true,
    });

    return {
        lawyers: data || [],
        isLoading,
        isError: !!error,
        mutate,
    };
}

export type { Lawyer };
