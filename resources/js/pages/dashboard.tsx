// Dashboard.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { useDashboardStore } from '@/store/dashboardStore';
import { Award, BookOpen, Briefcase, DollarSign, GraduationCap, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { AnnouncementPanel } from './_components/AnnouncementPanel';
import { DashboardFilter } from './_components/DashboardFilter';
import { FacultyChart } from './_components/FacultyChart';
import { GradRateChart } from './_components/GradRateChart';
import { PopularCoursesTable } from './_components/PopularCoursesTable';
import { StatsCard } from './_components/StatsCard';
import { StatusPieChart } from './_components/StatusPieChart';

export interface StudentByFaculty {
    name: string;
    count: number;
}

export interface StudentByStatus {
    status: string;
    count: number;
    color: string;
}

export interface GradRateData {
    year: string;
    onTime: number;
    delayed: number;
}

export interface DashboardData {
    totalStudents: number;
    totalTeachers: number;
    graduationRate: number;
    averageGpa: number;
    employmentRate: number;
    scholarship: string;
    studentsByFaculty: StudentByFaculty[];
    studentsByStatus: StudentByStatus[];
    gradRateData: GradRateData[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

const periodData = {
    all: {
        totalStudents: 12458,
        totalTeachers: 842,
        graduationRate: 82,
        averageGpa: 3.42,
        employmentRate: 87,
        scholarship: 'Rp 2.4M',
        studentsByFaculty: [
            { name: 'Teknik', count: 3245 },
            { name: 'Ekonomi', count: 2876 },
            { name: 'MIPA', count: 1934 },
            { name: 'Kedokteran', count: 1568 },
            { name: 'Humaniora', count: 1842 },
            { name: 'Hukum', count: 993 },
        ],
        studentsByStatus: [
            { status: 'Aktif', count: 11245, color: '#22c55e' },
            { status: 'Cuti', count: 423, color: '#eab308' },
            { status: 'Probation', count: 790, color: '#ef4444' },
        ],
        gradRateData: [
            { year: '2020', onTime: 73, delayed: 27 },
            { year: '2021', onTime: 75, delayed: 25 },
            { year: '2022', onTime: 78, delayed: 22 },
            { year: '2023', onTime: 77, delayed: 23 },
            { year: '2024', onTime: 82, delayed: 18 },
        ],
    },

    '2024-2': {
        totalStudents: 12458,
        totalTeachers: 842,
        graduationRate: 82,
        averageGpa: 3.42,
        employmentRate: 87,
        scholarship: 'Rp 2.4M',
        studentsByFaculty: [
            { name: 'Teknik', count: 3245 },
            { name: 'Ekonomi', count: 2876 },
            { name: 'MIPA', count: 1934 },
            { name: 'Kedokteran', count: 1568 },
            { name: 'Humaniora', count: 1842 },
            { name: 'Hukum', count: 993 },
        ],
        studentsByStatus: [
            { status: 'Aktif', count: 11245, color: '#22c55e' },
            { status: 'Cuti', count: 423, color: '#eab308' },
            { status: 'Probation', count: 790, color: '#ef4444' },
        ],
        gradRateData: [
            { year: '2020', onTime: 73, delayed: 27 },
            { year: '2021', onTime: 75, delayed: 25 },
            { year: '2022', onTime: 78, delayed: 22 },
            { year: '2023', onTime: 77, delayed: 23 },
            { year: '2024', onTime: 82, delayed: 18 },
        ],
    },

    '2024-1': {
        totalStudents: 12320,
        totalTeachers: 830,
        graduationRate: 80,
        averageGpa: 3.38,
        employmentRate: 85,
        scholarship: 'Rp 2.2M',
        studentsByFaculty: [
            { name: 'Teknik', count: 3200 },
            { name: 'Ekonomi', count: 2800 },
            { name: 'MIPA', count: 1900 },
            { name: 'Kedokteran', count: 1550 },
            { name: 'Humaniora', count: 1800 },
            { name: 'Hukum', count: 970 },
        ],
        studentsByStatus: [
            { status: 'Aktif', count: 11100, color: '#22c55e' },
            { status: 'Cuti', count: 410, color: '#eab308' },
            { status: 'Probation', count: 810, color: '#ef4444' },
        ],
        gradRateData: [
            { year: '2020', onTime: 73, delayed: 27 },
            { year: '2021', onTime: 75, delayed: 25 },
            { year: '2022', onTime: 78, delayed: 22 },
            { year: '2023', onTime: 80, delayed: 20 },
        ],
    },

    '2023-2': {
        totalStudents: 12100,
        totalTeachers: 820,
        graduationRate: 78,
        averageGpa: 3.35,
        employmentRate: 83,
        scholarship: 'Rp 2.1M',
        studentsByFaculty: [
            { name: 'Teknik', count: 3100 },
            { name: 'Ekonomi', count: 2750 },
            { name: 'MIPA', count: 1850 },
            { name: 'Kedokteran', count: 1500 },
            { name: 'Humaniora', count: 1750 },
            { name: 'Hukum', count: 950 },
        ],
        studentsByStatus: [
            { status: 'Aktif', count: 10900, color: '#22c55e' },
            { status: 'Cuti', count: 400, color: '#eab308' },
            { status: 'Probation', count: 800, color: '#ef4444' },
        ],
        gradRateData: [
            { year: '2019', onTime: 71, delayed: 29 },
            { year: '2020', onTime: 73, delayed: 27 },
            { year: '2021', onTime: 75, delayed: 25 },
            { year: '2022', onTime: 78, delayed: 22 },
            { year: '2023', onTime: 78, delayed: 22 },
        ],
    },

    '2023-1': {
        totalStudents: 11900,
        totalTeachers: 810,
        graduationRate: 76,
        averageGpa: 3.32,
        employmentRate: 81,
        scholarship: 'Rp 2.0M',
        studentsByFaculty: [
            { name: 'Teknik', count: 3050 },
            { name: 'Ekonomi', count: 2700 },
            { name: 'MIPA', count: 1800 },
            { name: 'Kedokteran', count: 1480 },
            { name: 'Humaniora', count: 1700 },
            { name: 'Hukum', count: 930 },
        ],
        studentsByStatus: [
            { status: 'Aktif', count: 10700, color: '#22c55e' },
            { status: 'Cuti', count: 390, color: '#eab308' },
            { status: 'Probation', count: 780, color: '#ef4444' },
        ],
        gradRateData: [
            { year: '2019', onTime: 71, delayed: 29 },
            { year: '2020', onTime: 73, delayed: 27 },
            { year: '2021', onTime: 75, delayed: 25 },
            { year: '2022', onTime: 76, delayed: 24 },
        ],
    },

    'all-Ganjil': {
        totalStudents: 12110,
        totalTeachers: 820,
        graduationRate: 78,
        averageGpa: 3.35,
        employmentRate: 83,
        scholarship: 'Rp 2.1M',
        studentsByFaculty: [
            { name: 'Teknik', count: 3125 },
            { name: 'Ekonomi', count: 2750 },
            { name: 'MIPA', count: 1850 },
            { name: 'Kedokteran', count: 1515 },
            { name: 'Humaniora', count: 1750 },
            { name: 'Hukum', count: 950 },
        ],
        studentsByStatus: [
            { status: 'Aktif', count: 10900, color: '#22c55e' },
            { status: 'Cuti', count: 400, color: '#eab308' },
            { status: 'Probation', count: 810, color: '#ef4444' },
        ],
        gradRateData: [
            { year: '2020', onTime: 72, delayed: 28 },
            { year: '2021', onTime: 74, delayed: 26 },
            { year: '2022', onTime: 77, delayed: 23 },
            { year: '2023', onTime: 76, delayed: 24 },
            { year: '2024', onTime: 80, delayed: 20 },
        ],
    },

    // Semua tahun, semester Genap
    'all-Genap': {
        totalStudents: 12279,
        totalTeachers: 831,
        graduationRate: 80,
        averageGpa: 3.39,
        employmentRate: 85,
        scholarship: 'Rp 2.25M',
        studentsByFaculty: [
            { name: 'Teknik', count: 3173 },
            { name: 'Ekonomi', count: 2813 },
            { name: 'MIPA', count: 1892 },
            { name: 'Kedokteran', count: 1534 },
            { name: 'Humaniora', count: 1796 },
            { name: 'Hukum', count: 972 },
        ],
        studentsByStatus: [
            { status: 'Aktif', count: 11073, color: '#22c55e' },
            { status: 'Cuti', count: 412, color: '#eab308' },
            { name: 'Probation', count: 795, color: '#ef4444' },
        ],
        gradRateData: [
            { year: '2020', onTime: 74, delayed: 26 },
            { year: '2021', onTime: 76, delayed: 24 },
            { year: '2022', onTime: 79, delayed: 21 },
            { year: '2023', onTime: 78, delayed: 22 },
            { year: '2024', onTime: 82, delayed: 18 },
        ],
    },
};

// Dummy data untuk mata kuliah dan pengumuman
const courseData = [
    { code: 'CS101', name: 'Pengantar Ilmu Komputer', instructor: 'Dr. Budi Santoso', students: 342 },
    { code: 'ENG201', name: 'Bahasa Inggris Profesional', instructor: 'Prof. Sarah Johnson', students: 315 },
    { code: 'MGT303', name: 'Manajemen Strategis', instructor: 'Dr. Ahmad Hidayat', students: 298 },
    { code: 'STT202', name: 'Statistika Terapan', instructor: 'Dr. Ratna Wijaya', students: 287 },
    { code: 'PHY101', name: 'Fisika Dasar', instructor: 'Prof. Hendra Gunawan', students: 273 },
];

const announcements = [
    {
        id: 1,
        title: 'Jadwal UTS Semester Genap',
        content: 'Ujian Tengah Semester akan dilaksanakan pada tanggal 20-30 Maret 2025. Silakan cek jadwal di sistem akademik.',
        priority: 'high' as const,
        date: '12 Mar 2025',
    },
    {
        id: 2,
        title: 'Workshop Penelitian Dosen',
        content: 'LPPM mengadakan workshop penulisan proposal penelitian pada 15 Maret 2025 di Aula Utama.',
        priority: 'medium' as const,
        date: '15 Mar 2025',
    },
    {
        id: 3,
        title: 'Pemeliharaan Sistem Akademik',
        content: 'Sistem akademik akan mengalami pemeliharaan pada 20 Maret 2025 pukul 23:00-01:00 WIB.',
        priority: 'low' as const,
        date: '20 Mar 2025',
    },
];

export default function Dashboard() {
    const { setLoading } = useDashboardStore();
    const [dashboardData, setDashboardData] = useState(periodData['all']);
    const [currentPeriodId, setCurrentPeriodId] = useState('all');

    // Simulasi pengambilan data dari server
    const fetchDashboardData = (periodId: string) => {
        // Mulai loading
        setLoading(true);

        // Simulasi delay network
        setTimeout(() => {
            // Gunakan casting eksplisit ke tipe DashboardData
            const data = (periodData[periodId as keyof typeof periodData] || periodData['all']) as DashboardData;
            setDashboardData(data);
            setCurrentPeriodId(periodId);
            setLoading(false);
        }, 800); // Delay 800ms untuk simulasi loading
    };
    // Panggil data saat pertama kali dimuat
    useEffect(() => {
        fetchDashboardData('all');
    }, []);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="space-y-6 p-4">
                {/* Filter Dashboard */}
                <DashboardFilter onSearch={fetchDashboardData} />

                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <StatsCard
                        title="Total Mahasiswa"
                        value={dashboardData.totalStudents}
                        changeText="3.2% dari tahun lalu"
                        changeType="increase"
                        icon={<Users className="h-6 w-6 text-blue-600" />}
                        defaultUrl="/dashboard/students"
                    />
                    <StatsCard
                        title="Jumlah Dosen"
                        value={dashboardData.totalTeachers}
                        changeText="12 dosen baru semester ini"
                        changeType="increase"
                        icon={<GraduationCap className="h-6 w-6 text-purple-600" />}
                    />

                    <StatsCard
                        title="Tingkat Kelulusan"
                        value={`${dashboardData.graduationRate}%`}
                        changeText="5% dari tahun lalu"
                        changeType="increase"
                        icon={<Award className="h-6 w-6 text-green-600" />}
                    />

                    <StatsCard
                        title="Rata-rata IPK"
                        value={dashboardData.averageGpa}
                        changeText="0.1 dari semester lalu"
                        changeType="increase"
                        icon={<BookOpen className="h-6 w-6 text-indigo-600" />}
                    />

                    <StatsCard
                        title="Penyerapan Kerja"
                        value={`${dashboardData.employmentRate}%`}
                        changeText="2% dari tahun lalu"
                        changeType="decrease"
                        icon={<Briefcase className="h-6 w-6 text-amber-600" />}
                    />

                    <StatsCard
                        title="Beasiswa Tersalurkan"
                        value={dashboardData.scholarship}
                        changeText="23% dari tahun lalu"
                        changeType="increase"
                        icon={<DollarSign className="h-6 w-6 text-emerald-600" />}
                    />
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FacultyChart data={dashboardData.studentsByFaculty} />
                    <StatusPieChart data={dashboardData.studentsByStatus} totalStudents={dashboardData.totalStudents} />
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <GradRateChart data={dashboardData.gradRateData} />
                    <AnnouncementPanel announcements={announcements} />
                </div>

                {/* Tables */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <PopularCoursesTable courses={courseData} />
                </div>
            </div>
        </AppLayout>
    );
}
