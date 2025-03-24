import { Card, CardContent } from '@/components/ui/card';
import { AcademicStats, TermInfo } from '@/types/academic';
import { router } from '@inertiajs/react';
import { AlertTriangle, Award, BookOpen, ChevronRight, GraduationCap, TrendingDown, TrendingUp, Users } from 'lucide-react';
import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: React.ReactNode;
    detailPath: string;
    trend?: {
        value: string;
        type: 'up' | 'down' | 'neutral';
    };
    termInfo?: string;
}

interface StatCardsProps {
    stats: AcademicStats;
    currentTerm?: TermInfo;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon, trend, detailPath, termInfo }) => {
    const handleClick = () => {
        router.visit(detailPath);
    };

    return (
        <Card className="group relative cursor-pointer border py-3 transition-all duration-200 hover:shadow-md" onClick={handleClick}>
            <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-muted-foreground text-sm font-medium">{title}</p>
                        <p className="text-3xl font-bold">{value}</p>
                        <p className="text-muted-foreground text-xs">{description}</p>
                        {termInfo && <p className="text-primary mt-1 text-xs">{termInfo}</p>}
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

                <div className="absolute right-3 bottom-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <ChevronRight className="text-primary h-4 w-4" />
                </div>
            </CardContent>
        </Card>
    );
};

export function StatCards({ stats, currentTerm }: StatCardsProps) {
    // Menggunakan data dari props
    const cardData = [
        {
            title: 'Total Mahasiswa Aktif',
            value: stats.activeStudents.total,
            description: 'Mahasiswa terdaftar semester ini',
            icon: <Users className="h-5 w-5" />,
            detailPath: route('academic.student.index'),
            trend: stats.activeStudents.trend,
            termInfo: currentTerm?.name,
        },
        {
            title: 'Rata-rata IPK',
            value: stats.avgGpa.value,
            description: 'Indeks Prestasi Kumulatif',
            icon: <BookOpen className="h-5 w-5" />,
            detailPath: route('academic.student.index'),
            trend: stats.avgGpa.trend,
            termInfo: stats.avgGpa.term_info || currentTerm?.name,
        },
        {
            title: 'Tingkat Kelulusan Tepat Waktu',
            value: stats.graduationRate?.value || '82%',
            description: 'Mahasiswa lulus tepat waktu',
            icon: <Award className="h-5 w-5" />,
            detailPath: route('academic.student.index'),
            trend: stats.graduationRate?.trend || {
                value: '5% dari tahun lalu',
                type: 'up' as const,
            },
        },
        {
            title: 'Rasio Dosen-Mahasiswa',
            value: stats.facultyRatio?.value || '1:15',
            description: 'Perbandingan jumlah dosen & mahasiswa',
            icon: <GraduationCap className="h-5 w-5" />,
            detailPath: route('academic.student.index'),
            trend: stats.facultyRatio?.trend || {
                value: 'Ideal menurut standar BAN-PT',
                type: 'neutral' as const,
            },
        },
        {
            title: 'Mahasiswa Bermasalah Akademik',
            value: stats.problemStudents?.total || '346',
            description: 'Perlu perhatian khusus',
            icon: <AlertTriangle className="h-5 w-5" />,
            detailPath: route('academic.student.index'),
            trend: stats.problemStudents?.trend || {
                value: '2.8% dari total mahasiswa',
                type: 'down' as const,
            },
        },
    ];

    return (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {cardData.map((card, index) => (
                <StatCard
                    key={index}
                    title={card.title}
                    value={card.value}
                    description={card.description}
                    icon={card.icon}
                    trend={card.trend}
                    detailPath={card.detailPath}
                    termInfo={card.termInfo}
                />
            ))}
        </div>
    );
}
