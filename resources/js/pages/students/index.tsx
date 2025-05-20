// StudentDashboard.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartTooltip } from '@/components/ui/chart';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { BookOpen, CalendarClock, GraduationCap, Users } from 'lucide-react';
import { Pie, PieChart, ResponsiveContainer } from 'recharts';
import { DashboardFilter } from '../_components/DashboardFilter';
import StudentStatus from './_components/StudentStatus';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Mahasiswa',
        href: '/dashboard/students',
    },
];

export default function StudentDashboard() {
    // Dummy data untuk dashboard
    const studentStats = {
        totalStudents: 12458,
        activeStudents: 11245,
        onLeaveStudents: 423,
        probationStudents: 790,
        newStudents: 3240,
        graduatingStudents: 2567,
        averageGPA: 3.42,
        attendanceRate: 87,
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Mahasiswa" />

            <div className="space-y-6 p-4">
                <DashboardFilter onSearch={() => {}} />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Mahasiswa</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-3xl font-bold">{studentStats.totalStudents.toLocaleString()}</div>
                                <Users className="h-8 w-8 text-blue-600" />
                            </div>
                            <p className="text-muted-foreground mt-2 text-xs">{studentStats.newStudents} mahasiswa baru tahun ini</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Rata-rata IPK</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-3xl font-bold">{studentStats.averageGPA}</div>
                                <BookOpen className="h-8 w-8 text-indigo-600" />
                            </div>
                            <p className="text-muted-foreground mt-2 text-xs">0.1 lebih tinggi dari semester lalu</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Tingkat Kehadiran</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-3xl font-bold">{studentStats.attendanceRate}%</div>
                                <CalendarClock className="h-8 w-8 text-green-600" />
                            </div>
                            <p className="text-muted-foreground mt-2 text-xs">2% lebih tinggi dari semester lalu</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Menjelang Lulus</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="text-3xl font-bold">{studentStats.graduatingStudents.toLocaleString()}</div>
                                <GraduationCap className="h-8 w-8 text-purple-600" />
                            </div>
                            <p className="text-muted-foreground mt-2 text-xs">Diperkirakan lulus tahun ini</p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Status Mahasiswa</CardTitle>
                            <CardDescription>Distribusi mahasiswa berdasarkan status akademik</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Aktif', value: studentStats.activeStudents, fill: '#22c55e' },
                                                { name: 'Cuti', value: studentStats.onLeaveStudents, fill: '#eab308' },
                                                { name: 'Probation', value: studentStats.probationStudents, fill: '#ef4444' },
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={90}
                                            paddingAngle={2}
                                            dataKey="value"
                                        />
                                        <ChartTooltip
                                            content={(props) => {
                                                if (props?.payload && props.payload.length > 0) {
                                                    const data = props.payload[0];
                                                    const value = data.value !== undefined ? data.value : 0;
                                                    return (
                                                        <div className="border-border bg-background rounded-lg border p-2 shadow-md">
                                                            <p className="text-sm font-medium">{data.name}</p>
                                                            <p className="text-sm">
                                                                {value.toLocaleString()} mahasiswa (
                                                                {((value / studentStats.totalStudents) * 100).toFixed(1)}%)
                                                            </p>
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="mt-2 flex justify-center gap-4">
                                <div className="flex items-center text-sm">
                                    <div className="mr-2 h-3 w-3 rounded-full bg-green-500"></div>
                                    <span>Aktif ({((studentStats.activeStudents / studentStats.totalStudents) * 100).toFixed(1)}%)</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <div className="mr-2 h-3 w-3 rounded-full bg-yellow-500"></div>
                                    <span>Cuti ({((studentStats.onLeaveStudents / studentStats.totalStudents) * 100).toFixed(1)}%)</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <div className="mr-2 h-3 w-3 rounded-full bg-red-500"></div>
                                    <span>Probation ({((studentStats.probationStudents / studentStats.totalStudents) * 100).toFixed(1)}%)</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <StudentStatus />
                </div>

                {/* <Tabs defaultValue="demographics">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="demographics">Demografi</TabsTrigger>
                        <TabsTrigger value="academic">Akademik</TabsTrigger>
                        <TabsTrigger value="attendance">Kehadiran</TabsTrigger>
                        <TabsTrigger value="geographic">Geografis</TabsTrigger>
                    </TabsList>

                    <TabsContent value="demographics" className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Distribusi Agama</CardTitle>
                                    <CardDescription>Jumlah mahasiswa berdasarkan agama yang dianut</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={religionData}
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={100}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                                                >
                                                    {religionData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <ChartTooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Trend Pendaftaran</CardTitle>
                                    <CardDescription>Jumlah mahasiswa per tahun (5 tahun terakhir)</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[300px]">
                                        <ChartContainer config={enrollmentChartConfig}>
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={enrollmentTrendData}>
                                                    <XAxis dataKey="year" />
                                                    <YAxis />
                                                    <ChartTooltip />
                                                    <Line type="monotone" dataKey="students" strokeWidth={2} activeDot={{ r: 8 }} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </ChartContainer>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <p className="text-muted-foreground text-sm">Pertumbuhan rata-rata: 3.5% per tahun</p>
                                </CardFooter>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="academic" className="mt-4 space-y-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Mahasiswa Berprestasi</CardTitle>
                                    <CardDescription>Mahasiswa dengan IPK tertinggi</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>NIM</TableHead>
                                                <TableHead>Nama</TableHead>
                                                <TableHead>Program Studi</TableHead>
                                                <TableHead className="text-right">IPK</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {topPerformingStudents.map((student) => (
                                                <TableRow key={student.id}>
                                                    <TableCell className="font-medium">{student.id}</TableCell>
                                                    <TableCell>{student.name}</TableCell>
                                                    <TableCell>{student.program}</TableCell>
                                                    <TableCell className="text-right">{student.gpa}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="outline" size="sm" className="ml-auto">
                                        Lihat Semua <ArrowUpRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Distribusi Beasiswa</CardTitle>
                                    <CardDescription>Jumlah mahasiswa penerima beasiswa</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Jenis Beasiswa</TableHead>
                                                <TableHead className="text-right">Penerima</TableHead>
                                                <TableHead className="text-right">Total Dana</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {scholarshipData.map((scholarship, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">{scholarship.name}</TableCell>
                                                    <TableCell className="text-right">{scholarship.students}</TableCell>
                                                    <TableCell className="text-right">Rp {scholarship.amount}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                                <CardFooter>
                                    <p className="text-muted-foreground text-sm">
                                        Total penerima: {scholarshipData.reduce((sum, item) => sum + item.students, 0)} mahasiswa
                                    </p>
                                </CardFooter>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="attendance" className="mt-4 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tingkat Kehadiran Bulanan</CardTitle>
                                <CardDescription>Persentase kehadiran mahasiswa per bulan</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ChartContainer config={attendanceChartConfig}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={attendanceData}>
                                                <XAxis dataKey="month" />
                                                <YAxis domain={[75, 100]} tickFormatter={(value) => `${value}%`} />
                                                <ChartTooltip formatter={(value) => [`${value}%`, 'Kehadiran']} />
                                                <Line type="monotone" dataKey="attendance" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </ChartContainer>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <p className="text-muted-foreground text-sm">
                                    Rata-rata kehadiran: {attendanceData.reduce((sum, item) => sum + item.attendance, 0) / attendanceData.length}%
                                </p>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="geographic" className="mt-4 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Distribusi Geografis</CardTitle>
                                <CardDescription>Asal provinsi mahasiswa</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[400px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={geographicData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                            <XAxis type="number" />
                                            <YAxis type="category" dataKey="province" width={120} />
                                            <ChartTooltip />
                                            <Bar dataKey="students" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" size="sm">
                                    <MapPin className="mr-2 h-4 w-4" />
                                    Lihat Peta Sebaran
                                </Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs> */}
            </div>
        </AppLayout>
    );
}
