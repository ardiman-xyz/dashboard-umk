import { Head } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';
import React from 'react';

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

interface PageProps {
    facultyDistribution?: FacultyDistributionProps;
}

const StudentDetailPage: React.FC<PageProps> = ({ facultyDistribution }) => {
    console.info(facultyDistribution);

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
                        </div>
                    </div>

                    <div>
                        <Select defaultValue="faculty">
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Pilih" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua</SelectItem>
                                <SelectItem value="faculty">Fakultas</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <StudentMainStats />

                {/* Distribusi Mahasiswa (Fakultas & Gender) */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                        <StudentDistribution facultyDistribution={facultyDistribution} />
                    </div>
                    <div>
                        <StudentGenderDistributionByFaculty />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="h-full">
                        <StudentReligionDistribution />
                    </div>
                    <div className="h-full">
                        <StudentAgeDistribution />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <StudentRegionDistribution />
                </div>
            </div>
        </AppLayout>
    );
};

export default StudentDetailPage;
