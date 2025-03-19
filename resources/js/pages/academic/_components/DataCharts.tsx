import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AcademicStatusChart } from './charts/AcademicStatusChart';
import { AttendanceFacultyChart } from './charts/AttendanceFacultyChart';
import { AttendanceMonthlyChart } from './charts/AttendanceMonthlyChart';
import { FacultyDistributionChart } from './charts/FacultyDistributionChart';
import { GpaTrendChart } from './charts/GpaTrendChart';
import { GradeDistributionChart } from './charts/GradeDistributionChart';
import { TopStudentsTable } from './charts/TopStudentsTable';

export function DataCharts() {
    return (
        <div className="space-y-6">
            {/* Tabs untuk kategori data */}
            <Tabs defaultValue="demografi" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="demografi">Demografi</TabsTrigger>
                    <TabsTrigger value="performa">Performa Akademik</TabsTrigger>
                    <TabsTrigger value="kehadiran">Kehadiran</TabsTrigger>
                    <TabsTrigger value="prestasi">Prestasi</TabsTrigger>
                </TabsList>

                {/* Tab Demografi */}
                <TabsContent value="demografi" className="pt-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <FacultyDistributionChart />
                        <AcademicStatusChart />
                    </div>
                </TabsContent>

                {/* Tab Performa Akademik */}
                <TabsContent value="performa" className="pt-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <GpaTrendChart />
                        <GradeDistributionChart />
                    </div>
                </TabsContent>

                {/* Tab Kehadiran */}
                <TabsContent value="kehadiran" className="pt-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <AttendanceMonthlyChart />
                        <AttendanceFacultyChart />
                    </div>
                </TabsContent>

                {/* Tab Prestasi */}
                <TabsContent value="prestasi" className="pt-4">
                    <div className="grid grid-cols-1 gap-4">
                        <TopStudentsTable />
                    </div>
                </TabsContent>
            </Tabs>

            {/* Bagian Tambahan */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* <ScholarshipChart />
        <AcademicCalendar /> */}
            </div>
        </div>
    );
}
