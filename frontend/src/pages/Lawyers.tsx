import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLawyers } from '@/hooks/useLawyers';
import { useExpertise } from '@/hooks/useExpertise';
import { useBookings } from '@/hooks/useBookings';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Star, Search, CalendarDays, Clock, X } from 'lucide-react';
import { toast } from 'sonner';

export default function Lawyers() {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeSector = searchParams.get('sector') || '';
    const [search, setSearch] = useState('');
    const [bookingDate, setBookingDate] = useState('');
    const [bookingNotes, setBookingNotes] = useState('');
    const [bookingOpen, setBookingOpen] = useState(false);
    const [selectedLawyer, setSelectedLawyer] = useState<string | null>(null);
    const [bookingLoading, setBookingLoading] = useState(false);

    const { lawyers, isLoading } = useLawyers(activeSector, search);
    const { sectors } = useExpertise();
    const { createBooking } = useBookings();
    const { user } = useAuth();

    const handleBook = async () => {
        if (!selectedLawyer || !bookingDate) return;
        setBookingLoading(true);
        try {
            await createBooking(selectedLawyer, bookingDate, bookingNotes);
            toast.success('Booking created successfully!');
            setBookingOpen(false);
            setBookingDate('');
            setBookingNotes('');
            setSelectedLawyer(null);
        } catch {
            toast.error('Failed to create booking');
        } finally {
            setBookingLoading(false);
        }
    };

    const clearSector = () => {
        setSearchParams({});
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Our Attorneys</h1>
                <p className="text-muted-foreground mt-1">
                    Find and book the perfect legal expert for your needs
                </p>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search attorneys..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant={!activeSector ? 'default' : 'outline'}
                        size="sm"
                        onClick={clearSector}
                        className="text-xs"
                    >
                        All
                    </Button>
                    {sectors.map((s) => (
                        <Button
                            key={s._id}
                            variant={activeSector === s.name ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSearchParams({ sector: s.name })}
                            className="text-xs"
                        >
                            {s.name}
                        </Button>
                    ))}
                </div>
            </div>

            {activeSector && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Filtered by:</span>
                    <Badge variant="secondary" className="gap-1">
                        {activeSector}
                        <button onClick={clearSector}>
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                </div>
            )}

            {/* Lawyer Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {isLoading
                    ? Array(6)
                        .fill(0)
                        .map((_, i) => (
                            <Card key={i} className="p-6">
                                <div className="flex items-start gap-4">
                                    <Skeleton className="h-14 w-14 rounded-full shrink-0" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </div>
                                </div>
                            </Card>
                        ))
                    : lawyers.map((lawyer) => {
                        const initials = lawyer.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('');

                        return (
                            <Card
                                key={lawyer._id}
                                className="group relative overflow-hidden border-border/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                            >
                                {!lawyer.available && (
                                    <div className="absolute top-3 right-3">
                                        <Badge variant="secondary" className="text-[10px] bg-muted text-muted-foreground">
                                            Unavailable
                                        </Badge>
                                    </div>
                                )}
                                <CardHeader className="pb-3">
                                    <div className="flex items-start gap-4">
                                        <Avatar className="h-14 w-14 border-2 border-primary/10 group-hover:border-primary/30 transition-colors shrink-0">
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                                                {initials}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <h3 className="font-semibold text-base truncate">{lawyer.name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                                                <div className="flex items-center gap-1">
                                                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                                                    <span className="font-medium text-foreground">{lawyer.rating}</span>
                                                </div>
                                                <span>•</span>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3.5 w-3.5" />
                                                    <span>{lawyer.experience} years</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0 space-y-3">
                                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                                        {lawyer.bio}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {lawyer.sectors.map((s) => (
                                            <Badge key={s} variant="outline" className="text-xs font-normal">
                                                {s}
                                            </Badge>
                                        ))}
                                    </div>
                                    {lawyer.available && user && (
                                        <Dialog
                                            open={bookingOpen && selectedLawyer === lawyer._id}
                                            onOpenChange={(open) => {
                                                setBookingOpen(open);
                                                if (open) setSelectedLawyer(lawyer._id);
                                            }}
                                        >
                                            <DialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    className="w-full mt-2 gap-2 transition-all hover:shadow-md hover:shadow-primary/20"
                                                >
                                                    <CalendarDays className="h-4 w-4" />
                                                    Book Consultation
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Book {lawyer.name}</DialogTitle>
                                                    <DialogDescription>
                                                        Schedule a consultation with this attorney
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="booking-date">Preferred Date & Time</Label>
                                                        <Input
                                                            id="booking-date"
                                                            type="datetime-local"
                                                            value={bookingDate}
                                                            onChange={(e) => setBookingDate(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="booking-notes">Notes (optional)</Label>
                                                        <Input
                                                            id="booking-notes"
                                                            placeholder="Brief description of your legal matter..."
                                                            value={bookingNotes}
                                                            onChange={(e) => setBookingNotes(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setBookingOpen(false)}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button
                                                        onClick={handleBook}
                                                        disabled={!bookingDate || bookingLoading}
                                                    >
                                                        {bookingLoading ? 'Booking...' : 'Confirm Booking'}
                                                    </Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
            </div>

            {!isLoading && lawyers.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-muted-foreground">No attorneys found matching your criteria.</p>
                </div>
            )}
        </div>
    );
}
