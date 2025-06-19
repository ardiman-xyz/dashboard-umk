import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import FacultyRegionChart from '../../_components/FacultyRegionChart';

interface GenderDistribution {
    laki: number;
    perempuan: number;
    total: number;
}

interface ReligionData {
    name: string;
    value: number;
}

interface RegionData {
    name: string;
    value: number;
}

interface GpaStats {
    average_gpa: number;
    highest_gpa: number;
    lowest_gpa: number;
    students_above_3: number;
}

interface DepartmentDemographicsTabProps {
    regionDistribution: RegionData[];
    genderDistribution: GenderDistribution;
    religionDistribution: ReligionData[];
    gpaStats: GpaStats;
    totalStudents: number;
    departmentName: string;
}

export default function DepartmentDemographicsTab({
    regionDistribution,
    genderDistribution,
    religionDistribution,
    gpaStats,
    totalStudents,
    departmentName,
}: DepartmentDemographicsTabProps) {
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
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FacultyRegionChart regionDistribution={regionDistribution} facultyName={departmentName} />
                <Card>
                    <CardHeader>
                        <CardTitle>Ringkasan Demografi</CardTitle>
                        <CardDescription>Statistik demografis mahasiswa {departmentName}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm">Total Mahasiswa</span>
                                <span className="font-medium">{formatNumber(totalStudents)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Laki-laki</span>
                                <span className="font-medium">
                                    {formatNumber(genderDistribution.laki)} ({genderPercentage.male}%)
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Perempuan</span>
                                <span className="font-medium">
                                    {formatNumber(genderDistribution.perempuan)} ({genderPercentage.female}%)
                                </span>
                            </div>
                        </div>

                        <hr />

                        <div className="space-y-2">
                            <h4 className="font-medium">Agama Mayoritas</h4>
                            {religionDistribution.slice(0, 3).map((religion, index) => (
                                <div key={index} className="flex justify-between">
                                    <span className="text-sm">{religion.name}</span>
                                    <span className="font-medium">{formatNumber(religion.value)}</span>
                                </div>
                            ))}
                        </div>

                        <hr />

                        <div className="space-y-2">
                            <h4 className="font-medium">Statistik IPK</h4>
                            <div className="flex justify-between">
                                <span className="text-sm">IPK Tertinggi</span>
                                <span className="font-medium">{gpaStats.highest_gpa.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">IPK Terendah</span>
                                <span className="font-medium">{gpaStats.lowest_gpa.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Mahasiswa IPK ≥ 3.0</span>
                                <span className="font-medium">{gpaStats.students_above_3}%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
