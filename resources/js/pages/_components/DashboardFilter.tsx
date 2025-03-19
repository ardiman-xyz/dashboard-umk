// components/DashboardFilter.tsx - Filter di bagian kanan
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getPeriodId, useDashboardStore } from '@/store/dashboardStore';
import { Loader, Search } from 'lucide-react';
import React, { useState } from 'react';

// Definisikan tipe yang digunakan
type SemesterType = 'Ganjil' | 'Genap' | 'all';

interface DashboardFilterProps {
    onSearch: (periodId: string) => void;
}

export const DashboardFilter: React.FC<DashboardFilterProps> = ({ onSearch }) => {
    const { academicYears, semesters, selectedYear, selectedSemester, setSelectedYear, setSelectedSemester, resetFilters, isLoading } =
        useDashboardStore();

    // State lokal dengan tipe yang jelas
    const [localYear, setLocalYear] = useState<string>(selectedYear || 'all');
    const [localSemester, setLocalSemester] = useState<SemesterType>((selectedSemester || 'all') as SemesterType);

    // Handler untuk reset filter
    const handleReset = () => {
        resetFilters();
        setLocalYear('all');
        setLocalSemester('all');
        onSearch('all');
    };

    // Handler untuk submit pencarian
    const handleSearch = () => {
        // Update state global
        setSelectedYear(localYear);
        setSelectedSemester(localSemester as any);

        // Generate ID periode untuk digunakan dalam pencarian data
        const periodId = getPeriodId(localYear, localSemester);
        onSearch(periodId);
    };

    return (
        <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dashboard Akademik</h1>

            <div className="flex items-center gap-2">
                <Select value={localYear} onValueChange={setLocalYear}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Pilih Tahun Akademik" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Tahun Akademik</SelectLabel>
                            <SelectItem value="all">Semua Tahun</SelectItem>
                            {academicYears
                                .filter((year) => year.id !== '')
                                .map((year) => (
                                    <SelectItem key={year.id} value={year.id}>
                                        {year.label}
                                    </SelectItem>
                                ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Select value={localSemester} onValueChange={(value) => setLocalSemester(value as SemesterType)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Pilih Semester" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Semester</SelectLabel>
                            <SelectItem value="all">Semua Semester</SelectItem>
                            {semesters.map((semester) => (
                                <SelectItem key={semester.id} value={semester.id}>
                                    {semester.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <Button variant="default" onClick={handleSearch} disabled={isLoading} size="sm" className="px-3">
                    {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    <span className="">Cari</span>
                </Button>

                <Button variant="outline" onClick={handleReset} disabled={isLoading || (localYear === 'all' && localSemester === 'all')} size="sm">
                    Reset
                </Button>
            </div>
        </div>
    );
};
