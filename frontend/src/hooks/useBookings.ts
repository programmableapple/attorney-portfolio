import useSWR from 'swr';
import api from '@/lib/api';

interface Booking {
    _id: string;
    userId: string;
    lawyerId: {
        _id: string;
        name: string;
        email: string;
        sectors: string[];
        avatar: string;
    };
    date: string;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    notes: string;
    createdAt: string;
}

const fetcher = (url: string) => api.get(url).then(res => res.data);

export function useBookings() {
    const token = localStorage.getItem('token');

    const { data, error, isLoading, mutate } = useSWR<Booking[]>(
        token ? '/bookings' : null,
        fetcher,
        {
            refreshInterval: 10000,
            revalidateOnFocus: true,
        }
    );

    const createBooking = async (lawyerId: string, date: string, notes: string) => {
        const { data } = await api.post('/bookings', { lawyerId, date, notes });
        mutate();
        return data;
    };

    return {
        bookings: data || [],
        isLoading,
        isError: !!error,
        mutate,
        createBooking,
    };
}

export type { Booking };
