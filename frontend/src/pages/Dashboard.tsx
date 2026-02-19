import { useAuth } from '@/context/AuthContext';
import { useLawyers } from '@/hooks/useLawyers';
import { useExpertise } from '@/hooks/useExpertise';
import { useBookings } from '@/hooks/useBookings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, Scale, CalendarDays, ArrowRight, Star, Sparkles } from 'lucide-react';

export default function Dashboard() {
    const { user } = useAuth();
    const { lawyers, isLoading: lawyersLoading } = useLawyers();
    const { sectors, isLoading: sectorsLoading } = useExpertise();
    const { bookings, isLoading: bookingsLoading } = useBookings();

    const isLoading = lawyersLoading || sectorsLoading || bookingsLoading;

    const stats = [
        {
            title: 'Total Lawyers',
            value: lawyers.length,
            icon: Users,
            description: 'Available for booking',
            gradient: 'from-blue-500/10 to-blue-600/5',
            iconColor: 'text-blue-500',
        },
        {
            title: 'Expertise Sectors',
            value: sectors.length,
            icon: Scale,
            description: 'Areas of practice',
            gradient: 'from-primary/10 to-primary/5',
            iconColor: 'text-primary',
        },
        {
            title: 'Your Bookings',
            value: bookings.length,
            icon: CalendarDays,
            description: 'Appointments scheduled',
            gradient: 'from-emerald-500/10 to-emerald-600/5',
            iconColor: 'text-emerald-500',
        },
    ];

    const topLawyers = lawyers.slice(0, 4);

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/15 via-primary/5 to-background border border-primary/10 p-6 md:p-8">
                <div className="absolute top-4 right-4 opacity-10">
                    <Sparkles className="h-32 w-32 text-primary" />
                </div>
                <div className="relative">
                    <span className="text-sm font-medium text-primary/80">
                        Welcome back
                    </span>
                    <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
                        {user?.name || 'Guest'}
                    </h1>
                    <p className="mt-2 text-muted-foreground max-w-lg">
                        Your legal partner dashboard. Browse expertise sectors, find the right attorney, and manage your appointments — all in one place.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                        <Button asChild className="gap-2">
                            <Link to="/lawyers">
                                Find a Lawyer <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link to="/expertise">Browse Sectors</Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat) => (
                    <Card
                        key={stat.title}
                        className="group relative overflow-hidden border-border/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
                    >
                        <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                        <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-5 w-5 ${stat.iconColor} transition-transform group-hover:scale-110`} />
                        </CardHeader>
                        <CardContent className="relative">
                            {isLoading ? (
                                <Skeleton className="h-8 w-16" />
                            ) : (
                                <>
                                    <div className="text-3xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                                </>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Top Lawyers */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-semibold">Top Attorneys</h2>
                        <p className="text-sm text-muted-foreground">Highest rated legal experts</p>
                    </div>
                    <Button variant="ghost" size="sm" asChild className="gap-1 text-primary">
                        <Link to="/lawyers">
                            View all <ArrowRight className="h-3 w-3" />
                        </Link>
                    </Button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {isLoading
                        ? Array(4)
                            .fill(0)
                            .map((_, i) => (
                                <Card key={i} className="p-4">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </div>
                                </Card>
                            ))
                        : topLawyers.map((lawyer) => (
                            <Card
                                key={lawyer._id}
                                className="group p-4 border-border/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-12 w-12 border-2 border-primary/10 group-hover:border-primary/30 transition-colors">
                                        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                                            {lawyer.name
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-medium text-sm truncate">{lawyer.name}</p>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Star className="h-3 w-3 fill-primary text-primary" />
                                            <span>{lawyer.rating}</span>
                                            <span className="mx-1">•</span>
                                            <span>{lawyer.experience}y exp</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 flex flex-wrap gap-1">
                                    {lawyer.sectors.slice(0, 2).map((s) => (
                                        <Badge key={s} variant="secondary" className="text-[10px] px-1.5 py-0">
                                            {s}
                                        </Badge>
                                    ))}
                                </div>
                            </Card>
                        ))}
                </div>
            </div>
        </div>
    );
}
