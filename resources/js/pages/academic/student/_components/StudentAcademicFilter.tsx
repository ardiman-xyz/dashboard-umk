import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';

interface SimplifiedFilterProps {
    currentTermId: string;
    currentStudentStatus: string;
    availableTerms: Array<{
        id: string;
        name: string;
    }>;
    onStudentStatusChange: (status: string) => void;
}

export default function StudentAcademicFilter({ currentTermId, currentStudentStatus, availableTerms, onStudentStatusChange }: SimplifiedFilterProps) {
    const [selectedTerm, setSelectedTerm] = useState(currentTermId || 'all');
    const [isLoading, setIsLoading] = useState(false);

    const applyFilters = () => {
        setIsLoading(true);

        const params: any = {
            student_status: currentStudentStatus,
            term_year_id: selectedTerm,
        };

        router.visit(route('academic.student.index'), {
            data: params,
            preserveState: true,
            onFinish: () => setIsLoading(false),
        });
    };

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            {/* Term Filter */}
            <div>
                <label className="mb-2 block text-sm font-medium">Tahun & Semester</label>
                <Select value={selectedTerm} onValueChange={setSelectedTerm}>
                    <SelectTrigger>
                        <SelectValue placeholder="Semua Tahun & Semester" />
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

            {/* Student Status Filter */}
            <div>
                <label className="mb-2 block text-sm font-medium">Status Mahasiswa</label>
                <Select value={currentStudentStatus}>
                    <SelectTrigger>
                        <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Mahasiswa</SelectItem>
                        <SelectItem value="active">Mahasiswa Aktif</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Apply Button */}
            <div className="flex items-end">
                <Button onClick={applyFilters} disabled={isLoading} className="w-max">
                    <Search className="mr-2 h-4 w-4" />
                    {isLoading ? 'Loading...' : 'Filter'}
                </Button>
            </div>
        </div>
    );
}
