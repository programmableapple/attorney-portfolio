import { useExpertise } from '@/hooks/useExpertise';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
    DollarSign,
    Wheat,
    Building2,
    Shield,
    Home,
    Globe,
    Heart,
    Lightbulb,
    Briefcase,
    ArrowRight,
} from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
    DollarSign: <DollarSign className="h-6 w-6" />,
    Wheat: <Wheat className="h-6 w-6" />,
    Building2: <Building2 className="h-6 w-6" />,
    Shield: <Shield className="h-6 w-6" />,
    Home: <Home className="h-6 w-6" />,
    Globe: <Globe className="h-6 w-6" />,
    Heart: <Heart className="h-6 w-6" />,
    Lightbulb: <Lightbulb className="h-6 w-6" />,
    Briefcase: <Briefcase className="h-6 w-6" />,
};

const gradients = [
    'from-amber-500/15 to-amber-600/5',
    'from-emerald-500/15 to-emerald-600/5',
    'from-blue-500/15 to-blue-600/5',
    'from-red-500/15 to-red-600/5',
    'from-violet-500/15 to-violet-600/5',
    'from-cyan-500/15 to-cyan-600/5',
    'from-pink-500/15 to-pink-600/5',
    'from-orange-500/15 to-orange-600/5',
];

export default function Expertise() {
    const { sectors, isLoading } = useExpertise();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Expertise Sectors</h1>
                <p className="text-muted-foreground mt-1">
                    Browse our areas of legal specialization and find attorneys by sector
                </p>
            </div>

            {/* Sectors Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {isLoading
                    ? Array(8)
                        .fill(0)
                        .map((_, i) => (
                            <Card key={i} className="p-6">
                                <div className="space-y-4">
                                    <Skeleton className="h-12 w-12 rounded-xl" />
                                    <Skeleton className="h-5 w-32" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            </Card>
                        ))
                    : sectors.map((sector, index) => (
                        <Card
                            key={sector._id}
                            className="group relative overflow-hidden border-border/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                        >
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${gradients[index % gradients.length]} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                            />
                            <CardHeader className="relative pb-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary/15">
                                        {iconMap[sector.icon] || iconMap['Briefcase']}
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                        {sector.lawyerCount} {sector.lawyerCount === 1 ? 'lawyer' : 'lawyers'}
                                    </Badge>
                                </div>
                                <CardTitle className="text-lg mt-3">{sector.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="relative pt-0">
                                <CardDescription className="text-sm leading-relaxed line-clamp-3">
                                    {sector.description}
                                </CardDescription>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                    className="mt-4 gap-1 text-primary p-0 h-auto font-medium hover:bg-transparent hover:gap-2 transition-all"
                                >
                                    <Link to={`/lawyers?sector=${encodeURIComponent(sector.name)}`}>
                                        Find lawyers <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
            </div>
        </div>
    );
}
