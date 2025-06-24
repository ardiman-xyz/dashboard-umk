import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { router } from '@inertiajs/react'; // Import router from Inertia
import axios from 'axios';
import { Search, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Student {
    Student_Id: string;
    Full_Name: string;
    Entry_Year_Id: string | number;
    Register_Status_Id: string;
    Gender_Id: number;
    Status_Name: string;
    Gender_Name: string;
    Religion_Display_Name: string;
}

interface StudentData {
    data: Student[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

interface ApiResponse {
    students: StudentData;
    filters: any;
}

interface DepartmentStudentsTableProps {
    departmentId: string;
    termYearId: string;
    studentStatus: string;
    initialGenderFilter?: string;
    initialReligionFilter?: string; // Add religion filter prop
}

export default function DepartmentStudentsTable({
    departmentId,
    termYearId,
    studentStatus,
    initialGenderFilter,
    initialReligionFilter,
}: DepartmentStudentsTableProps) {
    const [students, setStudents] = useState<StudentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [genderFilter, setGenderFilter] = useState(initialGenderFilter || '');
    const [religionFilter, setReligionFilter] = useState(initialReligionFilter || ''); // Add religion state
    const [currentPage, setCurrentPage] = useState(1);
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

    // Method to update URL using Inertia router
    const updateURLWithInertia = (newGenderFilter: string, newReligionFilter: string, newSearch: string = search) => {
        const currentParams = new URLSearchParams(window.location.search);

        // Build new params
        const params: any = {
            departmentId: departmentId,
            term_year_id: termYearId,
            student_status: studentStatus,
        };

        // Preserve tab parameter
        if (currentParams.get('tab')) {
            params.tab = currentParams.get('tab');
        }

        // Add gender filter if not empty
        if (newGenderFilter && newGenderFilter !== '') {
            params.gender = newGenderFilter;
        }

        // Add religion filter if not empty
        if (newReligionFilter && newReligionFilter !== '') {
            params.religion = newReligionFilter;
        }

        // Add search if not empty
        if (newSearch && newSearch.trim() !== '') {
            params.search = newSearch.trim();
        }

        // Use Inertia router to update URL
        router.visit(route('academic.department.detail', params), {
            preserveState: true,
            replace: true,
            only: [], // Don't reload any data, just update URL
            onSuccess: () => {
                console.log('URL updated successfully');
            },
        });
    };

    // Backend filtering function
    const loadStudents = async (page = 1, searchQuery = '', selectedGender = '', selectedReligion = '') => {
        try {
            setLoading(true);

            const params: any = {
                term_year_id: termYearId,
                student_status: studentStatus,
                page: page,
                per_page: 20,
            };

            if (searchQuery.trim()) {
                params.search = searchQuery.trim();
            }

            if (selectedGender && selectedGender !== '') {
                params.gender = selectedGender;
            }

            if (selectedReligion && selectedReligion !== '') {
                params.religion = selectedReligion;
            }

            console.log('API Request params:', params);

            const response = await axios.get(`/academic/department/${departmentId}/students`, {
                params,
            });

            const apiResponse: ApiResponse = response.data;
            setStudents(apiResponse.students);
            setCurrentPage(parseInt(apiResponse.students.current_page.toString()));
        } catch (error) {
            console.error('Error loading students:', error);
            setStudents({
                data: [],
                total: 0,
                per_page: 20,
                current_page: 1,
                last_page: 1,
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle gender filter change with URL update
    const handleGenderFilterChange = (selectedGender: string) => {
        console.log('Gender filter changed to:', selectedGender);

        setGenderFilter(selectedGender);
        setCurrentPage(1);

        // Update URL immediately when filter changes
        updateURLWithInertia(selectedGender, religionFilter);

        // Load new data
        loadStudents(1, search, selectedGender, religionFilter);
    };

    // Handle religion filter change with URL update
    const handleReligionFilterChange = (selectedReligion: string) => {
        console.log('Religion filter changed to:', selectedReligion);

        setReligionFilter(selectedReligion);
        setCurrentPage(1);

        // Update URL immediately when filter changes
        updateURLWithInertia(genderFilter, selectedReligion);

        // Load new data
        loadStudents(1, search, genderFilter, selectedReligion);
    };

    // Handle search input change with debouncing
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearch = e.target.value;
        setSearch(newSearch);

        // Clear previous timeout
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        // Set new timeout for debounced search
        const timeout = setTimeout(() => {
            setCurrentPage(1);
            updateURLWithInertia(genderFilter, religionFilter, newSearch);
            loadStudents(1, newSearch, genderFilter, religionFilter);
        }, 500);

        setDebounceTimeout(timeout);
    };

    // Clear all filters
    const clearFilters = () => {
        setSearch('');
        setGenderFilter('');
        setReligionFilter('');
        setCurrentPage(1);

        // Update URL by removing filter parameters
        updateURLWithInertia('', '', '');

        // Load data without filters
        loadStudents(1, '', '', '');
    };

    // Handle pagination with URL update
    const handlePageChange = (page: number) => {
        setCurrentPage(page);

        // Update URL with new page (optional, if you want page in URL)
        const url = new URL(window.location.href);
        if (page > 1) {
            url.searchParams.set('page', page.toString());
        } else {
            url.searchParams.delete('page');
        }
        window.history.replaceState({}, '', url.toString());

        loadStudents(page, search, genderFilter, religionFilter);
    };

    // Initial load and when dependencies change
    useEffect(() => {
        loadStudents(1, search, genderFilter, religionFilter);
    }, [departmentId, termYearId, studentStatus]);

    // Update local state when props change (from chart click)
    useEffect(() => {
        if (initialGenderFilter !== genderFilter) {
            setGenderFilter(initialGenderFilter || '');
            setCurrentPage(1);
        }
    }, [initialGenderFilter]);

    useEffect(() => {
        if (initialReligionFilter !== religionFilter) {
            setReligionFilter(initialReligionFilter || '');
            setCurrentPage(1);
        }
    }, [initialReligionFilter]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (debounceTimeout) {
                clearTimeout(debounceTimeout);
            }
        };
    }, [debounceTimeout]);

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'Aktif':
                return 'default';
            case 'Lulus':
                return 'secondary';
            case 'Cuti':
                return 'outline';
            case 'Keluar':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    const formatNumber = (num: number): string => {
        return num.toLocaleString('id-ID');
    };

    if (loading && !students) {
        return (
            <Card>
                <CardContent className="flex h-64 items-center justify-center">
                    <div className="text-center">
                        <div className="border-primary mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2"></div>
                        <p>Memuat data mahasiswa...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Data Mahasiswa Program Studi
                </CardTitle>
                <CardDescription>Daftar lengkap mahasiswa dengan fitur pencarian dan filter</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Active Filter Banner */}
                {(genderFilter || religionFilter || search) && (
                    <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="text-blue-600">
                                    🔍 Filter aktif:
                                    {genderFilter && (
                                        <span className="ml-1">
                                            <strong>{genderFilter === 'laki' ? 'Laki-laki' : 'Perempuan'}</strong>
                                        </span>
                                    )}
                                    {religionFilter && (
                                        <span className="ml-1">
                                            Agama: <strong>{religionFilter}</strong>
                                        </span>
                                    )}
                                    {search && (
                                        <span className="ml-1">
                                            Pencarian: <strong>"{search}"</strong>
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button onClick={clearFilters} className="text-sm text-blue-600 underline hover:text-blue-800">
                                Hapus semua filter
                            </button>
                        </div>
                    </div>
                )}

                {/* Search and Filter Controls */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari nama atau NIM mahasiswa..."
                                value={search}
                                onChange={handleSearchChange}
                                className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {/* Gender filter dropdown */}
                        <div className="w-full md:w-48">
                            <select
                                value={genderFilter}
                                onChange={(e) => handleGenderFilterChange(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Semua Gender</option>
                                <option value="laki">Laki-laki</option>
                                <option value="perempuan">Perempuan</option>
                            </select>
                        </div>

                        {/* Religion filter dropdown */}
                        <div className="w-full md:w-48">
                            <select
                                value={religionFilter}
                                onChange={(e) => handleReligionFilterChange(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Semua Agama</option>
                                <option value="ISLAM">Islam</option>
                                <option value="PROTESTAN">Protestan</option>
                                <option value="KATHOLIK">Katolik</option>
                                <option value="HINDU">Hindu</option>
                                <option value="BUDHA">Buddha</option>
                                <option value="KONGHUCU">Konghucu</option>
                                <option value="Lainnya">Lainnya</option>
                            </select>
                        </div>

                        {(search || genderFilter || religionFilter) && (
                            <Button variant="outline" onClick={clearFilters}>
                                Reset Filter
                            </Button>
                        )}
                    </div>
                </div>

                {/* Loading state for subsequent requests */}
                {loading && students && (
                    <div className="mb-4 flex items-center justify-center p-4">
                        <div className="border-primary h-6 w-6 animate-spin rounded-full border-b-2"></div>
                        <span className="ml-2">Memuat...</span>
                    </div>
                )}

                {/* Results summary */}
                {students && students.total > 0 && (
                    <div className="mb-4 text-sm text-gray-600">
                        Menampilkan {students.data.length} dari {formatNumber(students.total)} mahasiswa
                        {search && ` untuk pencarian "${search}"`}
                        {genderFilter && ` dengan filter ${genderFilter === 'laki' ? 'Laki-laki' : 'Perempuan'}`}
                        {religionFilter && ` dengan agama ${religionFilter}`}
                    </div>
                )}

                {/* Table */}
                <div className="overflow-hidden rounded-lg border">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">No</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">NIM</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Nama Mahasiswa</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Angkatan</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Gender</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Agama</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {students?.data.map((student, index) => (
                                    <tr key={student.Student_Id} className="hover:bg-gray-50">
                                        <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">
                                            {(currentPage - 1) * students.per_page + index + 1}
                                        </td>
                                        <td className="px-4 py-4 font-mono text-sm whitespace-nowrap">{student.Student_Id}</td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{student.Full_Name}</div>
                                        </td>
                                        <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">
                                            {student.Entry_Year_Id ? String(student.Entry_Year_Id).substring(0, 4) : '-'}
                                        </td>
                                        <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">{student.Gender_Name}</td>
                                        <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-900">
                                            {student.Religion_Display_Name || 'Lainnya'}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <Badge variant={getStatusBadgeVariant(student.Status_Name)}>{student.Status_Name}</Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination */}
                {students && students.last_page > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Menampilkan {(currentPage - 1) * students.per_page + 1} - {Math.min(currentPage * students.per_page, students.total)} dari{' '}
                            {formatNumber(students.total)} data
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage <= 1 || loading}
                            >
                                Previous
                            </Button>

                            <span className="px-3 py-1 text-sm">
                                Page {currentPage} of {students.last_page}
                            </span>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage >= students.last_page || loading}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {students && students.data.length === 0 && (
                    <div className="py-12 text-center">
                        <Users className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">
                            {search || genderFilter || religionFilter ? 'Tidak ada mahasiswa yang sesuai dengan filter' : 'Tidak ada data mahasiswa'}
                        </p>
                        {(search || genderFilter || religionFilter) && (
                            <button onClick={clearFilters} className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                                Reset semua filter
                            </button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
