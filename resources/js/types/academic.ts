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
