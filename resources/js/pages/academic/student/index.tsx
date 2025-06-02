import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, usePage } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

// Import komponen elegan
import StudentAgeDistribution from './_components/StudentAgeDistribution';
import StudentDistribution from './_components/StudentDistribution';
import StudentGenderDistributionByFaculty from './_components/StudentGenderDistributionByFaculty';
import StudentMainStats from './_components/StudentMainStats';
import StudentRegionDistribution from './_components/StudentRegionDistribution';
import StudentReligionDistribution from './_components/StudentReligionDistribution';
// Import komponen filter yang sudah disederhanakan
import StudentAcademicFilter from './_components/StudentAcademicFilter';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Akademik',
        href: '/academic',
    },
    {
        title: 'Mahasiswa',
        href: '/academic/student',
    },
];

interface ReligionData {
    name: string;
    value: number;
}

interface FacultyData {
    faculty: string;
    faculty_acronym: string;
    faculty_id: string;
    current: number;
    previous: number;
    percent_change: number;
}

interface FacultyDistributionProps {
    distribution: FacultyData[];
    total_current: number;
    total_previous: number;
    percent_change: number;
}

interface GenderData {
    faculty: string;
    laki: number;
    perempuan: number;
}

interface AgeData {
    age: string;
    value: number;
}

interface RegionData {
    name: string;
    value: number;
}

interface StudentPageProps extends InertiaPageProps {
    facultyDistribution?: FacultyDistributionProps;
    genderDistribution?: GenderData[];
    religionDistribution?: ReligionData[];
    ageDistribution?: AgeData[];
    regionDistribution?: RegionData[];
    filters?: {
        currentTerm?: {
            id: string;
            name: string;
        };
        availableTerms?: Array<{
            id: string;
            name: string;
        }>;
    };
    studentStatus?: string;
}

const StudentDetailPage: React.FC<StudentPageProps> = ({
    facultyDistribution,
    genderDistribution,
    studentStatus,
    religionDistribution,
    ageDistribution,
    regionDistribution,
}) => {
    // Mendapatkan informasi filter dari page props
    const { filters } = usePage<StudentPageProps>().props;

    // State untuk filter status mahasiswa
    const [currentStudentStatus, setCurrentStudentStatus] = useState(studentStatus || 'all');

    // Tentukan apakah filter saat ini adalah 'all'
    const isAllFilter = filters?.currentTerm?.id === 'all' || !filters?.currentTerm?.id;

    // Handle perubahan filter status mahasiswa
    const handleStudentStatusChange = (value: string) => {
        setCurrentStudentStatus(value);
        // Tidak perlu redirect di sini karena akan di-handle oleh komponen filter
    };

    // Generate page title based on filters
    const getPageTitle = () => {
        return 'Data Mahasiswa';
    };

    // Generate page description based on filters
    const getPageDescription = () => {
        if (isAllFilter) {
            return 'Semua Tahun & Semester';
        }

        return filters?.currentTerm?.name || 'Analisis data mahasiswa';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={getPageTitle()} />

            <div className="mb-60 space-y-6 p-4">
                {/* Header and Navigation */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" size="icon" asChild>
                            <a href="/academic">
                                <ChevronLeft className="h-4 w-4" />
                            </a>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">{getPageTitle()}</h1>
                            <p className="text-muted-foreground text-sm">{getPageDescription()}</p>
                        </div>
                    </div>

                    {/* Simplified Academic Filter Component */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Filter Data Mahasiswa</CardTitle>
                            <CardDescription>Pilih periode dan status mahasiswa untuk analisis yang lebih spesifik</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <StudentAcademicFilter
                                currentTermId={filters?.currentTerm?.id || 'all'}
                                currentStudentStatus={currentStudentStatus}
                                availableTerms={filters?.availableTerms || []}
                                onStudentStatusChange={handleStudentStatusChange}
                            />
                        </CardContent>
                    </Card>
                </div>

                <StudentMainStats />

                {/* Distribusi Mahasiswa (Fakultas & Gender) */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        {/* Pass isAllFilter dan studentStatus prop ke StudentDistribution */}
                        <StudentDistribution
                            facultyDistribution={facultyDistribution}
                            isAllFilter={isAllFilter}
                            studentStatus={currentStudentStatus}
                        />
                    </div>
                    <div>
                        {/* Pass genderDistribution dengan props yang benar */}
                        <StudentGenderDistributionByFaculty
                            genderDistribution={genderDistribution}
                            studentStatus={currentStudentStatus}
                            isAllFilter={isAllFilter}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="h-full">
                        <StudentReligionDistribution
                            religionDistribution={religionDistribution}
                            studentStatus={currentStudentStatus}
                            isAllFilter={isAllFilter}
                        />
                    </div>
                    <div className="h-full">
                        <StudentAgeDistribution ageDistribution={ageDistribution} studentStatus={currentStudentStatus} isAllFilter={isAllFilter} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <StudentRegionDistribution
                        regionDistribution={regionDistribution}
                        studentStatus={currentStudentStatus}
                        isAllFilter={isAllFilter}
                    />
                </div>
            </div>
        </AppLayout>
    );
};

export default StudentDetailPage;
