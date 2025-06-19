import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { DepartmentPageProps } from '@/types/academic';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import DepartmentContentTabs from './_components/DepartmentContentTabs';
import DepartmentFilter from './_components/DepartmentFilter';
import DepartmentHeader from './_components/DepartmentHeader';
import DepartmentStatsCards from './_components/DepartmentStatsCards';

export default function DepartmentStudentDetail() {
    const { departmentInfo, departmentDetail, filters, termYearId, studentStatus } = usePage<DepartmentPageProps>().props;
    const [isFiltering, setIsFiltering] = useState(false);

    // Get initial values from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const initialTab = urlParams.get('tab') || 'overview';
    const initialGenderFilter = urlParams.get('gender') || '';

    const [activeTab, setActiveTab] = useState(initialTab);
    const [genderFilter, setGenderFilter] = useState<string>(initialGenderFilter);

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

        // Preserve current URL parameters
        const currentParams = new URLSearchParams(window.location.search);
        const queryParams: any = {
            departmentId: departmentInfo.Department_Id,
            term_year_id: selectedTerm,
            student_status: selectedStatus,
        };

        // Add current URL params to preserve tab and gender filter
        if (currentParams.get('tab')) {
            queryParams.tab = currentParams.get('tab');
        }
        if (currentParams.get('gender')) {
            queryParams.gender = currentParams.get('gender');
        }

        router.visit(route('academic.department.detail', queryParams), {
            preserveState: true,
            onFinish: () => setIsFiltering(false),
        });
    };

    const updateURL = (tab: string, gender?: string) => {
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

        // Update URL without page reload
        window.history.replaceState({}, '', url.toString());
    };

    const handleTabChange = (tab: string, genderFilterParam?: string) => {
        setActiveTab(tab);

        let newGenderFilter = genderFilter;

        if (genderFilterParam) {
            newGenderFilter = genderFilterParam;
            setGenderFilter(genderFilterParam);
        } else if (tab !== 'students') {
            newGenderFilter = '';
            setGenderFilter('');
        }

        updateURL(tab, newGenderFilter);
    };

    // Handle browser back/forward navigation
    useEffect(() => {
        const handlePopState = () => {
            const urlParams = new URLSearchParams(window.location.search);
            const tabFromUrl = urlParams.get('tab') || 'overview';
            const genderFromUrl = urlParams.get('gender') || '';

            setActiveTab(tabFromUrl);
            setGenderFilter(genderFromUrl);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

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
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    genderFilter={genderFilter}
                />
            </div>
        </AppLayout>
    );
}
