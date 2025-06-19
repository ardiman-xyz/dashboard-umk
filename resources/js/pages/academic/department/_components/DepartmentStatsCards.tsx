import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, TrendingUp, Users } from 'lucide-react';

interface GenderDistribution {
    laki: number;
    perempuan: number;
    total: number;
}

interface GpaStats {
    average_gpa: number;
    highest_gpa: number;
    lowest_gpa: number;
    students_above_3: number;
}

interface DepartmentStatsCardsProps {
    totalStudents: number;
    genderDistribution: GenderDistribution;
    gpaStats: GpaStats;
    studentStatus: string;
}

export default function DepartmentStatsCards({ totalStudents, genderDistribution, gpaStats, studentStatus }: DepartmentStatsCardsProps) {
    const formatNumber = (num: number | null | undefined): string => {
        if (num === null || num === undefined || isNaN(num)) {
            return '0';
        }
        return num.toLocaleString('id-ID');
    };

    const calculateGenderPercentage = () => {
        if (totalStudents === 0) return { male: 0, female: 0 };

        return {
            male: Math.round((genderDistribution.laki / totalStudents) * 100),
            female: Math.round((genderDistribution.perempuan / totalStudents) * 100),
        };
    };

    const genderPercentage = calculateGenderPercentage();

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-muted-foreground text-sm font-medium">Total Mahasiswa</p>
                            <p className="text-3xl font-bold">{formatNumber(totalStudents)}</p>
                            <p className="text-muted-foreground text-xs">{studentStatus === 'active' ? 'Mahasiswa aktif' : 'Seluruh mahasiswa'}</p>
                        </div>
                        <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-muted-foreground text-sm font-medium">Rasio L : P</p>
                            <p className="text-3xl font-bold">
                                {genderPercentage.male}% : {genderPercentage.female}%
                            </p>
                            <p className="text-muted-foreground text-xs">Distribusi jenis kelamin</p>
                        </div>
                        <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                            <Users className="h-5 w-5" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-muted-foreground text-sm font-medium">Rata-rata IPK</p>
                            <p className="text-3xl font-bold">{gpaStats.average_gpa.toFixed(2)}</p>
                            <p className="text-muted-foreground text-xs">Indeks Prestasi Kumulatif</p>
                        </div>
                        <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                            <BookOpen className="h-5 w-5" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <p className="text-muted-foreground text-sm font-medium">IPK ≥ 3.0</p>
                            <p className="text-3xl font-bold">{gpaStats.students_above_3}%</p>
                            <p className="text-muted-foreground text-xs">Mahasiswa berprestasi baik</p>
                        </div>
                        <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                            <TrendingUp className="h-5 w-5" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
