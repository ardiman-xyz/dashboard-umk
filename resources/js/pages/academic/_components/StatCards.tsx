// resources/js/pages/academic/_components/StatCards.tsx
import { Card, CardContent } from '@/components/ui/card';
import { AcademicStats } from '@/types/academic';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { router, usePage } from '@inertiajs/react';
import { BookOpen, ChevronRight, GraduationCap, TrendingDown, TrendingUp, Users } from 'lucide-react';
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
    showTrend?: boolean;
}

interface StatCardsProps {
    stats: AcademicStats;
    currentTerm?: any;
}

// Interface untuk mendapatkan filters dari page props
interface CustomPageProps extends InertiaPageProps {
    filters?: {
        currentTerm?: any;
    };
    [key: string]: any; // Tambahkan index signature untuk tipe string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon, trend, detailPath, termInfo, showTrend = true }) => {
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

                {showTrend && trend && (
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
    // Menggunakan usePage untuk mendapatkan filters jika currentTerm tidak diberikan langsung
    const pageProps = usePage<CustomPageProps>().props;
    const effectiveCurrentTerm = currentTerm || pageProps.filters?.currentTerm || { id: 'all', name: 'Semua Tahun & Semester' };

    // Cek apakah filter adalah 'all' atau filter spesifik
    const isAllFilter = effectiveCurrentTerm?.id === 'all';

    console.info('Current Term:', effectiveCurrentTerm);

    // Menggunakan data dari props
    const cardData = [
        {
            title: isAllFilter ? 'Total Mahasiswa' : 'Total Mahasiswa Aktif',
            value: stats.activeStudents.total,
            description: isAllFilter ? 'Seluruh mahasiswa terdaftar' : 'Mahasiswa terdaftar semester ini',
            icon: <Users className="h-5 w-5" />,
            detailPath: route('academic.student.index'),
            trend: stats.activeStudents.trend,
            termInfo: isAllFilter ? undefined : effectiveCurrentTerm?.name,
            showTrend: !isAllFilter, // Tampilkan trend hanya jika bukan 'all'
        },
        {
            title: 'Rata-rata IPK',
            value: stats.avgGpa.value,
            description: isAllFilter ? 'IPK rata-rata seluruh mahasiswa' : 'Indeks Prestasi Kumulatif',
            icon: <BookOpen className="h-5 w-5" />,
            detailPath: route('academic.student.index'),
            trend: isAllFilter
                ? stats.avgGpa.good_gpa_percentage
                    ? {
                          value: `${stats.avgGpa.good_gpa_percentage}% mahasiswa IPK ≥ 3.0`,
                          type: 'neutral' as const,
                      }
                    : null
                : stats.avgGpa.trend,
            termInfo: stats.avgGpa.term_info || (isAllFilter ? undefined : effectiveCurrentTerm?.name),
        },

        {
            title: 'Rasio Dosen-Mahasiswa',
            value: stats.lecturerRatio.value,
            description: isAllFilter
                ? `Total ${stats.lecturerRatio.lecturer_count} dosen & ${stats.lecturerRatio.student_count} mahasiswa`
                : `${stats.lecturerRatio.lecturer_count} dosen & ${stats.lecturerRatio.student_count} mahasiswa`,
            icon: <GraduationCap className="h-5 w-5" />,
            detailPath: route('academic.student.index'),
            trend: stats.lecturerRatio.trend,
            termInfo:
                isAllFilter && stats.lecturerRatio.additional_info
                    ? stats.lecturerRatio.additional_info
                    : isAllFilter
                      ? undefined
                      : effectiveCurrentTerm?.name,
        },
        {
            title: 'Jumlah Dosen',
            value: stats.lecturerCount.total,
            description: 'Total dosen aktif',
            icon: <GraduationCap className="h-5 w-5" />,
            detailPath: route('academic.student.index'),
            trend: null, // Tidak menampilkan trend
            termInfo: stats.lecturerCount.additional_info,
            showTrend: false, // Tidak perlu menampilkan trend area
        },
    ];

    return (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4 lg:grid-cols-4">
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
                    showTrend={card.showTrend !== false}
                />
            ))}
        </div>
    );
}
