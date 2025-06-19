import DepartmentGenderChart from '../../_components/DepartmentGenderChart';
import DepartmentYearDistributionChart from '../../_components/DepartmentYearDistributionChart';
import FacultyAgeChart from '../../_components/FacultyAgeChart';
import FacultyReligionChart from '../../_components/FacultyReligionChart';

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

interface YearDistributionData {
    year: string;
    student_count: number;
}

interface DepartmentOverviewTabProps {
    genderDistribution: GenderDistribution;
    yearDistribution: YearDistributionData[];
    religionDistribution: ReligionData[];
    ageDistribution: AgeData[];
    departmentName: string;
}

export default function DepartmentOverviewTab({
    genderDistribution,
    yearDistribution,
    religionDistribution,
    ageDistribution,
    departmentName,
}: DepartmentOverviewTabProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <DepartmentGenderChart genderDistribution={genderDistribution} departmentName={departmentName} />
                <DepartmentYearDistributionChart yearDistribution={yearDistribution} departmentName={departmentName} />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FacultyReligionChart religionDistribution={religionDistribution} facultyName={departmentName} />
                <FacultyAgeChart ageDistribution={ageDistribution} facultyName={departmentName} />
            </div>
        </div>
    );
}
