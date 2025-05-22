import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface FacultyData {
    faculty: string;
    faculty_acronym: string;
    faculty_id: string;
    current: number;
    previous: number;
    percent_change: number;
}

interface FacultyDistributionProps {
    distribution: FacultyData[];
    total_current: number;
    total_previous: number;
    percent_change: number;
}

const StudentDistribution: React.FC<{
    facultyDistribution?: FacultyDistributionProps;
    isAllFilter?: boolean; // Tambahan prop untuk menentukan filter
    studentStatus?: string; // Tambahan prop untuk status mahasiswa
}> = ({ facultyDistribution, isAllFilter = false, studentStatus = 'all' }) => {
    // Data fallback dengan logic untuk filter all
    const fallbackData = [
        { faculty: 'FKIP', current: 380, previous: isAllFilter ? 0 : 340 },
        { faculty: 'TEKNIK', current: 320, previous: isAllFilter ? 0 : 290 },
        { faculty: 'EKONOMI DAN BISNIS ISLAM', current: 300, previous: isAllFilter ? 0 : 340 },
        { faculty: 'HUKUM', current: 240, previous: isAllFilter ? 0 : 220 },
        { faculty: 'PERIKANAN DAN ILMU KELAUTAN', current: 160, previous: isAllFilter ? 0 : 120 },
        { faculty: 'AGAMA ISLAM', current: 140, previous: isAllFilter ? 0 : 130 },
        { faculty: 'ILMU SOSIAL DAN ILMU POLITIK', current: 120, previous: isAllFilter ? 0 : 110 },
        { faculty: 'PERTANIAN', current: 90, previous: isAllFilter ? 0 : 100 },
    ];

    // Gunakan data dari fakultyDistribution jika tersedia, jika tidak gunakan fallback
    const chartData = facultyDistribution
        ? facultyDistribution.distribution.map((item) => ({
              faculty: item.faculty_acronym === 'T' ? item.faculty : item.faculty_acronym,
              current: item.current,
              previous: item.previous,
          }))
        : fallbackData;

    // Dynamic title dan description berdasarkan filter
    const getChartTitle = () => {
        if (studentStatus === 'active') {
            return 'Distribusi Mahasiswa Aktif per Fakultas';
        }
        return 'Distribusi Mahasiswa per Fakultas';
    };

    const getChartDescription = () => {
        if (studentStatus === 'active') {
            if (isAllFilter) {
                return 'Mahasiswa yang mengambil KRS di semester saat ini';
            }
            return 'Mahasiswa aktif berdasarkan fakultas UMKendari';
        }

        if (isAllFilter) {
            return 'Total seluruh mahasiswa per fakultas';
        }
        return 'Total mahasiswa berdasarkan fakultas UMKendari';
    };

    // Dynamic footer text
    const getFooterText = () => {
        const total = chartData.reduce((sum, item) => sum + item.current, 0);

        if (studentStatus === 'active') {
            return isAllFilter ? `Total ${total.toLocaleString()} mahasiswa aktif semester ini` : `Total ${total.toLocaleString()} mahasiswa aktif`;
        }

        return isAllFilter ? `Total ${total.toLocaleString()} mahasiswa terdaftar` : `Menampilkan total mahasiswa per fakultas pada semester ini`;
    };

    const getFooterDescription = () => {
        if (studentStatus === 'active') {
            return 'Mahasiswa yang mengambil mata kuliah di semester berjalan';
        }

        return isAllFilter ? 'Menampilkan seluruh mahasiswa per fakultas' : 'Menampilkan total mahasiswa per fakultas pada semester ini';
    };

    // Gunakan persentase perubahan dari data jika tersedia
    const percentChange = facultyDistribution ? facultyDistribution.percent_change : isAllFilter ? 0 : 5.2;

    // Konfigurasi chart untuk fakultas
    const facultyChartConfig = {
        current: {
            label: studentStatus === 'active' ? 'Mahasiswa Aktif' : isAllFilter ? 'Total Mahasiswa' : 'Tahun Ini',
            color: '#283618', // Hijau tua
        },
        previous: {
            label: 'Tahun Lalu',
            color: '#dda15e', // Cokelat
        },
    } satisfies ChartConfig;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{getChartTitle()}</CardTitle>
                <CardDescription>{getChartDescription()}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={facultyChartConfig} className="h-[300px] w-full">
                    <BarChart data={chartData} layout="horizontal" margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="faculty"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            angle={-20}
                            textAnchor="end"
                            interval={0}
                            height={100}
                            fontSize={10}
                        />
                        <YAxis tickLine={false} axisLine={false} domain={[0, 'dataMax + 50']} tickCount={6} />
                        <ChartTooltip
                            cursor={false}
                            content={(props) => {
                                if (props?.payload && props.payload.length > 0) {
                                    const data = props.payload[0].payload;

                                    return (
                                        <div className="border-border bg-background rounded-lg border p-2 shadow-md">
                                            <div className="font-medium">{data.faculty}</div>
                                            <div className="text-sm">
                                                {studentStatus === 'active' ? 'Mahasiswa Aktif' : isAllFilter ? 'Total' : 'Tahun Ini'}:{' '}
                                                <span className="font-medium">{data.current}</span> mahasiswa
                                            </div>
                                            {!isAllFilter && data.previous > 0 && studentStatus !== 'active' && (
                                                <>
                                                    <div className="text-sm">
                                                        Tahun Lalu: <span className="font-medium">{data.previous}</span> mahasiswa
                                                    </div>
                                                    <div className="text-muted-foreground text-xs">
                                                        {((data.current - data.previous) / data.previous) * 100 >= 0 ? 'Naik' : 'Turun'}{' '}
                                                        {Math.abs(((data.current - data.previous) / data.previous) * 100).toFixed(1)}% dari tahun lalu
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />

                        {/* Bar untuk data current (selalu ditampilkan) */}
                        <Bar
                            dataKey="current"
                            fill="#283618" // Hijau tua (sesuai dengan screenshot)
                            radius={[4, 4, 0, 0]}
                            barSize={20}
                        />

                        {/* Bar untuk data previous (hanya jika bukan filter 'all' dan bukan status 'active') */}
                        {!isAllFilter && studentStatus !== 'active' && (
                            <Bar
                                dataKey="previous"
                                fill="#dda15e" // Cokelat (sesuai dengan screenshot)
                                radius={[4, 4, 0, 0]}
                                barSize={20}
                            />
                        )}
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                {isAllFilter || studentStatus === 'active' ? (
                    <>
                        <div className="flex gap-2 leading-none font-medium">{getFooterText()}</div>
                        <div className="text-muted-foreground leading-none">{getFooterDescription()}</div>
                    </>
                ) : (
                    <>
                        <div className="flex gap-2 leading-none font-medium">
                            {percentChange >= 0 ? (
                                <>
                                    Meningkat {percentChange}% dibandingkan tahun lalu <TrendingUp className="h-4 w-4 text-green-500" />
                                </>
                            ) : (
                                <>
                                    Menurun {Math.abs(percentChange)}% dibandingkan tahun lalu <TrendingDown className="h-4 w-4 text-red-500" />
                                </>
                            )}
                        </div>
                        <div className="text-muted-foreground leading-none">Menampilkan total mahasiswa per fakultas pada semester ini</div>
                    </>
                )}
            </CardFooter>
        </Card>
    );
};

export default StudentDistribution;
