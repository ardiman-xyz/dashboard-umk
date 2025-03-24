// types/stats.ts

export interface TrendData {
    value: string;
    type: 'up' | 'down' | 'neutral';
}

export interface AverageGpaData {
    value: string;
    trend: TrendData;
    term_info?: string; // Informasi semester, misalnya "Genap 2023/2024"
}

export interface TermInfo {
    id: string;
    name: string;
}

export interface ActiveStudentsData {
    total: string;
    trend: TrendData;
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
}

export interface AcademicPageProps {
    stats: AcademicStats;
    currentTerm?: TermInfo;
    availableTerms?: TermInfo[]; // Untuk dropdown pemilihan semester
}
