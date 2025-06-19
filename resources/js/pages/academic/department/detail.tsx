import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Filter, MapPin, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';
import DepartmentGenderChart from '../_components/DepartmentGenderChart';
import DepartmentStudentsTable from '../_components/DepartmentStudentsTable';
import DepartmentYearDistributionChart from '../_components/DepartmentYearDistributionChart';
import FacultyAgeChart from '../_components/FacultyAgeChart';
import FacultyRegionChart from '../_components/FacultyRegionChart';
import FacultyReligionChart from '../_components/FacultyReligionChart';
import FacultyStudentTrendChart from '../_components/FacultyStudentTrendChart';

interface DepartmentInfo {
    Department_Id: string;
    Department_Name: string;
    Department_Acronym: string;
    Faculty_Name: string;
    Faculty_Acronym: string;
    Faculty_Id: string;
}

interface GenderDistribution {
    laki: number;
    perempuan: number;
    total: number;
}

interface ReligionData {
    name: string;
    value: number;
}

interface AgeData {
    age: string;
    value: number;
}

interface RegionData {
    name: string;
    value: number;
}

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

interface DepartmentDetailData {
    genderDistribution: GenderDistribution;
    religionDistribution: ReligionData[];
    ageDistribution: AgeData[];
    regionDistribution: RegionData[];
    studentTrend: StudentTrendData[];
    summaryStats: {
        total_students: number;
    };
    yearDistribution: YearDistributionData[];
    gpaStats: GpaStats;
}

interface PageProps {
    departmentInfo: DepartmentInfo;
    departmentDetail: DepartmentDetailData;
    filters: {
        currentTerm: {
            id: string;
            name: string;
        };
        availableTerms: Array<{
            id: string;
            name: string;
        }>;
    };
    termYearId: string;
    studentStatus: string;
    [key: string]: any;
}

export default function DepartmentStudentDetail() {
    const { departmentInfo, departmentDetail, filters, termYearId, studentStatus } = usePage<PageProps>().props;

    const [selectedTerm, setSelectedTerm] = useState(termYearId);
    const [selectedStatus, setSelectedStatus] = useState(studentStatus);
    const [isFiltering, setIsFiltering] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Akademik', href: '/academic' },
        { title: 'Mahasiswa', href: '/academic/students' },
        { title: departmentInfo.Faculty_Name, href: `/academic/faculty/${departmentInfo.Faculty_Id}` },
        { title: departmentInfo.Department_Name, href: '#' },
    ];

    const getPageTitle = () => {
        return `Detail Mahasiswa ${departmentInfo.Department_Name}`;
    };

    const getPageDescription = () => {
        const termName = filters.currentTerm?.name || 'Semua Tahun & Semester';
        const statusText = studentStatus === 'active' ? 'Mahasiswa Aktif' : 'Semua Mahasiswa';
        return `${statusText} - ${termName}`;
    };

    const handleBack = () => {
        router.visit(
            route('academic.faculty.detail', {
                facultyId: departmentInfo.Faculty_Id,
                term_year_id: termYearId,
                student_status: studentStatus,
            }),
        );
    };

    const handleFilterApply = () => {
        setIsFiltering(true);
        router.visit(
            route('academic.department.detail', {
                departmentId: departmentInfo.Department_Id,
                term_year_id: selectedTerm,
                student_status: selectedStatus,
            }),
            {
                preserveState: true,
                onFinish: () => setIsFiltering(false),
            },
        );
    };
    const formatNumber = (num: number | null | undefined): string => {
        if (num === null || num === undefined || isNaN(num)) {
            return '0';
        }
        return num.toLocaleString('id-ID');
    };

    const calculateGenderPercentage = () => {
        const total = departmentDetail.summaryStats.total_students;

        if (total === 0) return { male: 0, female: 0 };

        return {
            male: Math.round((departmentDetail.genderDistribution.laki / total) * 100),
            female: Math.round((departmentDetail.genderDistribution.perempuan / total) * 100),
        };
    };

    const genderPercentage = calculateGenderPercentage();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={getPageTitle()} />

            <div className="space-y-6 p-4">
                {/* Header Section */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={handleBack}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold md:text-3xl">{getPageTitle()}</h1>
                                <Badge variant="secondary" className="text-sm">
                                    {departmentInfo.Department_Acronym}
                                </Badge>
                                <Badge variant="outline" className="text-sm">
                                    {departmentInfo.Faculty_Acronym}
                                </Badge>
                            </div>
                            <p className="text-muted-foreground mt-1 text-sm">{getPageDescription()}</p>
                        </div>
                    </div>

                    {/* Filter Section */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Filter Data Mahasiswa
                            </CardTitle>
                            <CardDescription>Sesuaikan periode dan status mahasiswa untuk analisis yang lebih spesifik</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                                <div>
                                    <label className="mb-2 block text-sm font-medium">Tahun & Semester</label>
                                    <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Tahun & Semester" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Tahun & Semester</SelectItem>
                                            {filters.availableTerms.map((term) => (
                                                <SelectItem key={term.id} value={term.id}>
                                                    {term.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-medium">Status Mahasiswa</label>
                                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Pilih Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Mahasiswa</SelectItem>
                                            <SelectItem value="active">Mahasiswa Aktif</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-end">
                                    <Button onClick={handleFilterApply} disabled={isFiltering} className="w-max cursor-pointer">
                                        {isFiltering ? 'Loading...' : 'Terapkan Filter'}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Summary Stats Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <p className="text-muted-foreground text-sm font-medium">Total Mahasiswa</p>
                                    <p className="text-3xl font-bold">{formatNumber(departmentDetail.summaryStats.total_students)}</p>
                                    <p className="text-muted-foreground text-xs">
                                        {studentStatus === 'active' ? 'Mahasiswa aktif' : 'Seluruh mahasiswa'}
                                    </p>
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
                                    <p className="text-3xl font-bold">{departmentDetail.gpaStats.average_gpa.toFixed(2)}</p>
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
                                    <p className="text-3xl font-bold">{departmentDetail.gpaStats.students_above_3}%</p>
                                    <p className="text-muted-foreground text-xs">Mahasiswa berprestasi baik</p>
                                </div>
                                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="demographics">Demografi</TabsTrigger>
                        <TabsTrigger value="trends">Tren & Analisis</TabsTrigger>
                        <TabsTrigger value="students">Data Mahasiswa</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <DepartmentGenderChart
                                genderDistribution={departmentDetail.genderDistribution}
                                departmentName={departmentInfo.Department_Name}
                            />
                            <DepartmentYearDistributionChart
                                yearDistribution={departmentDetail.yearDistribution}
                                departmentName={departmentInfo.Department_Name}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FacultyReligionChart
                                religionDistribution={departmentDetail.religionDistribution}
                                facultyName={departmentInfo.Department_Name}
                            />
                            <FacultyAgeChart ageDistribution={departmentDetail.ageDistribution} facultyName={departmentInfo.Department_Name} />
                        </div>
                    </TabsContent>

                    {/* Demographics Tab */}
                    <TabsContent value="demographics" className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FacultyRegionChart
                                regionDistribution={departmentDetail.regionDistribution}
                                facultyName={departmentInfo.Department_Name}
                            />
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ringkasan Demografi</CardTitle>
                                    <CardDescription>Statistik demografis mahasiswa {departmentInfo.Department_Name}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm">Total Mahasiswa</span>
                                            <span className="font-medium">{formatNumber(departmentDetail.summaryStats.total_students)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Laki-laki</span>
                                            <span className="font-medium">
                                                {formatNumber(departmentDetail.genderDistribution.laki)} ({genderPercentage.male}%)
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Perempuan</span>
                                            <span className="font-medium">
                                                {formatNumber(departmentDetail.genderDistribution.perempuan)} ({genderPercentage.female}%)
                                            </span>
                                        </div>
                                    </div>

                                    <hr />

                                    <div className="space-y-2">
                                        <h4 className="font-medium">Agama Mayoritas</h4>
                                        {departmentDetail.religionDistribution.slice(0, 3).map((religion, index) => (
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
                                            <span className="font-medium">{departmentDetail.gpaStats.highest_gpa.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">IPK Terendah</span>
                                            <span className="font-medium">{departmentDetail.gpaStats.lowest_gpa.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Mahasiswa IPK ≥ 3.0</span>
                                            <span className="font-medium">{departmentDetail.gpaStats.students_above_3}%</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Trends Tab */}
                    <TabsContent value="trends" className="space-y-6">
                        <FacultyStudentTrendChart studentTrend={departmentDetail.studentTrend} facultyName={departmentInfo.Department_Name} />

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Insight Tren</CardTitle>
                                    <CardDescription>Analisis perkembangan mahasiswa {departmentInfo.Department_Name}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium">Angkatan Terbesar</h4>
                                            {departmentDetail.yearDistribution.slice(0, 3).map((year, index) => (
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
                                            <span>
                                                Pertahankan kualitas akademik dengan IPK rata-rata {departmentDetail.gpaStats.average_gpa.toFixed(2)}
                                            </span>
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
                    </TabsContent>

                    {/* Students Data Tab */}
                    <TabsContent value="students" className="space-y-6">
                        <DepartmentStudentsTable departmentId={departmentInfo.Department_Id} termYearId={termYearId} studentStatus={studentStatus} />
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
