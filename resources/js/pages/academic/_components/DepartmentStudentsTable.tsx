import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import axios from 'axios';
import { Search, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Student {
    Student_Id: string;
    Full_Name: string;
    Entry_Year_Id: string | number; // Allow both string and number
    Register_Status_Id: string;
    Gender_Id: number;
    Status_Name: string;
    Gender_Name: string;
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
    initialGenderFilter?: string; // Add this prop
}

export default function DepartmentStudentsTable({ departmentId, termYearId, studentStatus, initialGenderFilter }: DepartmentStudentsTableProps) {
    const [students, setStudents] = useState<StudentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [genderFilter, setGenderFilter] = useState(initialGenderFilter || '');
    const [currentPage, setCurrentPage] = useState(1);

    const loadStudents = async (page = 1) => {
        try {
            setLoading(true);
            const response = await axios.get(`/academic/department/${departmentId}/students`, {
                params: {
                    term_year_id: termYearId,
                    student_status: studentStatus,
                    search: search,
                    gender_filter: genderFilter || undefined,
                    page: page,
                    per_page: 20,
                },
            });

            // Extract students data from API response
            const apiResponse: ApiResponse = response.data;
            setStudents(apiResponse.students);
            setCurrentPage(parseInt(apiResponse.students.current_page.toString()));
        } catch (error) {
            console.error('Error loading students:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudents(1);
    }, [departmentId, termYearId, studentStatus, search, genderFilter]);

    // Update gender filter when initialGenderFilter changes (from chart click)
    useEffect(() => {
        if (initialGenderFilter && initialGenderFilter !== genderFilter) {
            setGenderFilter(initialGenderFilter);
            setCurrentPage(1);
        }
    }, [initialGenderFilter]);

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
                <CardDescription>Daftar lengkap mahasiswa dengan fitur pencarian dan pagination</CardDescription>
            </CardHeader>
            <CardContent>
                {/* Filter Info Banner */}
                {genderFilter && (
                    <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="text-blue-600">
                                    🔍 Filter aktif: Menampilkan mahasiswa <strong>{genderFilter === 'laki' ? 'Laki-laki' : 'Perempuan'}</strong>
                                </div>
                            </div>
                            <button onClick={() => setGenderFilter('')} className="text-sm text-blue-600 underline hover:text-blue-800">
                                Hapus filter
                            </button>
                        </div>
                    </div>
                )}

                {/* Search and Filter */}
                <div className="mb-6 flex flex-col gap-4 md:flex-row">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari nama atau NIM mahasiswa..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-48">
                        <select
                            value={genderFilter}
                            onChange={(e) => setGenderFilter(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Semua Gender</option>
                            <option value="laki">Laki-laki</option>
                            <option value="perempuan">Perempuan</option>
                        </select>
                    </div>
                </div>

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
                            <Button variant="outline" size="sm" onClick={() => loadStudents(currentPage - 1)} disabled={currentPage <= 1 || loading}>
                                Previous
                            </Button>

                            <span className="px-3 py-1 text-sm">
                                Page {currentPage} of {students.last_page}
                            </span>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => loadStudents(currentPage + 1)}
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
                        <p className="text-gray-500">Tidak ada data mahasiswa</p>
                        {search && (
                            <button onClick={() => setSearch('')} className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                                Hapus pencarian
                            </button>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
