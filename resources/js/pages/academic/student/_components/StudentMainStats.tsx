// StudentMainStats.tsx
// Simpan di: pages/academic/student/_components/StudentMainStats.tsx

import { Card, CardContent } from '@/components/ui/card';
import { Award, BookOpen, TrendingUp, Users } from 'lucide-react';
import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: React.ReactNode;
    trendValue?: string;
    trendType?: 'up' | 'down' | 'neutral';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon, trendValue, trendType }) => {
    return (
        <Card className="rounded-lg border shadow-sm">
            <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-muted-foreground text-sm font-medium">{title}</p>
                        <p className="text-3xl font-bold">{value}</p>
                        <p className="text-muted-foreground text-xs">{description}</p>
                    </div>
                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">{icon}</div>
                </div>

                {trendValue && (
                    <div className="mt-3 flex items-center text-xs">
                        {trendType === 'up' ? (
                            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                        ) : trendType === 'down' ? (
                            <TrendingUp className="mr-1 h-3 w-3 rotate-180 text-red-500" />
                        ) : null}
                        <span className={trendType === 'up' ? 'text-green-500' : trendType === 'down' ? 'text-red-500' : ''}>{trendValue}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const StudentMainStats: React.FC = () => {
    // Data dummy untuk statistik
    const stats = {
        totalStudents: '24.267',
        graduationRate: '76%',
        averageGpa: '3,42',
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold">Statistik Utama Mahasiswa</h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Card Total Mahasiswa */}
                <StatCard
                    title="Total Mahasiswa"
                    value={stats.totalStudents}
                    description="Mahasiswa aktif terdaftar semester ini"
                    icon={<Users className="h-5 w-5" />}
                    trendValue="3,5% dari semester sebelumnya"
                    trendType="up"
                />

                {/* Card Persentase Kelulusan */}
                <StatCard
                    title="Persentase Kelulusan"
                    value={stats.graduationRate}
                    description="Mahasiswa lulus tepat waktu"
                    icon={<Award className="h-5 w-5" />}
                    trendValue="2,1% dari tahun lalu"
                    trendType="up"
                />

                {/* Card Rata-rata IPK */}
                <StatCard
                    title="Rata-rata IPK"
                    value={stats.averageGpa}
                    description="Indeks Prestasi Kumulatif"
                    icon={<BookOpen className="h-5 w-5" />}
                    trendValue="0,05 dari semester lalu"
                    trendType="up"
                />
            </div>
        </div>
    );
};

export default StudentMainStats;
