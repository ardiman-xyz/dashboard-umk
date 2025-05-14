// resources/js/pages/academic/index.tsx
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { AcademicStats } from '@/types/academic';
import { Head } from '@inertiajs/react';
import { AkademikFilter } from './_components/AkademikFilter';
import { AkademikHeader } from './_components/AkademikHeader';
import { DataCharts } from './_components/DataCharts';
import { StatCards } from './_components/StatCards';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Akademik',
        href: '/akademik',
    },
];

interface AkademikProps {
    stats: AcademicStats;
    filters: {
        currentTerm: {
            id: string;
            name: string;
        };
        availableTerms: Array<{
            id: string;
            name: string;
        }>;
    };
}

export default function Akademik({ stats, filters }: AkademikProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Akademik" />

            <div className="p-4">
                <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <AkademikHeader />
                    <AkademikFilter />
                </div>

                <StatCards stats={stats} currentTerm={filters.currentTerm} />
                <DataCharts />
            </div>
        </AppLayout>
    );
}
