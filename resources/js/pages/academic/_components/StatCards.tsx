import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Award, BookOpen, GraduationCap, TrendingDown, TrendingUp, Users } from 'lucide-react';
import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: React.ReactNode;
    trend?: {
        value: string;
        type: 'up' | 'down' | 'neutral';
    };
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon, trend }) => {
    return (
        <Card className="border py-3">
            <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-muted-foreground text-sm font-medium">{title}</p>
                        <p className="text-3xl font-bold">{value}</p>
                        <p className="text-muted-foreground text-xs">{description}</p>
                    </div>
                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">{icon}</div>
                </div>

                {trend && (
                    <div className="mt-3 flex items-center text-xs">
                        {trend.type === 'up' ? (
                            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                        ) : trend.type === 'down' ? (
                            <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                        ) : null}
                        <span className={trend.type === 'up' ? 'text-green-500' : trend.type === 'down' ? 'text-red-500' : ''}>{trend.value}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export function StatCards() {
    const stats = [
        {
            title: 'Total Mahasiswa Aktif',
            value: '12,458',
            description: 'Mahasiswa terdaftar semester ini',
            icon: <Users className="h-5 w-5" />,
            trend: {
                value: '3.2% dari tahun lalu',
                type: 'up' as const,
            },
        },
        {
            title: 'Rata-rata IPK',
            value: '3.42',
            description: 'Indeks Prestasi Kumulatif',
            icon: <BookOpen className="h-5 w-5" />,
            trend: {
                value: '0.1 dari semester lalu',
                type: 'up' as const,
            },
        },
        {
            title: 'Tingkat Kelulusan Tepat Waktu',
            value: '82%',
            description: 'Mahasiswa lulus tepat waktu',
            icon: <Award className="h-5 w-5" />,
            trend: {
                value: '5% dari tahun lalu',
                type: 'up' as const,
            },
        },
        {
            title: 'Rasio Dosen-Mahasiswa',
            value: '1:15',
            description: 'Perbandingan jumlah dosen & mahasiswa',
            icon: <GraduationCap className="h-5 w-5" />,
            trend: {
                value: 'Ideal menurut standar BAN-PT',
                type: 'neutral' as const,
            },
        },
        {
            title: 'Mahasiswa Bermasalah Akademik',
            value: '346',
            description: 'Perlu perhatian khusus',
            icon: <AlertTriangle className="h-5 w-5" />,
            trend: {
                value: '2.8% dari total mahasiswa',
                type: 'down' as const,
            },
        },
    ];

    return (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {stats.map((stat, index) => (
                <StatCard key={index} title={stat.title} value={stat.value} description={stat.description} icon={stat.icon} trend={stat.trend} />
            ))}
        </div>
    );
}
