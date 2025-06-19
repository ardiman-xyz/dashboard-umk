import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, TrendingUp, Users } from 'lucide-react';
import FacultyStudentTrendChart from '../../_components/FacultyStudentTrendChart';

interface StudentTrendData {
    Term_Year_Id: string;
    Term_Year_Name: string;
    student_count: number;
}

interface YearDistributionData {
    year: string;
    student_count: number;
}

interface GpaStats {
    average_gpa: number;
    highest_gpa: number;
    lowest_gpa: number;
    students_above_3: number;
}

interface DepartmentTrendsTabProps {
    studentTrend: StudentTrendData[];
    yearDistribution: YearDistributionData[];
    gpaStats: GpaStats;
    departmentName: string;
}

export default function DepartmentTrendsTab({ studentTrend, yearDistribution, gpaStats, departmentName }: DepartmentTrendsTabProps) {
    const formatNumber = (num: number | null | undefined): string => {
        if (num === null || num === undefined || isNaN(num)) {
            return '0';
        }
        return num.toLocaleString('id-ID');
    };

    return (
        <div className="space-y-6">
            <FacultyStudentTrendChart studentTrend={studentTrend} facultyName={departmentName} />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Insight Tren</CardTitle>
                        <CardDescription>Analisis perkembangan mahasiswa {departmentName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h4 className="font-medium">Angkatan Terbesar</h4>
                                {yearDistribution.slice(0, 3).map((year, index) => (
                                    <div key={index} className="flex justify-between">
                                        <span className="text-sm">Angkatan {year.year}</span>
                                        <span className="font-medium">{formatNumber(year.student_count)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Rekomendasi</CardTitle>
                        <CardDescription>Saran berdasarkan analisis data program studi</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-2">
                                <div className="mt-0.5 rounded-full bg-green-100 p-1 text-green-600">
                                    <TrendingUp className="h-3 w-3" />
                                </div>
                                <span>Pertahankan kualitas akademik dengan IPK rata-rata {gpaStats.average_gpa.toFixed(2)}</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="mt-0.5 rounded-full bg-blue-100 p-1 text-blue-600">
                                    <Users className="h-3 w-3" />
                                </div>
                                <span>Fokus pada pemerataan gender dalam penerimaan mahasiswa baru</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <div className="mt-0.5 rounded-full bg-purple-100 p-1 text-purple-600">
                                    <MapPin className="h-3 w-3" />
                                </div>
                                <span>Tingkatkan promosi program studi ke daerah dengan potensi calon mahasiswa</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
