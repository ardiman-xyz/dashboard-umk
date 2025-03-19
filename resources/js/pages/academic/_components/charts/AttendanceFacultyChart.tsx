'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

// Data tingkat kehadiran per fakultas
const chartData = [
    { faculty: 'Teknik', attendance: 89, target: 85 },
    { faculty: 'Pertanian', attendance: 86, target: 85 },
    { faculty: 'Perikanan', attendance: 84, target: 85 },
    { faculty: 'Ilmu Sosial', attendance: 91, target: 85 },
    { faculty: 'Hukum', attendance: 88, target: 85 },
    { faculty: 'Ekonomi', attendance: 85, target: 85 },
    { faculty: 'Keguruan', attendance: 93, target: 85 },
    { faculty: 'Agama Islam', attendance: 90, target: 85 },
];

const chartConfig = {
    attendance: {
        label: 'Tingkat Kehadiran',
        color: '#3b82f6', // blue-500
    },
} satisfies ChartConfig;

export function AttendanceFacultyChart() {
    // Hitung rata-rata kehadiran semua fakultas
    const overallAverage = chartData.reduce((sum, item) => sum + item.attendance, 0) / chartData.length;

    // Fakultas dengan kehadiran tertinggi
    const highestFaculty = [...chartData].sort((a, b) => b.attendance - a.attendance)[0];

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Kehadiran per Fakultas</CardTitle>
                <CardDescription className="text-xs">Perbandingan tingkat kehadiran antar fakultas</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 10 }} layout="vertical">
                            <CartesianGrid horizontal strokeDasharray="3 3" />
                            <YAxis dataKey="faculty" type="category" width={100} tickLine={false} axisLine={false} fontSize={12} />
                            <XAxis type="number" domain={[75, 100]} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                            <Tooltip
                                content={(props) => {
                                    if (props?.payload && props.payload.length > 0) {
                                        const data = props.payload[0].payload;
                                        const vs = data.attendance - data.target;

                                        return (
                                            <div className="border-border bg-background rounded-lg border p-2 shadow-md">
                                                <div className="font-medium">{data.faculty}</div>
                                                <div className="text-sm">
                                                    Kehadiran: <span className="font-medium">{data.attendance}%</span>
                                                </div>
                                                <div className="text-muted-foreground text-xs">
                                                    {vs >= 0 ? `${vs}% di atas target` : `${Math.abs(vs)}% di bawah target`}
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="attendance" radius={[0, 4, 4, 0]} maxBarSize={20}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.attendance >= entry.target ? '#22c55e' : '#f97316'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 pt-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Fakultas {highestFaculty.faculty} memiliki kehadiran tertinggi ({highestFaculty.attendance}%)
                </div>
                <div className="text-muted-foreground leading-none">Rata-rata kehadiran seluruh fakultas: {overallAverage.toFixed(1)}%</div>
            </CardFooter>
        </Card>
    );
}
