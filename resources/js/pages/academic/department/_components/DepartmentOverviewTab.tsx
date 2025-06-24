import DepartmentGenderChart from '../../_components/DepartmentGenderChart';
import DepartmentYearDistributionChart from '../../_components/DepartmentYearDistributionChart';
import FacultyAgeChart from '../../_components/FacultyAgeChart';
import DepartmentReligion from './DepartmentReligion';

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
    departmentId: string; // Add this prop
    termYearId: string; // Add this prop
    studentStatus: string; // Add this prop
    onGenderClick?: (gender: 'laki' | 'perempuan') => void;
    onReligionClick?: (religion: string) => void; // Add religion click handler
}

export default function DepartmentOverviewTab({
    genderDistribution,
    yearDistribution,
    religionDistribution,
    ageDistribution,
    departmentName,
    departmentId, // Add this
    termYearId, // Add this
    studentStatus, // Add this
    onGenderClick,
    onReligionClick, // Add this
}: DepartmentOverviewTabProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <DepartmentGenderChart
                    genderDistribution={genderDistribution}
                    departmentName={departmentName}
                    departmentId={departmentId} // Pass departmentId
                    termYearId={termYearId} // Pass termYearId
                    studentStatus={studentStatus} // Pass studentStatus
                    onGenderClick={onGenderClick}
                />
                <DepartmentYearDistributionChart yearDistribution={yearDistribution} departmentName={departmentName} />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <DepartmentReligion
                    religionDistribution={religionDistribution}
                    departmentName={departmentName}
                    departmentId={departmentId} // Pass departmentId
                    termYearId={termYearId} // Pass termYearId
                    studentStatus={studentStatus} // Pass studentStatus
                    onReligionClick={onReligionClick} // Pass religion click handler
                />
                <FacultyAgeChart ageDistribution={ageDistribution} facultyName={departmentName} />
            </div>
        </div>
    );
}
