// index.tsx
// Update di: pages/academic/student/index.tsx

import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Download } from 'lucide-react';
import React from 'react';
import StudentDistribution from './_components/StudentDistribution';
import StudentMainStats from './_components/StudentMainStats';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Akademik',
        href: '/academic',
    },
    {
        title: 'Mahasiswa',
        href: '/academic/student',
    },
];

const StudentDetailPage: React.FC = () => {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Mahasiswa" />

            <div className="space-y-6 p-4">
                {/* Header and Navigation */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Mahasiswa Aktif</h1>
                        <p className="text-muted-foreground text-sm">Detail mahasiswa terdaftar semester ini</p>
                    </div>

                    <Button variant="outline" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        <span>Export</span>
                    </Button>
                </div>

                {/* Statistik Utama Component */}
                <StudentMainStats />

                {/* Visualisasi Distribusi */}
                <StudentDistribution />

                {/* Placeholder for additional components */}
                <div className="text-muted-foreground rounded-lg border p-6 text-center">
                    Konten tambahan akan ditampilkan di sini (tabel mahasiswa, dll)
                </div>
            </div>
        </AppLayout>
    );
};

export default StudentDetailPage;
