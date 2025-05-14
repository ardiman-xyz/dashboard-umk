import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ChevronLeft, Download, Filter, Search, UserCircle } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Data dummy untuk mahasiswa aktif
const dummyStudents = [
    { id: 1, nim: '22110001', name: 'Ahmad Fauzi', faculty: 'Teknik', department: 'Teknik Informatika', entryYear: '2022', status: 'Aktif' },
    { id: 2, nim: '22110002', name: 'Siti Fatimah', faculty: 'Teknik', department: 'Teknik Informatika', entryYear: '2022', status: 'Aktif' },
    { id: 3, nim: '21120034', name: 'Budi Santoso', faculty: 'Ekonomi', department: 'Manajemen', entryYear: '2021', status: 'Aktif' },
    { id: 4, nim: '21120056', name: 'Dewi Anggraini', faculty: 'Ekonomi', department: 'Akuntansi', entryYear: '2021', status: 'Aktif' },
    { id: 5, nim: '20130078', name: 'Muhammad Rizki', faculty: 'Hukum', department: 'Ilmu Hukum', entryYear: '2020', status: 'Aktif' },
    { id: 6, nim: '23110012', name: 'Anisa Putri', faculty: 'Teknik', department: 'Teknik Sipil', entryYear: '2023', status: 'Aktif' },
    { id: 7, nim: '22120089', name: 'Agus Hermawan', faculty: 'Ekonomi', department: 'Ekonomi Pembangunan', entryYear: '2022', status: 'Aktif' },
    { id: 8, nim: '23110045', name: 'Ratna Sari', faculty: 'Teknik', department: 'Teknik Elektro', entryYear: '2023', status: 'Aktif' },
    { id: 9, nim: '20140032', name: 'Hendra Wijaya', faculty: 'FKIP', department: 'Pendidikan Matematika', entryYear: '2020', status: 'Aktif' },
    { id: 10, nim: '21130067', name: 'Maya Indah', faculty: 'Pertanian', department: 'Agribisnis', entryYear: '2021', status: 'Aktif' },
    { id: 11, nim: '22110101', name: 'Dian Purnama', faculty: 'Teknik', department: 'Teknik Informatika', entryYear: '2022', status: 'Aktif' },
    { id: 12, nim: '20130045', name: 'Yoga Pratama', faculty: 'Hukum', department: 'Ilmu Hukum', entryYear: '2020', status: 'Aktif' },
];

// Data dummy untuk chart distribusi fakultas
const facultyDistributionData = [
    { name: 'Teknik', value: 8543 },
    { name: 'Ekonomi', value: 6721 },
    { name: 'FKIP', value: 5432 },
    { name: 'Pertanian', value: 3254 },
    { name: 'Hukum', value: 2654 },
];

// Data dummy untuk chart distribusi angkatan
const entryYearDistributionData = [
    { name: '2020', value: 5124 },
    { name: '2021', value: 5876 },
    { name: '2022', value: 6329 },
    { name: '2023', value: 6938 },
];

// Warna untuk chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Akademik',
        href: '/academic',
    },
    {
        title: 'Mahasiswa Aktif',
        href: '/academic/mahasiswa-aktif',
    },
];

export default function ActiveStudentsDetail() {
    const [searchTerm, setSearchTerm] = useState('');
    const [facultyFilter, setFacultyFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [yearFilter, setYearFilter] = useState('all');

    // Filter mahasiswa berdasarkan pencarian dan filter
    const filteredStudents = dummyStudents.filter((student) => {
        // Filter pencarian
        const matchSearch =
            student.nim.toLowerCase().includes(searchTerm.toLowerCase()) || student.name.toLowerCase().includes(searchTerm.toLowerCase());

        // Filter fakultas
        const matchFaculty = facultyFilter === 'all' || student.faculty === facultyFilter;

        // Filter program studi
        const matchDepartment = departmentFilter === 'all' || student.department === departmentFilter;

        // Filter tahun masuk
        const matchYear = yearFilter === 'all' || student.entryYear === yearFilter;

        return matchSearch && matchFaculty && matchDepartment && matchYear;
    });

    // Daftar unik fakultas, program studi, dan tahun masuk untuk filter
    const faculties = [...new Set(dummyStudents.map((student) => student.faculty))];
    const departments = [...new Set(dummyStudents.map((student) => student.department))];
    const entryYears = [...new Set(dummyStudents.map((student) => student.entryYear))];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mahasiswa Aktif" />

            <div className="container mx-auto p-4">
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" asChild>
                            <a href="/academic">
                                <ChevronLeft className="h-4 w-4" />
                            </a>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold">Mahasiswa Aktif</h1>
                            <p className="text-muted-foreground">Detail mahasiswa terdaftar semester ini</p>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Download className="mr-2 h-4 w-4" />
                            Export
                        </Button>
                    </div>
                </div>

                <div className="mb-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle>Statistik Mahasiswa Aktif</CardTitle>
                            <CardDescription>Total 24.267 mahasiswa aktif terdaftar pada semester ini</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="faculty" className="w-full">
                                <TabsList className="mb-4 grid w-full grid-cols-2">
                                    <TabsTrigger value="faculty">Distribusi Fakultas</TabsTrigger>
                                    <TabsTrigger value="entryYear">Distribusi Angkatan</TabsTrigger>
                                </TabsList>

                                <TabsContent value="faculty">
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                data={facultyDistributionData}
                                                margin={{
                                                    top: 20,
                                                    right: 30,
                                                    left: 20,
                                                    bottom: 5,
                                                }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="name" />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="value" name="Jumlah Mahasiswa" fill="#3b82f6" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </TabsContent>

                                <TabsContent value="entryYear">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div className="h-80">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={entryYearDistributionData}
                                                    margin={{
                                                        top: 20,
                                                        right: 30,
                                                        left: 20,
                                                        bottom: 5,
                                                    }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" />
                                                    <YAxis />
                                                    <Tooltip />
                                                    <Legend />
                                                    <Bar dataKey="value" name="Jumlah Mahasiswa" fill="#22c55e" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>

                                        <div className="h-80">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={entryYearDistributionData}
                                                        cx="50%"
                                                        cy="50%"
                                                        labelLine={false}
                                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                        outerRadius={80}
                                                        fill="#8884d8"
                                                        dataKey="value"
                                                    >
                                                        {entryYearDistributionData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div>
                                <CardTitle>Daftar Mahasiswa Aktif</CardTitle>
                                <CardDescription>
                                    {filteredStudents.length} mahasiswa ditampilkan dari total {dummyStudents.length}
                                </CardDescription>
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                <div className="relative">
                                    <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
                                    <Input
                                        placeholder="Cari NIM atau nama..."
                                        className="pl-8"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Button variant="outline" className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    <span>Filter</span>
                                </Button>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
                            <Select value={facultyFilter} onValueChange={setFacultyFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter Fakultas" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Fakultas</SelectItem>
                                    {faculties.map((faculty) => (
                                        <SelectItem key={faculty} value={faculty}>
                                            {faculty}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter Program Studi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Program Studi</SelectItem>
                                    {departments.map((dept) => (
                                        <SelectItem key={dept} value={dept}>
                                            {dept}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={yearFilter} onValueChange={setYearFilter}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter Angkatan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Angkatan</SelectItem>
                                    {entryYears.map((year) => (
                                        <SelectItem key={year} value={year}>
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12 text-center">#</TableHead>
                                        <TableHead>NIM</TableHead>
                                        <TableHead>Nama Lengkap</TableHead>
                                        <TableHead>Fakultas</TableHead>
                                        <TableHead>Program Studi</TableHead>
                                        <TableHead>Angkatan</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStudents.length > 0 ? (
                                        filteredStudents.map((student, index) => (
                                            <TableRow key={student.id}>
                                                <TableCell className="text-center">{index + 1}</TableCell>
                                                <TableCell className="font-medium">{student.nim}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <UserCircle className="text-muted-foreground h-5 w-5" />
                                                        {student.name}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{student.faculty}</TableCell>
                                                <TableCell>{student.department}</TableCell>
                                                <TableCell>{student.entryYear}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="bg-green-100 text-green-800">
                                                        {student.status}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center">
                                                Tidak ada data mahasiswa yang sesuai dengan filter.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
