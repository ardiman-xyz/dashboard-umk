import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

// Import komponen elegan
import StudentAgeDistribution from './_components/StudentAgeDistribution';
import StudentDistribution from './_components/StudentDistribution';
import StudentGenderDistributionByFaculty from './_components/StudentGenderDistributionByFaculty';
import StudentMainStats from './_components/StudentMainStats';
import StudentRegionDistribution from './_components/StudentRegionDistribution';
import StudentReligionDistribution from './_components/StudentReligionDistribution';

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

        // Redirect dengan parameter baru
        router.visit(route('academic.student.index'), {
            data: {
                student_status: value,
                term_year_id: filters?.currentTerm?.id || 'all',
            },
            preserveState: true,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Mahasiswa" />

            <div className="mb-60 space-y-6 p-4">
                {/* Header and Navigation */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" size="icon" asChild>
                            <a href="/academic">
                                <ChevronLeft className="h-4 w-4" />
                            </a>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Data Mahasiswa</h1>
                            {filters?.currentTerm && (
                                <p className="text-muted-foreground text-sm">{isAllFilter ? 'Semua Tahun & Semester' : filters.currentTerm.name}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <Select value={currentStudentStatus} onValueChange={handleStudentStatusChange}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Mahasiswa</SelectItem>
                                <SelectItem value="active">Mahasiswa Aktif</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
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
