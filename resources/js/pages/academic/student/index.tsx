import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Award, Clock, School, TrendingUp, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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
        title: 'Mahasiswa',
        href: '/academic/student',
    },
];

const StudentDetail = () => {
    // Data dummy untuk statistik mahasiswa
    const studentStats = {
        totalStudents: 12458,
        activeStudents: 11245,
        onLeaveStudents: 423,
        probationStudents: 790,
        maleStudents: 6879,
        femaleStudents: 5579,
        averageGPA: 3.42,
        averageStudyTime: 4.2, // dalam tahun
    };

    // Data dummy untuk tren mahasiswa per tahun
    const studentTrendData = [
        { year: '2020', total: 10850, active: 9865, graduated: 2145 },
        { year: '2021', total: 11230, active: 10150, graduated: 2280 },
        { year: '2022', total: 11720, active: 10620, graduated: 2345 },
        { year: '2023', total: 12130, active: 11050, graduated: 2410 },
        { year: '2024', total: 12458, active: 11245, graduated: 2567 },
    ];

    // Data dummy untuk distribusi mahasiswa per fakultas
    const facultyDistribution = [
        { name: 'Teknik', value: 3245, color: '#3b82f6' },
        { name: 'Pertanian', value: 1576, color: '#10b981' },
        { name: 'Perikanan', value: 1234, color: '#06b6d4' },
        { name: 'Ilmu Sosial', value: 1368, color: '#8b5cf6' },
        { name: 'Hukum', value: 993, color: '#f59e0b' },
        { name: 'Ekonomi', value: 1742, color: '#ef4444' },
        { name: 'Keguruan', value: 2140, color: '#ec4899' },
        { name: 'Agama Islam', value: 1560, color: '#6366f1' },
    ];

    // Data dummy untuk distribusi angkatan
    const yearDistribution = [
        { name: 'Tahun 1', value: 3568, color: '#22c55e' },
        { name: 'Tahun 2', value: 3245, color: '#3b82f6' },
        { name: 'Tahun 3', value: 2987, color: '#f59e0b' },
        { name: 'Tahun 4', value: 2458, color: '#ef4444' },
        { name: 'Tahun 5+', value: 200, color: '#6b7280' },
    ];

    // Data dummy untuk statistik IPK
    const gpaDistribution = [
        { range: '3.75-4.00', count: 1245, percentage: 10 },
        { range: '3.50-3.74', count: 2000, percentage: 16 },
        { range: '3.25-3.49', count: 2420, percentage: 19 },
        { range: '3.00-3.24', count: 2947, percentage: 24 },
        { range: '2.50-2.99', count: 1856, percentage: 15 },
        { range: '2.00-2.49', count: 1245, percentage: 10 },
        { range: '1.00-1.99', count: 620, percentage: 5 },
        { range: '0.00-0.99', count: 125, percentage: 1 },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Mahasiswa" />

            <div className="space-y-6 p-4">
                {/* Header dengan Statistik Utama */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-bold">Data Mahasiswa</h1>
                    <p className="text-muted-foreground">Informasi dan statistik lengkap tentang mahasiswa UMKendari</p>
                </div>

                {/* Statistik Ringkasan */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Total Mahasiswa</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-3xl font-bold">{studentStats.totalStudents.toLocaleString()}</div>
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                            <p className="text-muted-foreground mt-2 text-xs">Seluruh mahasiswa terdaftar</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Mahasiswa Aktif</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-3xl font-bold">{studentStats.activeStudents.toLocaleString()}</div>
                                <School className="h-8 w-8 text-green-600" />
                            </div>
                            <p className="text-muted-foreground mt-2 text-xs">
                                {((studentStats.activeStudents / studentStats.totalStudents) * 100).toFixed(1)}% dari total mahasiswa
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Rata-rata IPK</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-3xl font-bold">{studentStats.averageGPA}</div>
                                <Award className="h-8 w-8 text-amber-600" />
                            </div>
                            <p className="text-muted-foreground mt-2 text-xs">Indeks Prestasi Kumulatif rata-rata</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base">Rata-rata Masa Studi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-3xl font-bold">{studentStats.averageStudyTime} tahun</div>
                                <Clock className="h-8 w-8 text-purple-600" />
                            </div>
                            <p className="text-muted-foreground mt-2 text-xs">Durasi rata-rata penyelesaian studi</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tab untuk Kategori Data */}
                <Tabs defaultValue="demographics">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="demographics">Demografi</TabsTrigger>
                        <TabsTrigger value="trends">Tren & Perkembangan</TabsTrigger>
                        <TabsTrigger value="academic">Akademik</TabsTrigger>
                        <TabsTrigger value="status">Status & Distribusi</TabsTrigger>
                    </TabsList>

                    {/* Tab Demografi */}
                    <TabsContent value="demographics" className="pt-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Gender Distribution */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">Distribusi Gender</CardTitle>
                                    <CardDescription className="text-xs">Perbandingan jumlah mahasiswa laki-laki dan perempuan</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[250px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={[
                                                        { name: 'Laki-laki', value: studentStats.maleStudents, color: '#3b82f6' },
                                                        { name: 'Perempuan', value: studentStats.femaleStudents, color: '#ec4899' },
                                                    ]}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={90}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                >
                                                    {[
                                                        { name: 'Laki-laki', value: studentStats.maleStudents, color: '#3b82f6' },
                                                        { name: 'Perempuan', value: studentStats.femaleStudents, color: '#ec4899' },
                                                    ].map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => [`${value} mahasiswa`, '']} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex-col gap-2 text-sm">
                                    <div className="flex w-full justify-between">
                                        <span>Laki-laki: {studentStats.maleStudents.toLocaleString()}</span>
                                        <span>Perempuan: {studentStats.femaleStudents.toLocaleString()}</span>
                                    </div>
                                </CardFooter>
                            </Card>

                            {/* Distribution by Study Year */}
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">Distribusi Tahun Angkatan</CardTitle>
                                    <CardDescription className="text-xs">Jumlah mahasiswa berdasarkan tahun studi</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[250px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={yearDistribution}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={90}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                >
                                                    {yearDistribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip formatter={(value) => [`${value} mahasiswa`, '']} />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="mt-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">Distribusi Mahasiswa per Fakultas</CardTitle>
                                    <CardDescription className="text-xs">Jumlah mahasiswa berdasarkan fakultas</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart
                                                layout="vertical"
                                                data={facultyDistribution}
                                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                                <XAxis type="number" />
                                                <YAxis dataKey="name" type="category" width={100} />
                                                <Tooltip formatter={(value) => [`${value} mahasiswa`, '']} />
                                                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                                    {facultyDistribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Tab Tren & Perkembangan */}
                    <TabsContent value="trends" className="pt-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">Tren Jumlah Mahasiswa (5 Tahun Terakhir)</CardTitle>
                                <CardDescription className="text-xs">Perkembangan jumlah mahasiswa dari tahun ke tahun</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={studentTrendData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="year" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Line type="monotone" dataKey="total" name="Total Mahasiswa" stroke="#3b82f6" strokeWidth={2} />
                                            <Line type="monotone" dataKey="active" name="Mahasiswa Aktif" stroke="#22c55e" strokeWidth={2} />
                                            <Line type="monotone" dataKey="graduated" name="Lulusan" stroke="#f59e0b" strokeWidth={2} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                            <CardFooter className="text-muted-foreground text-sm">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" />
                                    <span>Pertumbuhan rata-rata 3.2% per tahun</span>
                                </div>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Tab Akademik */}
                    <TabsContent value="academic" className="pt-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">Distribusi IPK Mahasiswa</CardTitle>
                                <CardDescription className="text-xs">Persebaran IPK seluruh mahasiswa aktif</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart layout="vertical" data={gpaDistribution} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                            <XAxis type="number" />
                                            <YAxis dataKey="range" type="category" width={70} />
                                            <Tooltip
                                                formatter={(value, name, props) => {
                                                    if (name === 'count') return [`${value.toLocaleString()} mahasiswa`, 'Jumlah'];
                                                    return [`${value}%`, 'Persentase'];
                                                }}
                                            />
                                            <Bar dataKey="count" name="Jumlah" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                            <CardFooter className="text-muted-foreground text-sm">
                                <div>
                                    {gpaDistribution.slice(0, 4).reduce((acc, curr) => acc + curr.percentage, 0)}% mahasiswa memiliki IPK 3.00 atau
                                    lebih
                                </div>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    {/* Tab Status & Distribusi */}
                    <TabsContent value="status" className="pt-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">Status Akademik Mahasiswa</CardTitle>
                                    <CardDescription className="text-xs">Distribusi status mahasiswa</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[250px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={[
                                                        { name: 'Aktif', value: studentStats.activeStudents, color: '#22c55e' },
                                                        { name: 'Cuti', value: studentStats.onLeaveStudents, color: '#eab308' },
                                                        { name: 'Probation', value: studentStats.probationStudents, color: '#ef4444' },
                                                    ]}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={90}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                >
                                                    {[
                                                        { name: 'Aktif', value: studentStats.activeStudents, color: '#22c55e' },
                                                        { name: 'Cuti', value: studentStats.onLeaveStudents, color: '#eab308' },
                                                        { name: 'Probation', value: studentStats.probationStudents, color: '#ef4444' },
                                                    ].map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value) => [
                                                        `${value.toLocaleString()} mahasiswa (${((value / studentStats.totalStudents) * 100).toFixed(1)}%)`,
                                                        '',
                                                    ]}
                                                />
                                                <Legend />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-base">Detail Mahasiswa Bermasalah</CardTitle>
                                    <CardDescription className="text-xs">Mahasiswa dengan IPK di bawah standar ({'<'}2.00)</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="rounded-lg bg-red-50 p-4">
                                                <div className="text-muted-foreground text-sm">Probation</div>
                                                <div className="text-2xl font-bold">{studentStats.probationStudents}</div>
                                                <div className="text-muted-foreground text-xs">
                                                    {((studentStats.probationStudents / studentStats.totalStudents) * 100).toFixed(1)}% dari total
                                                </div>
                                            </div>
                                            <div className="rounded-lg bg-amber-50 p-4">
                                                <div className="text-muted-foreground text-sm">IPK &lt; 2.00</div>
                                                <div className="text-2xl font-bold">
                                                    {gpaDistribution.slice(6, 8).reduce((acc, curr) => acc + curr.count, 0)}
                                                </div>
                                                <div className="text-muted-foreground text-xs">
                                                    {gpaDistribution.slice(6, 8).reduce((acc, curr) => acc + curr.percentage, 0)}% dari total
                                                </div>
                                            </div>
                                        </div>
                                        <div className="border-t pt-4">
                                            <div className="text-sm font-medium">Distribusi per Fakultas</div>
                                            <ul className="mt-2 space-y-2">
                                                <li className="flex items-center justify-between">
                                                    <span className="text-sm">Teknik</span>
                                                    <span className="text-sm font-medium">127 mahasiswa</span>
                                                </li>
                                                <li className="flex items-center justify-between">
                                                    <span className="text-sm">Ekonomi</span>
                                                    <span className="text-sm font-medium">98 mahasiswa</span>
                                                </li>
                                                <li className="flex items-center justify-between">
                                                    <span className="text-sm">Lainnya</span>
                                                    <span className="text-sm font-medium">121 mahasiswa</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" size="sm" className="w-full">
                                        Lihat Daftar Lengkap
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
};

export default StudentDetail;
