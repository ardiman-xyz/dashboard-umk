import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import axios from 'axios';
import { Loader2, Search, X } from 'lucide-react';
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
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [genderFilter, setGenderFilter] = useState(initialGenderFilter);
    const [religionFilter, setReligionFilter] = useState(initialReligionFilter);
    const [ageFilter, setAgeFilter] = useState(initialAgeFilter);

    const statusColors: Record<string, string> = {
        A: 'default',
        L: 'secondary',
        C: 'destructive',
        K: 'destructive',
        P: 'destructive',
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`/academic/faculty/${facultyId}/students`, {
                params: {
                    term_year_id: termYearId,
                    student_status: studentStatus,
                    search,
                    page,
                    per_page: 20,
                    gender: genderFilter,
                    religion: religionFilter,
                    age: ageFilter,
                },
            });

            setStudents(response.data.data);
            setTotalPages(response.data.last_page);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [page, genderFilter, religionFilter, ageFilter]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setPage(1);
            fetchStudents();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    // Update URL when filters change
    const updateURL = () => {
        const url = new URL(window.location.href);

        if (genderFilter) {
            url.searchParams.set('gender', genderFilter);
        } else {
            url.searchParams.delete('gender');
        }

        if (religionFilter) {
            url.searchParams.set('religion', religionFilter);
        } else {
            url.searchParams.delete('religion');
        }

        if (ageFilter) {
            url.searchParams.set('age', ageFilter);
        } else {
            url.searchParams.delete('age');
        }

        window.history.replaceState({}, '', url.toString());
    };

    useEffect(() => {
        updateURL();
    }, [genderFilter, religionFilter, ageFilter]);

    const clearFilters = () => {
        setGenderFilter('');
        setReligionFilter('');
        setAgeFilter('');
        setSearch('');
        setPage(1);
    };

    const activeFiltersCount = [genderFilter, religionFilter, ageFilter].filter((f) => f).length;

    const handleDepartmentClick = (departmentId: string) => {
        // This function should handle department click, not student click
        // Implement proper department navigation if needed
        console.log('Department clicked:', departmentId);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Data Mahasiswa</CardTitle>
                <CardDescription>Daftar mahasiswa berdasarkan filter yang dipilih</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Filter Controls */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
                    <div className="relative">
                        <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                        <Input placeholder="Cari nama atau NIM..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
                    </div>

                    <Select value={genderFilter} onValueChange={setGenderFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Semua Gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Semua Gender</SelectItem>
                            <SelectItem value="laki">Laki-laki</SelectItem>
                            <SelectItem value="perempuan">Perempuan</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={religionFilter} onValueChange={setReligionFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Semua Agama" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Semua Agama</SelectItem>
                            <SelectItem value="Islam">Islam</SelectItem>
                            <SelectItem value="Kristen">Kristen</SelectItem>
                            <SelectItem value="Katolik">Katolik</SelectItem>
                            <SelectItem value="Hindu">Hindu</SelectItem>
                            <SelectItem value="Buddha">Buddha</SelectItem>
                            <SelectItem value="Konghucu">Konghucu</SelectItem>
                            <SelectItem value="Lainnya">Lainnya</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select value={ageFilter} onValueChange={setAgeFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Semua Umur" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Semua Umur</SelectItem>
                            <SelectItem value="17-19">17-19 tahun</SelectItem>
                            <SelectItem value="20-22">20-22 tahun</SelectItem>
                            <SelectItem value="23-25">23-25 tahun</SelectItem>
                            <SelectItem value="26-30">26-30 tahun</SelectItem>
                            <SelectItem value="> 30">&gt; 30 tahun</SelectItem>
                        </SelectContent>
                    </Select>

                    {activeFiltersCount > 0 && (
                        <Button variant="outline" onClick={clearFilters} className="gap-2">
                            <X className="h-4 w-4" />
                            Clear Filters ({activeFiltersCount})
                        </Button>
                    )}
                </div>

                {/* Students Table */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>NIM</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Program Studi</TableHead>
                                <TableHead>Angkatan</TableHead>
                                <TableHead>Gender</TableHead>
                                <TableHead>Agama</TableHead>
                                <TableHead>Umur</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="py-8 text-center">
                                        <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                                    </TableCell>
                                </TableRow>
                            ) : students.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-muted-foreground py-8 text-center">
                                        Tidak ada data mahasiswa yang ditemukan
                                    </TableCell>
                                </TableRow>
                            ) : (
                                students.map((student) => (
                                    <TableRow key={student.Student_Id}>
                                        <TableCell className="font-medium">{student.Nim || student.Student_Id}</TableCell>
                                        <TableCell>{student.Full_Name || student.Student_Name || '-'}</TableCell>
                                        <TableCell>
                                            <span className="text-sm">{student.Department_Acronym}</span>
                                        </TableCell>
                                        <TableCell>{student.Entry_Year_Id}</TableCell>
                                        <TableCell>{student.Gender_Name || '-'}</TableCell>
                                        <TableCell>{student.Religion_Display_Name || student.Religion_Name || '-'}</TableCell>
                                        <TableCell>{student.Age ? `${student.Age} tahun` : '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant={statusColors[student.Register_Status_Id] as any}>
                                                {student.Status_Name || student.Register_Status_Id}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                        <p className="text-muted-foreground text-sm">
                            Halaman {page} dari {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                                Previous
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
