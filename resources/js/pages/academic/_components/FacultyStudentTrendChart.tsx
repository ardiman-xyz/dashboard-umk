import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

interface StudentTrendData {
    Term_Year_Id: string;
    Term_Year_Name: string;
    student_count: number;
}

interface FacultyStudentTrendChartProps {
    studentTrend: StudentTrendData[];
    facultyName: string;
}

const chartConfig = {
    student_count: {
        label: 'Jumlah Mahasiswa',
        color: '#2563eb',
    },
} satisfies ChartConfig;

export default function FacultyStudentTrendChart({ studentTrend, facultyName }: FacultyStudentTrendChartProps) {
    // Sort data berdasarkan Term_Year_Id dan ambil 10 data terbaru
    const sortedTrend = [...studentTrend].sort((a, b) => a.Term_Year_Id.localeCompare(b.Term_Year_Id)).slice(-10);

    const chartData = sortedTrend.map((item) => {
        // Format nama semester untuk tampilan yang lebih baik
        const year = item.Term_Year_Id.substring(0, 4);
        const semester = item.Term_Year_Id.substring(4, 5);
        const semesterName = semester === '1' ? 'Ganjil' : semester === '2' ? 'Genap' : 'Pendek';

        return {
            term: `${semesterName.substr(0, 1)}${year.substr(2)}`, // Format: G23, N23, dst
            fullName: item.Term_Year_Name || `${semesterName} ${year}`,
            value: item.student_count,
            termId: item.Term_Year_Id,
        };
    });

    // Hitung tren (perbandingan semester terakhir dengan sebelumnya)
    const calculateTrend = () => {
        if (chartData.length < 2) return { change: 0, type: 'neutral' };

        const latest = chartData[chartData.length - 1];
        const previous = chartData[chartData.length - 2];

        const change = latest.value - previous.value;
        const percentChange = previous.value > 0 ? (change / previous.value) * 100 : 0;

        return {
            change: Math.abs(change),
            percentChange: Math.abs(percentChange).toFixed(1),
            type: change >= 0 ? 'up' : 'down',
        };
    };

    const trend = calculateTrend();
    const averageStudents = chartData.length > 0 ? Math.round(chartData.reduce((sum, item) => sum + item.value, 0) / chartData.length) : 0;

    const highestSemester = chartData.length > 0 ? [...chartData].sort((a, b) => b.value - a.value)[0] : null;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Tren Mahasiswa per Semester</CardTitle>
                <CardDescription>Perkembangan jumlah mahasiswa aktif di {facultyName} dalam 10 semester terakhir</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="term" tickLine={false} axisLine={false} padding={{ left: 10, right: 10 }} fontSize={12} />
                        <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => value.toString()} fontSize={12} />
                        <ChartTooltip
                            content={({ active, payload }) => {
                                if (active && payload && payload.length > 0) {
                                    const data = payload[0].payload;

                                    return (
                                        <div className="bg-background border-border rounded-lg border p-2 shadow-md">
                                            <p className="font-medium">{data.fullName}</p>
                                            <p className="text-sm">{data.value.toLocaleString()} mahasiswa aktif</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="value"
                            stroke="#2563eb"
                            strokeWidth={2.5}
                            dot={{ r: 4, strokeWidth: 0, fill: '#2563eb' }}
                            activeDot={{ r: 6, strokeWidth: 0 }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    {trend.type === 'up' ? (
                        <>
                            Meningkat {trend.change} mahasiswa ({trend.percentChange}%) dari semester lalu
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </>
                    ) : trend.type === 'down' ? (
                        <>
                            Menurun {trend.change} mahasiswa ({trend.percentChange}%) dari semester lalu
                            <TrendingDown className="h-4 w-4 text-red-500" />
                        </>
                    ) : (
                        'Data tren tidak tersedia'
                    )}
                </div>
                <div className="text-muted-foreground leading-none">
                    Rata-rata {averageStudents.toLocaleString()} mahasiswa per semester
                    {highestSemester && ` • Puncak: ${highestSemester.fullName} (${highestSemester.value.toLocaleString()})`}
                </div>
            </CardFooter>
        </Card>
    );
}
