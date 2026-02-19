import { useBookings } from '@/hooks/useBookings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { CalendarDays } from 'lucide-react';

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
    confirmed: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    completed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    cancelled: 'bg-red-500/10 text-red-600 border-red-500/20',
};

export default function Bookings() {
    const { bookings, isLoading } = useBookings();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
                <p className="text-muted-foreground mt-1">
                    Track and manage your attorney consultations
                </p>
            </div>

            {isLoading ? (
                <Card>
                    <CardContent className="p-6 space-y-4">
                        {Array(3)
                            .fill(0)
                            .map((_, i) => (
                                <div key={i} className="flex items-center gap-4">
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                    <Skeleton className="h-6 w-20" />
                                </div>
                            ))}
                    </CardContent>
                </Card>
            ) : bookings.length === 0 ? (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <CalendarDays className="h-12 w-12 text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-medium text-muted-foreground">No bookings yet</h3>
                        <p className="text-sm text-muted-foreground/70 mt-1">
                            Book a consultation with an attorney to get started
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Mobile Cards */}
                    <div className="space-y-3 md:hidden">
                        {bookings.map((booking) => {
                            const lawyer = booking.lawyerId;
                            const initials = lawyer?.name
                                ? lawyer.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                : '?';

                            return (
                                <Card key={booking._id} className="border-border/50">
                                    <CardContent className="p-4">
                                        <div className="flex items-start gap-3">
                                            <Avatar className="h-10 w-10 shrink-0">
                                                <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                                                    {initials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="font-medium text-sm truncate">
                                                        {lawyer?.name || 'Unknown'}
                                                    </p>
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-[10px] shrink-0 capitalize ${statusColors[booking.status]}`}
                                                    >
                                                        {booking.status}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {new Date(booking.date).toLocaleDateString('en-US', {
                                                        weekday: 'short',
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                                {booking.notes && (
                                                    <p className="text-xs text-muted-foreground/70 mt-1 truncate">
                                                        {booking.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>

                    {/* Desktop Table */}
                    <Card className="hidden md:block border-border/50">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base">All Bookings</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Attorney</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Notes</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {bookings.map((booking) => {
                                        const lawyer = booking.lawyerId;
                                        const initials = lawyer?.name
                                            ? lawyer.name
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')
                                            : '?';

                                        return (
                                            <TableRow key={booking._id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-8 w-8">
                                                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                                                {initials}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <span className="font-medium text-sm">
                                                            {lawyer?.name || 'Unknown'}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {new Date(booking.date).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                                                    {booking.notes || '—'}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`capitalize ${statusColors[booking.status]}`}
                                                    >
                                                        {booking.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
