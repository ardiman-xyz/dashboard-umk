import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter } from 'lucide-react';
import { useState } from 'react';

interface DepartmentFilterProps {
    availableTerms: Array<{
        id: string;
        name: string;
    }>;
    initialTermId: string;
    initialStatus: string;
    onFilterApply: (termId: string, status: string) => void;
    isFiltering: boolean;
}

export default function DepartmentFilter({ availableTerms, initialTermId, initialStatus, onFilterApply, isFiltering }: DepartmentFilterProps) {
    const [selectedTerm, setSelectedTerm] = useState(initialTermId);
    const [selectedStatus, setSelectedStatus] = useState(initialStatus);

    const handleApply = () => {
        onFilterApply(selectedTerm, selectedStatus);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filter Data Mahasiswa
                </CardTitle>
                <CardDescription>Sesuaikan periode dan status mahasiswa untuk analisis yang lebih spesifik</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                    <div>
                        <label className="mb-2 block text-sm font-medium">Tahun & Semester</label>
                        <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Tahun & Semester" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Tahun & Semester</SelectItem>
                                {availableTerms.map((term) => (
                                    <SelectItem key={term.id} value={term.id}>
                                        {term.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium">Status Mahasiswa</label>
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Mahasiswa</SelectItem>
                                <SelectItem value="active">Mahasiswa Aktif</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-end">
                        <Button onClick={handleApply} disabled={isFiltering} className="w-max cursor-pointer">
                            {isFiltering ? 'Loading...' : 'Terapkan Filter'}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
