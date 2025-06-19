import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { DepartmentPageProps } from '@/types/academic';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import DepartmentContentTabs from './_components/DepartmentContentTabs';
import DepartmentFilter from './_components/DepartmentFilter';
import DepartmentHeader from './_components/DepartmentHeader';
import DepartmentStatsCards from './_components/DepartmentStatsCards';

export default function DepartmentStudentDetail() {
    const { departmentInfo, departmentDetail, filters, termYearId, studentStatus } = usePage<DepartmentPageProps>().props;
    const [isFiltering, setIsFiltering] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Akademik', href: '/academic' },
        { title: 'Mahasiswa', href: '/academic/students' },
        { title: departmentInfo.Faculty_Name, href: `/academic/faculty/${departmentInfo.Faculty_Id}` },
        { title: departmentInfo.Department_Name, href: '#' },
    ];

    const getPageTitle = () => `Detail Mahasiswa ${departmentInfo.Department_Name}`;

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

    const handleFilterApply = (selectedTerm: string, selectedStatus: string) => {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={getPageTitle()} />

            <div className="space-y-6 p-4">
                {/* Header Section */}
                <div className="flex flex-col gap-4">
                    <DepartmentHeader
                        departmentInfo={departmentInfo}
                        pageTitle={getPageTitle()}
                        pageDescription={getPageDescription()}
                        onBack={handleBack}
                    />

                    <DepartmentFilter
                        availableTerms={filters.availableTerms}
                        initialTermId={termYearId}
                        initialStatus={studentStatus}
                        onFilterApply={handleFilterApply}
                        isFiltering={isFiltering}
                    />
                </div>

                <DepartmentStatsCards
                    totalStudents={departmentDetail.summaryStats.total_students}
                    genderDistribution={departmentDetail.genderDistribution}
                    gpaStats={departmentDetail.gpaStats}
                    studentStatus={studentStatus}
                />

                <DepartmentContentTabs
                    departmentDetail={departmentDetail}
                    departmentName={departmentInfo.Department_Name}
                    departmentId={departmentInfo.Department_Id}
                    termYearId={termYearId}
                    studentStatus={studentStatus}
                />
            </div>
        </AppLayout>
    );
}
