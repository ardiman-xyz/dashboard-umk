// types/academic.ts

export interface TrendData {
    value: string;
    type: 'up' | 'down' | 'neutral';
}

export interface ActiveStudentsData {
    total: string;
    trend: TrendData;
}

export interface AverageGpaData {
    value: string;
    trend: TrendData;
    term_info?: string;
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

export interface GpaDataPoint {
    semester: string;
    ipk: number;
    label: string;
}

export interface GpaTrendData {
    trend_data: GpaDataPoint[];
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

export interface GradeDistributionCategory {
    data: GradeData[];
    total_count: number;
    good_grade_percentage: number;
}

export interface GradeDistributionData {
    letter_grade: GradeDistributionCategory;
    detail_grade: GradeDistributionCategory;
}

export interface AcademicStats {
    activeStudents: ActiveStudentsData;
    avgGpa: AverageGpaData;
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
