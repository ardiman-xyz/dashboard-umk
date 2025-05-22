import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { PageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface FacultyData {
    faculty: string;
    faculty_id: string | number;
    current: number;
    previous: number;
    percent_change: number;
}

interface FacultyDistribution {
    total_current: number;
    total_previous: number;
    percent_change: number;
    distribution: FacultyData[];
}

interface AcademicStatsProps {
    facultyDistribution: FacultyDistribution;
    [key: string]: any;
}

interface PagePropsWithStats extends PageProps {
    stats: AcademicStatsProps;
    filters?: {
        currentTerm?: {
            id: string;
            name: string;
        };
    };
}

const chartConfig = {
    current: {
        label: 'Tahun Ini',
        color: '#2A9D90', // Warna teal eksplisit
    },
    previous: {
        label: 'Tahun Lalu',
        color: '#E76E50', // Warna oranye eksplisit
    },
} satisfies ChartConfig;

export function FacultyDistributionChart() {
    const { stats, filters } = usePage<PagePropsWithStats>().props;
    const [chartData, setChartData] = useState<FacultyData[]>([]);
    const [totalCurrent, setTotalCurrent] = useState<number>(0);
    const [totalPrevious, setTotalPrevious] = useState<number>(0);
    const [percentChange, setPercentChange] = useState<number>(0);
    const [isAllFilter, setIsAllFilter] = useState<boolean>(false);

    useEffect(() => {
        // Cek apakah filter saat ini adalah 'all'
        const currentFilterIsAll = filters?.currentTerm?.id === 'all' || !filters?.currentTerm?.id;
        setIsAllFilter(currentFilterIsAll);

        // Jika data tersedia dari props, gunakan itu
        if (stats?.facultyDistribution?.distribution) {
            setChartData(stats.facultyDistribution.distribution);
            setTotalCurrent(stats.facultyDistribution.total_current);
            setTotalPrevious(stats.facultyDistribution.total_previous);
            setPercentChange(stats.facultyDistribution.percent_change);
        } else {
            // Data dummy jika data tidak tersedia
            const dummyData = [
                {
                    faculty: 'Teknik',
                    faculty_id: 1,
                    current: 1845,
                    previous: currentFilterIsAll ? 0 : 1720,
                    percent_change: currentFilterIsAll ? 0 : 7.3,
                },
                {
                    faculty: 'Pertanian',
                    faculty_id: 2,
                    current: 1576,
                    previous: currentFilterIsAll ? 0 : 1450,
                    percent_change: currentFilterIsAll ? 0 : 8.7,
                },
                {
                    faculty: 'Perikanan',
                    faculty_id: 3,
                    current: 1234,
                    previous: currentFilterIsAll ? 0 : 1150,
                    percent_change: currentFilterIsAll ? 0 : 7.3,
                },
                {
                    faculty: 'Ilmu Sosial',
                    faculty_id: 4,
                    current: 1368,
                    previous: currentFilterIsAll ? 0 : 1300,
                    percent_change: currentFilterIsAll ? 0 : 5.2,
                },
                {
                    faculty: 'Hukum',
                    faculty_id: 5,
                    current: 993,
                    previous: currentFilterIsAll ? 0 : 940,
                    percent_change: currentFilterIsAll ? 0 : 5.6,
                },
                {
                    faculty: 'Ekonomi',
                    faculty_id: 6,
                    current: 1742,
                    previous: currentFilterIsAll ? 0 : 1650,
                    percent_change: currentFilterIsAll ? 0 : 5.6,
                },
                {
                    faculty: 'Keguruan',
                    faculty_id: 7,
                    current: 2140,
                    previous: currentFilterIsAll ? 0 : 2050,
                    percent_change: currentFilterIsAll ? 0 : 4.4,
                },
                {
                    faculty: 'Agama Islam',
                    faculty_id: 8,
                    current: 1560,
                    previous: currentFilterIsAll ? 0 : 1480,
                    percent_change: currentFilterIsAll ? 0 : 5.4,
                },
            ];

            setChartData(dummyData);

            // Hitung total dan persentase perubahan
            const dummyTotalCurrent = dummyData.reduce((sum, item) => sum + item.current, 0);
            const dummyTotalPrevious = currentFilterIsAll ? 0 : dummyData.reduce((sum, item) => sum + item.previous, 0);
            const dummyPercentChange = currentFilterIsAll ? 0 : ((dummyTotalCurrent - dummyTotalPrevious) / dummyTotalPrevious) * 100;

            setTotalCurrent(dummyTotalCurrent);
            setTotalPrevious(dummyTotalPrevious);
            setPercentChange(currentFilterIsAll ? 0 : parseFloat(dummyPercentChange.toFixed(1)));
        }
    }, [stats, filters]);

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Distribusi Mahasiswa per Fakultas</CardTitle>
                <CardDescription className="text-xs">
                    {isAllFilter ? 'Total seluruh mahasiswa aktif per fakultas' : 'Total mahasiswa berdasarkan fakultas UMKendari'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart data={chartData} margin={{ left: 0, right: 0, top: 10, bottom: 10 }} barGap={4} layout="vertical" height={300}>
                        <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" />
                        <YAxis dataKey="faculty" type="category" tickLine={false} axisLine={false} width={100} fontSize={12} />
                        <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                        <ChartTooltip
                            cursor={false}
                            content={(props) => {
                                if (props?.payload && props.payload.length > 0) {
                                    const data = props.payload[0].payload as FacultyData;

                                    return (
                                        <div className="border-border bg-background rounded-lg border p-2 shadow-md">
                                            <div className="font-medium">{data.faculty}</div>
                                            <div className="text-sm">
                                                {isAllFilter ? 'Total' : 'Tahun Ini'}: <span className="font-medium">{data.current}</span> mahasiswa
                                            </div>
                                            {!isAllFilter && (
                                                <>
                                                    <div className="text-sm">
                                                        Tahun Lalu: <span className="font-medium">{data.previous}</span> mahasiswa
                                                    </div>
                                                    <div className="text-muted-foreground text-xs">
                                                        {data.percent_change >= 0 ? 'Naik' : 'Turun'} {Math.abs(data.percent_change)}% dari tahun lalu
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
                        <Bar dataKey="current" fill={chartConfig.current.color} radius={[0, 4, 4, 0]} maxBarSize={30} />

                        {/* Bar untuk data previous (hanya jika bukan filter 'all') */}
                        {!isAllFilter && <Bar dataKey="previous" fill={chartConfig.previous.color} radius={[0, 4, 4, 0]} maxBarSize={30} />}
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                {isAllFilter ? (
                    <>
                        <div className="flex gap-2 leading-none font-medium">Total {totalCurrent.toLocaleString()} mahasiswa aktif</div>
                        <div className="text-muted-foreground leading-none">Menampilkan seluruh mahasiswa aktif per fakultas</div>
                    </>
                ) : (
                    <>
                        <div className="flex gap-2 leading-none font-medium">
                            {percentChange >= 0 ? (
                                <>
                                    Meningkat {percentChange}% dari tahun lalu <TrendingUp className="h-4 w-4 text-green-500" />
                                </>
                            ) : (
                                <>
                                    Menurun {Math.abs(percentChange)}% dari tahun lalu <TrendingDown className="h-4 w-4 text-red-500" />
                                </>
                            )}
                        </div>
                        <div className="text-muted-foreground leading-none">Total {totalCurrent.toLocaleString()} mahasiswa tahun ini</div>
                    </>
                )}
            </CardFooter>
        </Card>
    );
}
