import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import { ArrowLeft, BookOpen, Filter, MapPin, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import FacultyAgeChart from './_components/FacultyAgeChart';
import FacultyDepartmentChart from './_components/FacultyDepartmentChart';
import FacultyGenderChart from './_components/FacultyGenderChart';
import FacultyRegionChart from './_components/FacultyRegionChart';
import FacultyReligionChart from './_components/FacultyReligionChart';
import FacultyStudentTrendChart from './_components/FacultyStudentTrendChart';
import FacultyStudentsTable from './_components/FacultyStudentsTable';

interface FacultyInfo {
    Faculty_Id: string;
    Faculty_Name: string;
    Faculty_Acronym: string;
}

interface DepartmentStat {
    Department_Id: string;
    Department_Name: string;
    Department_Acronym: string;
    student_count: number;
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

interface FacultyDetailData {
    departmentStats: DepartmentStat[];
    genderDistribution: GenderDistribution;
    religionDistribution: ReligionData[];
    ageDistribution: AgeData[];
    regionDistribution: RegionData[];
    studentTrend: StudentTrendData[];
    summaryStats: {
        total_students: number;
        total_departments: number;
    };
}

interface PageProps {
    facultyInfo: FacultyInfo;
    facultyDetail: FacultyDetailData;
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

export default function FacultyStudentDetail() {
    const { facultyInfo, facultyDetail, filters, termYearId, studentStatus } = usePage<PageProps>().props;

    const [selectedTerm, setSelectedTerm] = useState(termYearId);
    const [selectedStatus, setSelectedStatus] = useState(studentStatus);
    const [isFiltering, setIsFiltering] = useState(false);

    // Get initial values from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get('tab') || 'overview';
    const initialGenderFilter = urlParams.get('gender') || '';
    const initialReligionFilter = urlParams.get('religion') || '';
    const initialAgeFilter = urlParams.get('age') || '';

    const [activeTab, setActiveTab] = useState(initialTab);
    const [genderFilter, setGenderFilter] = useState<string>(initialGenderFilter);
    const [religionFilter, setReligionFilter] = useState<string>(initialReligionFilter);
    const [ageFilter, setAgeFilter] = useState<string>(initialAgeFilter);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Akademik', href: '/academic' },
        { title: 'Mahasiswa', href: '/academic/students' },
        { title: facultyInfo.Faculty_Name, href: '#' },
    ];

    const getPageTitle = () => {
        return `Detail Mahasiswa ${facultyInfo.Faculty_Name}`;
    };

    const getPageDescription = () => {
        const termName = filters.currentTerm?.name || 'Semua Tahun & Semester';
        const statusText = studentStatus === 'active' ? 'Mahasiswa Aktif' : 'Semua Mahasiswa';
        return `${statusText} - ${termName}`;
    };

    const handleBack = () => {
        router.visit(
            route('academic.student.index', {
                term_year_id: termYearId,
                student_status: studentStatus,
            }),
        );
    };

    const handleFilterApply = () => {
        setIsFiltering(true);

        // Preserve current URL parameters
        const currentParams = new URLSearchParams(window.location.search);
        const queryParams: any = {
            facultyId: facultyInfo.Faculty_Id,
            term_year_id: selectedTerm,
            student_status: selectedStatus,
        };

        // Add current URL params to preserve tab, gender, religion, and age filter
        if (currentParams.get('tab')) {
            queryParams.tab = currentParams.get('tab');
        }
        if (currentParams.get('gender')) {
            queryParams.gender = currentParams.get('gender');
        }
        if (currentParams.get('religion')) {
            queryParams.religion = currentParams.get('religion');
        }
        if (currentParams.get('age')) {
            queryParams.age = currentParams.get('age');
        }

        router.visit(route('academic.faculty.detail', queryParams), {
            preserveState: true,
            onFinish: () => setIsFiltering(false),
        });
    };

    const updateURL = (tab: string, gender?: string, religion?: string, age?: string) => {
        const url = new URL(window.location.href);

        // Update tab parameter
        if (tab !== 'overview') {
            url.searchParams.set('tab', tab);
        } else {
            url.searchParams.delete('tab');
        }

        // Update gender parameter
        if (gender && gender !== '') {
            url.searchParams.set('gender', gender);
        } else {
            url.searchParams.delete('gender');
        }

        // Update religion parameter
        if (religion && religion !== '') {
            url.searchParams.set('religion', religion);
        } else {
            url.searchParams.delete('religion');
        }

        // Update age parameter
        if (age && age !== '') {
            url.searchParams.set('age', age);
        } else {
            url.searchParams.delete('age');
        }

        // Update URL without page reload
        window.history.replaceState({}, '', url.toString());
    };

    const handleTabChange = (tab: string, genderFilterParam?: string, religionFilterParam?: string, ageFilterParam?: string) => {
        setActiveTab(tab);

        let newGenderFilter = genderFilter;
        let newReligionFilter = religionFilter;
        let newAgeFilter = ageFilter;

        if (genderFilterParam) {
            newGenderFilter = genderFilterParam;
            setGenderFilter(genderFilterParam);
        } else if (tab !== 'students') {
            newGenderFilter = '';
            setGenderFilter('');
        }

        if (religionFilterParam) {
            newReligionFilter = religionFilterParam;
            setReligionFilter(religionFilterParam);
        } else if (tab !== 'students') {
            newReligionFilter = '';
            setReligionFilter('');
        }

        if (ageFilterParam) {
            newAgeFilter = ageFilterParam;
            setAgeFilter(ageFilterParam);
        } else if (tab !== 'students') {
            newAgeFilter = '';
            setAgeFilter('');
        }

        updateURL(tab, newGenderFilter, newReligionFilter, newAgeFilter);
    };

    const handleGenderClick = (gender: 'laki' | 'perempuan') => {
        // Switch to students tab and set gender filter when gender is clicked
        handleTabChange('students', gender);
    };

    const handleReligionClick = (religion: string) => {
        // Switch to students tab and set religion filter when religion is clicked
        handleTabChange('students', undefined, religion);
    };

    const handleAgeClick = (age: string) => {
        // Switch to students tab and set age filter when age is clicked
        handleTabChange('students', undefined, undefined, age);
    };

    // Handle browser back/forward navigation
    useEffect(() => {
        const handlePopState = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const tabFromUrl = urlParams.get('tab') || 'overview';
            const genderFromUrl = urlParams.get('gender') || '';
            const religionFromUrl = urlParams.get('religion') || '';
            const ageFromUrl = urlParams.get('age') || '';

            setActiveTab(tabFromUrl);
            setGenderFilter(genderFromUrl);
            setReligionFilter(religionFromUrl);
            setAgeFilter(ageFromUrl);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const formatNumber = (num: number | null | undefined): string => {
        if (num === null || num === undefined || isNaN(num)) {
            return '0';
        }
        return num.toLocaleString('id-ID');
    };

    const calculateGenderPercentage = () => {
        const total = facultyDetail.genderDistribution.total;
        if (total === 0) return { male: 0, female: 0 };

        return {
            male: Math.round((facultyDetail.genderDistribution.laki / total) * 100),
            female: Math.round((facultyDetail.genderDistribution.perempuan / total) * 100),
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
                                    {facultyInfo.Faculty_Acronym}
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
                                    <p className="text-3xl font-bold">{formatNumber(facultyDetail.summaryStats.total_students)}</p>
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
                                    <p className="text-muted-foreground text-sm font-medium">Program Studi</p>
                                    <p className="text-3xl font-bold">{facultyDetail.summaryStats.total_departments}</p>
                                    <p className="text-muted-foreground text-xs">Total program studi</p>
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
                                    <p className="text-muted-foreground text-sm font-medium">Tren Semester</p>
                                    <p className="text-3xl font-bold">
                                        {facultyDetail.studentTrend.length > 0 ? facultyDetail.studentTrend.length : 0}
                                    </p>
                                    <p className="text-muted-foreground text-xs">Data semester tersedia</p>
                                </div>
                                <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                                    <TrendingUp className="h-5 w-5" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Tabs */}
                <Tabs value={activeTab} onValueChange={(tab) => handleTabChange(tab)} className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="demographics">Demografi</TabsTrigger>
                        <TabsTrigger value="trends">Tren & Analisis</TabsTrigger>
                        <TabsTrigger value="students">Data Mahasiswa</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FacultyDepartmentChart departmentStats={facultyDetail.departmentStats} facultyName={facultyInfo.Faculty_Name} />
                            <FacultyGenderChart
                                genderDistribution={facultyDetail.genderDistribution}
                                facultyName={facultyInfo.Faculty_Name}
                                facultyId={facultyInfo.Faculty_Id}
                                termYearId={termYearId}
                                studentStatus={studentStatus}
                                onGenderClick={handleGenderClick}
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FacultyReligionChart
                                religionDistribution={facultyDetail.religionDistribution}
                                facultyName={facultyInfo.Faculty_Name}
                                facultyId={facultyInfo.Faculty_Id} // ADD this line
                                termYearId={termYearId} // ADD this line
                                studentStatus={studentStatus} // ADD this line
                                onReligionClick={handleReligionClick} // ADD this line
                            />
                            <FacultyAgeChart
                                ageDistribution={facultyDetail.ageDistribution}
                                facultyName={facultyInfo.Faculty_Name}
                                facultyId={facultyInfo.Faculty_Id} // ADD this line
                                termYearId={termYearId} // ADD this line
                                studentStatus={studentStatus} // ADD this line
                                onAgeClick={handleAgeClick} // ADD this line
                            />
                        </div>
                    </TabsContent>

                    {/* Demographics Tab */}
                    <TabsContent value="demographics" className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <FacultyRegionChart regionDistribution={facultyDetail.regionDistribution} facultyName={facultyInfo.Faculty_Name} />
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ringkasan Demografi</CardTitle>
                                    <CardDescription>Statistik demografis mahasiswa {facultyInfo.Faculty_Name}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-sm">Total Mahasiswa</span>
                                            <span className="font-medium">{formatNumber(facultyDetail.summaryStats.total_students)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Laki-laki</span>
                                            <span className="font-medium">
                                                {formatNumber(facultyDetail.genderDistribution.laki)} ({genderPercentage.male}%)
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm">Perempuan</span>
                                            <span className="font-medium">
                                                {formatNumber(facultyDetail.genderDistribution.perempuan)} ({genderPercentage.female}%)
                                            </span>
                                        </div>
                                    </div>

                                    <hr />

                                    <div className="space-y-2">
                                        <h4 className="font-medium">Agama Mayoritas</h4>
                                        {facultyDetail.religionDistribution.slice(0, 3).map((religion, index) => (
                                            <div key={index} className="flex justify-between">
                                                <span className="text-sm">{religion.name}</span>
                                                <span className="font-medium">{formatNumber(religion.value)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Trends Tab */}
                    <TabsContent value="trends" className="space-y-6">
                        <FacultyStudentTrendChart studentTrend={facultyDetail.studentTrend} facultyName={facultyInfo.Faculty_Name} />

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Insight Tren</CardTitle>
                                    <CardDescription>Analisis perkembangan mahasiswa {facultyInfo.Faculty_Name}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <h4 className="font-medium">Program Studi Terbesar</h4>
                                            {facultyDetail.departmentStats.slice(0, 3).map((dept, index) => (
                                                <div key={index} className="flex justify-between">
                                                    <span className="text-sm">{dept.Department_Name}</span>
                                                    <span className="font-medium">{formatNumber(dept.student_count)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Rekomendasi</CardTitle>
                                    <CardDescription>Saran berdasarkan analisis data</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex items-start gap-2">
                                            <div className="mt-0.5 rounded-full bg-green-100 p-1 text-green-600">
                                                <TrendingUp className="h-3 w-3" />
                                            </div>
                                            <span>Fokus pada pengembangan program studi yang memiliki peminat tinggi</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="mt-0.5 rounded-full bg-blue-100 p-1 text-blue-600">
                                                <Users className="h-3 w-3" />
                                            </div>
                                            <span>Pertimbangkan keseimbangan gender dalam strategi penerimaan</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="mt-0.5 rounded-full bg-purple-100 p-1 text-purple-600">
                                                <MapPin className="h-3 w-3" />
                                            </div>
                                            <span>Ekspansi promosi ke daerah dengan potensi calon mahasiswa tinggi</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Students Data Tab */}
                    <TabsContent value="students" className="space-y-6">
                        <FacultyStudentsTable
                            facultyId={facultyInfo.Faculty_Id}
                            termYearId={termYearId}
                            studentStatus={studentStatus}
                            initialGenderFilter={genderFilter}
                            initialReligionFilter={religionFilter}
                            initialAgeFilter={ageFilter}
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
