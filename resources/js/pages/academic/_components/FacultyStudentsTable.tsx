import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Student {
    Student_Id: string;
    Full_Name?: string;
    Student_Name?: string;
    Entry_Year_Id: string;
    Register_Status_Id: string;
    Gender_Id?: number;
    Nim?: string;
    Religion_Name?: string;
    Religion_Display_Name?: string;
    Birth_Date?: string;
    Age?: number;
    Age_Range?: string;
    Department_Name: string;
    Department_Acronym: string;
    Status_Name?: string;
    Gender_Name?: string;
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

interface FacultyStudentsTableProps {
    facultyId: string;
    termYearId: string;
    studentStatus: string;
    initialGenderFilter?: string;
    initialReligionFilter?: string;
    initialAgeFilter?: string;
}

export default function FacultyStudentsTable({
    facultyId,
    termYearId,
    studentStatus,
    initialGenderFilter = '',
    initialReligionFilter = '',
    initialAgeFilter = '',
}: FacultyStudentsTableProps) {
    const [students, setStudents] = useState<StudentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [genderFilter, setGenderFilter] = useState(initialGenderFilter);
    const [religionFilter, setReligionFilter] = useState(initialReligionFilter);
    const [ageFilter, setAgeFilter] = useState(initialAgeFilter);
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

    const statusColors: Record<string, string> = {
        A: 'default',
        L: 'secondary',
        C: 'destructive',
        K: 'destructive',
        P: 'destructive',
    };

    // Method to update URL using Inertia router
    const updateURLWithInertia = (newGenderFilter: string, newReligionFilter: string, newAgeFilter: string, newSearch: string = search) => {
        const currentParams = new URLSearchParams(window.location.search);

        // Build new params
        const params: any = {
            facultyId: facultyId,
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

        // Add age filter if not empty
        if (newAgeFilter && newAgeFilter !== '') {
            params.age = newAgeFilter;
        }

        // Add search if not empty
        if (newSearch && newSearch.trim() !== '') {
            params.search = newSearch.trim();
        }

        // Use Inertia router to update URL
        router.visit(route('academic.faculty.detail', params), {
            preserveState: true,
            replace: true,
            only: [], // Don't reload any data, just update URL
            onSuccess: () => {
                console.log('URL updated successfully');
            },
        });
    };

    const fetchStudents = async (pageNum = 1, searchQuery = '', selectedGender = '', selectedReligion = '', selectedAge = '') => {
        try {
            setLoading(true);

            const params: any = {
                term_year_id: termYearId,
                student_status: studentStatus,
                page: pageNum,
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

            if (selectedAge && selectedAge !== '') {
                params.age = selectedAge;
            }

            const response = await axios.get(`/academic/faculty/${facultyId}/students`, {
                params,
            });

            const apiResponse: ApiResponse = response.data;

            // Convert string values to numbers
            const studentsData: StudentData = {
                ...apiResponse.students,
                current_page: Number(apiResponse.students.current_page),
                per_page: Number(apiResponse.students.per_page),
                last_page: Number(apiResponse.students.last_page),
                total: Number(apiResponse.students.total),
            };

            setStudents(studentsData);
            setPage(pageNum);
        } catch (error) {
            console.error('Error fetching faculty students:', error);
        } finally {
            setLoading(false);
        }
    };

    const ageOptions = [
        { value: '', label: 'Semua Umur' },
        { value: '17-19', label: '17-19 tahun' },
        { value: '20-22', label: '20-22 tahun' },
        { value: '23-25', label: '23-25 tahun' },
        { value: '26-30', label: '26-30 tahun' },
        { value: '> 30', label: '> 30 tahun' },
    ];

    const handleGenderFilterChange = (selectedGender: string) => {
        console.log('Gender filter changed to:', selectedGender);
        setGenderFilter(selectedGender);
        updateURLWithInertia(selectedGender, religionFilter, ageFilter);
        fetchStudents(1, search, selectedGender, religionFilter, ageFilter);
    };

    const handleReligionFilterChange = (selectedReligion: string) => {
        setReligionFilter(selectedReligion);
        updateURLWithInertia(genderFilter, selectedReligion, ageFilter);
        fetchStudents(1, search, genderFilter, selectedReligion, ageFilter);
    };

    const handleAgeFilterChange = (selectedAge: string) => {
        setAgeFilter(selectedAge);
        updateURLWithInertia(genderFilter, religionFilter, selectedAge);
        fetchStudents(1, search, genderFilter, religionFilter, selectedAge);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newSearch = e.target.value;
        setSearch(newSearch);

        // Clear previous timeout
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        // Set new timeout for debounced search
        const timeout = setTimeout(() => {
            updateURLWithInertia(genderFilter, religionFilter, ageFilter, newSearch);
            fetchStudents(1, newSearch, genderFilter, religionFilter, ageFilter);
        }, 500);

        setDebounceTimeout(timeout);
    };

    const clearFilters = () => {
        setSearch('');
        setGenderFilter('');
        setReligionFilter('');
        setAgeFilter('');

        // Update URL by removing filter parameters
        updateURLWithInertia('', '', '', '');

        // Load data without filters
        fetchStudents(1, '', '', '', '');
    };

    const handlePageChange = (newPage: number) => {
        fetchStudents(newPage, search, genderFilter, religionFilter, ageFilter);
    };

    const handleDepartmentClick = (departmentId: string) => {
        // Navigate to department detail page
        router.visit(
            route('academic.department.detail', {
                departmentId: departmentId,
                term_year_id: termYearId,
                student_status: studentStatus,
            }),
        );
    };

    // Initial load and when dependencies change
    useEffect(() => {
        fetchStudents(1, search, genderFilter, religionFilter, ageFilter);
    }, [facultyId, termYearId, studentStatus]);

    // Update local state when props change (from chart click)
    useEffect(() => {
        if (initialGenderFilter !== genderFilter) {
            setGenderFilter(initialGenderFilter || '');
        }
    }, [initialGenderFilter]);

    useEffect(() => {
        if (initialReligionFilter !== religionFilter) {
            setReligionFilter(initialReligionFilter || '');
        }
    }, [initialReligionFilter]);

    useEffect(() => {
        if (initialAgeFilter !== ageFilter) {
            setAgeFilter(initialAgeFilter || '');
        }
    }, [initialAgeFilter]);

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

    const activeFiltersCount = [genderFilter, religionFilter, ageFilter, search].filter((f) => f).length;

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
                <CardTitle>Data Mahasiswa Fakultas</CardTitle>
                <CardDescription>Daftar lengkap mahasiswa dengan fitur pencarian dan filter</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Active Filter Banner */}
                {activeFiltersCount > 0 && (
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
                                    {ageFilter && (
                                        <span className="ml-1">
                                            Umur: <strong>{ageFilter} tahun</strong>
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
                            <Input
                                type="text"
                                placeholder="Cari nama atau NIM mahasiswa..."
                                value={search}
                                onChange={handleSearchChange}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {/* Gender filter dropdown */}
                        <div className="w-full md:w-48">
                            <Select value={genderFilter || undefined} onValueChange={handleGenderFilterChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Gender</SelectItem>
                                    <SelectItem value="laki">Laki-laki</SelectItem>
                                    <SelectItem value="perempuan">Perempuan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Religion filter dropdown */}
                        <div className="w-full md:w-48">
                            <Select value={religionFilter || undefined} onValueChange={handleReligionFilterChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Agama" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Agama</SelectItem>
                                    <SelectItem value="ISLAM">Islam</SelectItem>
                                    <SelectItem value="PROTESTAN">Protestan</SelectItem>
                                    <SelectItem value="KATHOLIK">Katolik</SelectItem>
                                    <SelectItem value="HINDU">Hindu</SelectItem>
                                    <SelectItem value="BUDHA">Buddha</SelectItem>
                                    <SelectItem value="KONGHUCU">Konghucu</SelectItem>
                                    <SelectItem value="Lainnya">Lainnya</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Age filter dropdown */}
                        <div className="w-full md:w-48">
                            <Select value={ageFilter || undefined} onValueChange={handleAgeFilterChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Semua Umur" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ageOptions.map((option) => (
                                        <SelectItem key={option.value || 'all'} value={option.value || 'all'}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {activeFiltersCount > 0 && (
                            <Button variant="outline" onClick={clearFilters} className="gap-2">
                                <X className="h-4 w-4" />
                                Clear Filters ({activeFiltersCount})
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
                        {ageFilter && ` dengan umur ${ageFilter} tahun`}
                    </div>
                )}

                {/* Students Table */}
                <div className="overflow-hidden rounded-lg border">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>No</TableHead>
                                    <TableHead>NIM</TableHead>
                                    <TableHead>Nama Mahasiswa</TableHead>
                                    <TableHead>Program Studi</TableHead>
                                    <TableHead>Angkatan</TableHead>
                                    <TableHead>Gender</TableHead>
                                    <TableHead>Agama</TableHead>
                                    <TableHead>Umur</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students?.data.map((student, index) => (
                                    <TableRow key={student.Student_Id} className="hover:bg-gray-50">
                                        <TableCell className="text-sm whitespace-nowrap text-gray-900">
                                            {(students.current_page - 1) * students.per_page + index + 1}
                                        </TableCell>
                                        <TableCell className="font-mono text-sm whitespace-nowrap">{student.Nim || student.Student_Id}</TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{student.Full_Name || student.Student_Name || '-'}</div>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            <span
                                                className="cursor-pointer text-blue-600 hover:text-blue-800 hover:underline"
                                                onClick={() => handleDepartmentClick(student.Department_Name)}
                                            >
                                                {student.Department_Acronym}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm whitespace-nowrap text-gray-900">
                                            {student.Entry_Year_Id ? String(student.Entry_Year_Id).substring(0, 4) : '-'}
                                        </TableCell>
                                        <TableCell className="text-sm whitespace-nowrap text-gray-900">{student.Gender_Name || '-'}</TableCell>
                                        <TableCell className="text-sm whitespace-nowrap text-gray-900">
                                            {student.Religion_Display_Name || student.Religion_Name || 'Lainnya'}
                                        </TableCell>
                                        <TableCell className="text-sm whitespace-nowrap text-gray-900">
                                            <div className="flex flex-col">
                                                <span className="font-medium">{student.Age ? `${student.Age} tahun` : student.Age_Range || '-'}</span>
                                                {student.Birth_Date && (
                                                    <span className="mt-0.5 text-xs text-gray-500">
                                                        {new Date(student.Birth_Date).toLocaleDateString('id-ID', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                        })}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="whitespace-nowrap">
                                            <Badge variant={getStatusBadgeVariant(student.Status_Name || student.Register_Status_Id)}>
                                                {student.Status_Name || student.Register_Status_Id}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                {/* Pagination */}
                {students && students.last_page > 1 && (
                    <div className="mt-6 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Menampilkan {(students.current_page - 1) * students.per_page + 1} -{' '}
                            {Math.min(students.current_page * students.per_page, students.total)} dari {formatNumber(students.total)} data
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(students.current_page - 1)}
                                disabled={students.current_page <= 1 || loading}
                            >
                                Previous
                            </Button>

                            <span className="px-3 py-1 text-sm">
                                Page {students.current_page} of {students.last_page}
                            </span>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(students.current_page + 1)}
                                disabled={students.current_page >= students.last_page || loading}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {students && students.data.length === 0 && (
                    <div className="py-12 text-center">
                        <Search className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">
                            {activeFiltersCount > 0 ? 'Tidak ada mahasiswa yang sesuai dengan filter' : 'Tidak ada data mahasiswa'}
                        </p>
                        {activeFiltersCount > 0 && (
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
