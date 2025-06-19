export interface LecturerRatioData {
    value: string;
    trend: TrendData;
    lecturer_count: number;
    student_count: number;
    additional_info?: string;
}

export interface TrendData {
    value: string;
    type: 'up' | 'down' | 'neutral';
}

export interface ActiveStudentsData {
    total: string;
    trend?: TrendData;
}

export interface IpkRange {
    '3.5-4.0': number;
    '3.0-3.49': number;
    '2.5-2.99': number;
    '2.0-2.49': number;
    '0-1.99': number;
}

export interface AverageGpaData {
    value: string;
    trend?: TrendData;
    term_info?: string;
    distribution?: IpkRange;
    good_gpa_percentage?: number;
    student_count?: number;
    additional_info?: string;
}

export interface FacultyData {
    faculty: string;
    faculty_id: string | number;
    current: number;
    previous: number;
    percent_change: number;
}

export interface FacultyDistribution {
    total_current: number;
    total_previous: number;
    percent_change: number;
    distribution: FacultyData[];
}

export interface GpaTrendItem {
    semester: string;
    ipk: number;
    label: string;
}

export interface GpaTrendData {
    trend_data: GpaTrendItem[];
    first_ipk: number;
    last_ipk: number;
    percent_change: number;
    years_count: number;
}

export interface GradeData {
    grade: string;
    count: number;
    percentage: number;
    color: string;
}

export interface GradeDistributionSummary {
    data: GradeData[];
    total_count: number;
    good_grade_percentage: number;
}

export interface GradeDistributionData {
    letter_grade: GradeDistributionSummary;
    detail_grade: GradeDistributionSummary;
}

export interface TermInfo {
    id: string;
    name: string;
}

export interface LecturerCountData {
    total: string;
    trend?: TrendData;
    distribution?: Array<{
        type: string;
        count: number;
        percentage: number;
    }>;
    additional_info?: string;
}

export interface AcademicStats {
    activeStudents: ActiveStudentsData;
    lecturerRatio: LecturerRatioData;
    avgGpa: AverageGpaData;
    lecturerCount: LecturerCountData;
    graduationRate?: {
        value: string;
        trend: TrendData;
    };
    facultyRatio?: {
        value: string;
        trend: TrendData;
    };
    problemStudents?: {
        total: string;
        trend: TrendData;
    };
    facultyDistribution?: FacultyDistribution;
    gpaTrend?: GpaTrendData;
    gradeDistribution?: GradeDistributionData;
}

export interface DepartmentInfo {
    Department_Id: string;
    Department_Name: string;
    Department_Acronym: string;
    Faculty_Name: string;
    Faculty_Acronym: string;
    Faculty_Id: string;
}

export interface GenderDistribution {
    laki: number;
    perempuan: number;
    total: number;
}

export interface ReligionData {
    name: string;
    value: number;
}

export interface AgeData {
    age: string;
    value: number;
}

export interface RegionData {
    name: string;
    value: number;
}

export interface StudentTrendData {
    Term_Year_Id: string;
    Term_Year_Name: string;
    student_count: number;
}

export interface YearDistributionData {
    year: string;
    student_count: number;
}

export interface GpaStats {
    average_gpa: number;
    highest_gpa: number;
    lowest_gpa: number;
    students_above_3: number;
}

export interface DepartmentDetailData {
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

export interface FilterOption {
    id: string;
    name: string;
}

export interface DepartmentPageProps {
    departmentInfo: DepartmentInfo;
    departmentDetail: DepartmentDetailData;
    filters: {
        currentTerm: {
            id: string;
            name: string;
        };
        availableTerms: FilterOption[];
    };
    termYearId: string;
    studentStatus: string;
    [key: string]: any;
}
