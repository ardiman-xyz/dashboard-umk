import { create } from 'zustand';

type Semester = 'Ganjil' | 'Genap';

interface AcademicYear {
    id: string;
    label: string;
}

interface DashboardState {
    academicYears: AcademicYear[];
    semesters: { id: Semester; label: string }[];

    selectedYear: string;
    selectedSemester: Semester | 'all';

    setSelectedYear: (year: string) => void;
    setSelectedSemester: (semester: Semester | 'all') => void;
    resetFilters: () => void;

    isLoading: boolean;
    setLoading: (status: boolean) => void;
}

const academicYearsData: AcademicYear[] = [
    { id: '2024-2025', label: '2024/2025' },
    { id: '2023-2024', label: '2023/2024' },
    { id: '2022-2023', label: '2022/2023' },
    { id: '2021-2022', label: '2021/2022' },
    { id: '2020-2021', label: '2020/2021' },
];

const semestersData = [
    { id: 'Ganjil' as Semester, label: 'Ganjil' },
    { id: 'Genap' as Semester, label: 'Genap' },
];

export const useDashboardStore = create<DashboardState>((set) => ({
    academicYears: academicYearsData,
    semesters: semestersData,

    selectedYear: 'all',
    selectedSemester: 'all',

    setSelectedYear: (year: string) => set({ selectedYear: year }),
    setSelectedSemester: (semester: Semester | 'all') => set({ selectedSemester: semester }),
    resetFilters: () => set({ selectedYear: 'all', selectedSemester: 'all' }),

    isLoading: false,
    setLoading: (status: boolean) => set({ isLoading: status }),
}));

// Helper function untuk mendapatkan ID periode berdasarkan kombinasi tahun dan semester
export const getPeriodId = (year: string, semester: Semester | 'all'): string => {
    if (year === 'all' && semester === 'all') return 'all';
    if (year === 'all') return `all-${semester}`;
    if (semester === 'all') return `${year}-all`;

    // Konversi semester ke kode
    const semesterCode = semester === 'Ganjil' ? '1' : '2';

    // Ambil tahun awal, contoh: dari "2024-2025" menjadi "2024"
    const yearStart = year.split('-')[0];

    return `${yearStart}-${semesterCode}`;
};
