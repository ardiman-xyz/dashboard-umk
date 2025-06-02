import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Download, Filter, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface StudentData {
    Student_Id: string;
    Student_Name: string;
    Entry_Year_Id: string;
    Register_Status_Id: string;
    Department_Name: string;
    Department_Acronym: string;
}

interface StudentsResponse {
    data: StudentData[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

interface FacultyStudentsTableProps {
    facultyId: string;
    termYearId: string;
    studentStatus: string;
}

export default function FacultyStudentsTable({ facultyId, termYearId, studentStatus }: FacultyStudentsTableProps) {
    const [students, setStudents] = useState<StudentsResponse>({
        data: [],
        total: 0,
        per_page: 20,
        current_page: 1,
        last_page: 1,
    });
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const loadStudents = async (page: number = 1, searchQuery: string = '') => {
        setLoading(true);
        try {
            const response = await axios.get(route('academic.faculty.students', { facultyId }), {
                params: {
                    term_year_id: termYearId,
                    student_status: studentStatus,
                    search: searchQuery,
                    page: page,
                    per_page: 20,
                },
            });
            setStudents(response.data);
        } catch (error) {
            console.error('Error loading students:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudents(currentPage, search);
    }, [facultyId, termYearId, studentStatus, currentPage]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        loadStudents(1, search);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        loadStudents(page, search);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'A':
                return <Badge variant="default">Aktif</Badge>;
            case 'C':
                return <Badge variant="secondary">Cuti</Badge>;
            case 'L':
                return <Badge variant="outline">Lulus</Badge>;
            case 'K':
                return <Badge variant="destructive">Keluar</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const formatEntryYear = (entryYearId: string) => {
        if (entryYearId.length >= 4) {
            return entryYearId.substring(0, 4);
        }
        return entryYearId;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Data Mahasiswa
                </CardTitle>
                <CardDescription>Daftar lengkap mahasiswa dengan fitur pencarian dan pagination</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Search and Actions */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <Input
                            placeholder="Cari nama atau NIM mahasiswa..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-[300px]"
                        />
                        <Button type="submit" size="icon" variant="outline">
                            <Search className="h-4 w-4" />
                        </Button>
                    </form>

                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Export Excel
                        </Button>
                    </div>
                </div>

                {/* Table */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[120px]">NIM</TableHead>
                                <TableHead>Nama Mahasiswa</TableHead>
                                <TableHead>Program Studi</TableHead>
                                <TableHead className="w-[100px]">Angkatan</TableHead>
                                <TableHead className="w-[100px]">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                // Loading skeleton
                                Array.from({ length: 5 }).map((_, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="bg-muted h-4 w-full animate-pulse rounded"></div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="bg-muted h-4 w-full animate-pulse rounded"></div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="bg-muted h-4 w-full animate-pulse rounded"></div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="bg-muted h-4 w-full animate-pulse rounded"></div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="bg-muted h-4 w-full animate-pulse rounded"></div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : students.data.length > 0 ? (
                                students.data.map((student) => (
                                    <TableRow key={student.Student_Id}>
                                        <TableCell className="font-mono text-sm">{student.Student_Id}</TableCell>
                                        <TableCell className="font-medium">{student.Student_Name}</TableCell>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium">{student.Department_Acronym}</span>
                                                <span className="text-muted-foreground text-sm">{student.Department_Name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{formatEntryYear(student.Entry_Year_Id)}</TableCell>
                                        <TableCell>{getStatusBadge(student.Register_Status_Id)}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="py-8 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <Search className="text-muted-foreground h-8 w-8" />
                                            <span className="text-muted-foreground">
                                                {search ? 'Tidak ada mahasiswa yang ditemukan' : 'Tidak ada data mahasiswa'}
                                            </span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {students.total > 0 && (
                    <div className="flex items-center justify-between">
                        <div className="text-muted-foreground text-sm">
                            Menampilkan {(students.current_page - 1) * students.per_page + 1} -{' '}
                            {Math.min(students.current_page * students.per_page, students.total)} dari {students.total.toLocaleString()} mahasiswa
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(students.current_page - 1)}
                                disabled={students.current_page <= 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Previous
                            </Button>

                            {/* Page numbers */}
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, students.last_page) }, (_, i) => {
                                    let pageNum = i + 1;

                                    // Adjust page numbers to show current page in the middle
                                    if (students.last_page > 5) {
                                        const start = Math.max(1, students.current_page - 2);
                                        const end = Math.min(students.last_page, start + 4);
                                        pageNum = start + i;

                                        if (pageNum > end) return null;
                                    }

                                    return (
                                        <Button
                                            key={pageNum}
                                            variant={pageNum === students.current_page ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => handlePageChange(pageNum)}
                                            className="h-8 w-8 p-0"
                                        >
                                            {pageNum}
                                        </Button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(students.current_page + 1)}
                                disabled={students.current_page >= students.last_page}
                            >
                                Next
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
