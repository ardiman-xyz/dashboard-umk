'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Data tingkat kehadiran per bulan
const chartData = [
    { month: 'Jan', attendance: 89, label: 'Januari' },
    { month: 'Feb', attendance: 92, label: 'Februari' },
    { month: 'Mar', attendance: 87, label: 'Maret' },
    { month: 'Apr', attendance: 91, label: 'April' },
    { month: 'May', attendance: 85, label: 'Mei' },
    { month: 'Jun', attendance: 88, label: 'Juni' },
    { month: 'Jul', attendance: 86, label: 'Juli' },
    { month: 'Aug', attendance: 93, label: 'Agustus' },
    { month: 'Sep', attendance: 90, label: 'September' },
    { month: 'Oct', attendance: 87, label: 'Oktober' },
    { month: 'Nov', attendance: 89, label: 'November' },
    { month: 'Dec', attendance: 84, label: 'Desember' },
];

const chartConfig = {
    attendance: {
        label: 'Tingkat Kehadiran',
        color: '#3b82f6', // blue-500
    },
} satisfies ChartConfig;

export function AttendanceMonthlyChart() {
    // Hitung rata-rata kehadiran
    const averageAttendance = chartData.reduce((sum, item) => sum + item.attendance, 0) / chartData.length;

    // Bulan terakhir vs bulan sebelumnya
    const lastMonth = chartData[chartData.length - 1];
    const previousMonth = chartData[chartData.length - 2];
    const monthlyChange = lastMonth.attendance - previousMonth.attendance;

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Tingkat Kehadiran Bulanan</CardTitle>
                <CardDescription className="text-xs">Persentase kehadiran mahasiswa per bulan</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis dataKey="month" tickLine={false} axisLine={false} padding={{ left: 10, right: 10 }} />
                            <YAxis domain={[75, 100]} tickCount={6} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                            <Tooltip
                                content={(props) => {
                                    if (props?.payload && props.payload.length > 0) {
                                        const data = props.payload[0].payload;
                                        return (
                                            <div className="border-border bg-background rounded-lg border p-2 shadow-md">
                                                <div className="font-medium">{data.label}</div>
                                                <div className="text-sm">
                                                    Kehadiran: <span className="font-medium">{data.attendance}%</span>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="attendance"
                                stroke="#3b82f6"
                                strokeWidth={2.5}
                                dot={{ r: 3, strokeWidth: 0, fill: '#3b82f6' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 pt-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    {monthlyChange > 0 ? (
                        <>
                            Meningkat {monthlyChange}% dari bulan lalu <TrendingUp className="h-4 w-4" />
                        </>
                    ) : (
                        <>
                            Menurun {Math.abs(monthlyChange)}% dari bulan lalu <TrendingUp className="h-4 w-4 rotate-180" />
                        </>
                    )}
                </div>
                <div className="text-muted-foreground leading-none">Rata-rata kehadiran: {averageAttendance.toFixed(1)}%</div>
            </CardFooter>
        </Card>
    );
}
