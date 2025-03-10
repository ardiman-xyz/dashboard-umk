import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { Award, BookOpen, Briefcase, DollarSign, GraduationCap, Users } from 'lucide-react';
import { AnnouncementPanel } from './_components/AnnouncementPanel';
import { FacultyChart } from './_components/FacultyChart';
import { GradRateChart } from './_components/GradRateChart';
import { PopularCoursesTable } from './_components/PopularCoursesTable';
import { StatsCard } from './_components/StatsCard';
import { StatusPieChart } from './_components/StatusPieChart';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    // Sample data
    const studentData = {
        total: 12458,
        byFaculty: [
            { name: 'Teknik', count: 3245 },
            { name: 'Ekonomi', count: 2876 },
            { name: 'MIPA', count: 1934 },
            { name: 'Kedokteran', count: 1568 },
            { name: 'Humaniora', count: 1842 },
            { name: 'Hukum', count: 993 },
        ],
        byStatus: [
            { status: 'Aktif', count: 11245, color: '#22c55e' },
            { status: 'Cuti', count: 423, color: '#eab308' },
            { status: 'Probation', count: 790, color: '#ef4444' },
        ],
    };

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
        {
            id: 4,
            title: 'Pendaftaran Beasiswa Prestasi',
            content: 'Pendaftaran beasiswa prestasi dibuka mulai 1-15 April 2025. Informasi lebih lanjut hubungi bagian kemahasiswaan.',
            priority: 'medium' as const,
            date: '25 Mar 2025',
        },
    ];

    const gradRateData = [
        { year: '2020', onTime: 73, delayed: 27 },
        { year: '2021', onTime: 75, delayed: 25 },
        { year: '2022', onTime: 78, delayed: 22 },
        { year: '2023', onTime: 77, delayed: 23 },
        { year: '2024', onTime: 82, delayed: 18 },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="space-y-6 p-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                    <StatsCard
                        title="Total Mahasiswa"
                        value={studentData.total}
                        changeText="3.2% dari tahun lalu"
                        changeType="increase"
                        icon={<Users className="h-6 w-6 text-blue-600" />}
                    />

                    <StatsCard
                        title="Jumlah Dosen"
                        value="842"
                        changeText="12 dosen baru semester ini"
                        changeType="increase"
                        icon={<GraduationCap className="h-6 w-6 text-purple-600" />}
                    />

                    <StatsCard
                        title="Tingkat Kelulusan"
                        value="82%"
                        changeText="5% dari tahun lalu"
                        changeType="increase"
                        icon={<Award className="h-6 w-6 text-green-600" />}
                    />

                    <StatsCard
                        title="Rata-rata IPK"
                        value="3.42"
                        changeText="0.1 dari semester lalu"
                        changeType="increase"
                        icon={<BookOpen className="h-6 w-6 text-indigo-600" />}
                    />

                    <StatsCard
                        title="Penyerapan Kerja"
                        value="87%"
                        changeText="2% dari tahun lalu"
                        changeType="decrease"
                        icon={<Briefcase className="h-6 w-6 text-amber-600" />}
                    />

                    <StatsCard
                        title="Beasiswa Tersalurkan"
                        value="Rp 2.4M"
                        changeText="23% dari tahun lalu"
                        changeType="increase"
                        icon={<DollarSign className="h-6 w-6 text-emerald-600" />}
                    />
                </div>

                {/* Charts Row 1 */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <FacultyChart data={studentData.byFaculty} />
                    <StatusPieChart data={studentData.byStatus} totalStudents={studentData.total} />
                </div>

                {/* Charts Row 2 */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <GradRateChart data={gradRateData} />
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
