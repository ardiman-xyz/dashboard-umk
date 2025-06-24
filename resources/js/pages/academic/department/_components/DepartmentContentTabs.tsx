import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DepartmentStudentsTable from '../../_components/DepartmentStudentsTable';
import DepartmentDemographicsTab from './DepartmentDemographicsTab';
import DepartmentOverviewTab from './DepartmentOverviewTab';
import DepartmentTrendsTab from './DepartmentTrendsTab';

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

interface DepartmentContentTabsProps {
    departmentDetail: DepartmentDetailData;
    departmentName: string;
    departmentId: string;
    termYearId: string;
    studentStatus: string;
    activeTab?: string;
    onTabChange?: (tab: string, genderFilter?: string, religionFilter?: string) => void;
    genderFilter?: string;
    religionFilter?: string; // Add religion filter prop
}

export default function DepartmentContentTabs({
    departmentDetail,
    departmentName,
    departmentId,
    termYearId,
    studentStatus,
    activeTab = 'overview',
    onTabChange,
    genderFilter,
    religionFilter, // Add religion filter
}: DepartmentContentTabsProps) {
    const handleGenderClick = (gender: 'laki' | 'perempuan') => {
        // Switch to students tab and set gender filter when gender is clicked
        if (onTabChange) {
            onTabChange('students', gender); // Pass gender as second parameter
        }
    };

    const handleReligionClick = (religion: string) => {
        // Switch to students tab and set religion filter when religion is clicked
        if (onTabChange) {
            onTabChange('students', undefined, religion); // Pass religion as third parameter
        }
    };

    return (
        <Tabs value={activeTab} onValueChange={(tab) => onTabChange && onTabChange(tab)} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="demographics">Demografi</TabsTrigger>
                <TabsTrigger value="trends">Tren & Analisis</TabsTrigger>
                <TabsTrigger value="students">Data Mahasiswa</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
                <DepartmentOverviewTab
                    genderDistribution={departmentDetail.genderDistribution}
                    yearDistribution={departmentDetail.yearDistribution}
                    religionDistribution={departmentDetail.religionDistribution}
                    ageDistribution={departmentDetail.ageDistribution}
                    departmentName={departmentName}
                    departmentId={departmentId} // Pass departmentId
                    termYearId={termYearId} // Pass termYearId
                    studentStatus={studentStatus} // Pass studentStatus
                    onGenderClick={handleGenderClick}
                    onReligionClick={handleReligionClick} // Add religion click handler
                />
            </TabsContent>

            {/* Demographics Tab */}
            <TabsContent value="demographics" className="space-y-6">
                <DepartmentDemographicsTab
                    regionDistribution={departmentDetail.regionDistribution}
                    genderDistribution={departmentDetail.genderDistribution}
                    religionDistribution={departmentDetail.religionDistribution}
                    gpaStats={departmentDetail.gpaStats}
                    totalStudents={departmentDetail.summaryStats.total_students}
                    departmentName={departmentName}
                />
            </TabsContent>

            {/* Trends Tab */}
            <TabsContent value="trends" className="space-y-6">
                <DepartmentTrendsTab
                    studentTrend={departmentDetail.studentTrend}
                    yearDistribution={departmentDetail.yearDistribution}
                    gpaStats={departmentDetail.gpaStats}
                    departmentName={departmentName}
                />
            </TabsContent>

            {/* Students Data Tab */}
            <TabsContent value="students" className="space-y-6">
                <DepartmentStudentsTable
                    departmentId={departmentId}
                    termYearId={termYearId}
                    studentStatus={studentStatus}
                    initialGenderFilter={genderFilter}
                    initialReligionFilter={religionFilter} // Pass religion filter
                />
            </TabsContent>
        </Tabs>
    );
}
