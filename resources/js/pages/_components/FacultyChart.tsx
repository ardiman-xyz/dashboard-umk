import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface FacultyChartProps {
    data: Array<{ name: string; count: number }>;
}

export const FacultyChart: React.FC<FacultyChartProps> = ({ data }) => {
    // Transform data untuk tampilan chart
    const chartData = data.map((item) => ({
        faculty: item.name,
        current: item.count,
        previous: Math.round(item.count * (0.9 + Math.random() * 0.2)), // Dummy data tahun sebelumnya (90-110% dari current)
    }));

    const chartConfig = {
        current: {
            label: 'Semester Ini',
            color: '#2563eb',
        },
        previous: {
            label: 'Semester Lalu',
            color: '#93c5fd',
        },
    } satisfies ChartConfig;

    // Menghitung total mahasiswa
    const totalCurrent = data.reduce((sum, item) => sum + item.count, 0);
    const totalPrevious = chartData.reduce((sum, item) => sum + item.previous, 0);
    const percentageChange = (((totalCurrent - totalPrevious) / totalPrevious) * 100).toFixed(1);
    const isIncreasing = totalCurrent > totalPrevious;

    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Distribusi Mahasiswa per Fakultas</CardTitle>
                <CardDescription>Total mahasiswa berdasarkan fakultas pada semester berjalan</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis dataKey="faculty" tickLine={false} tickMargin={10} axisLine={false} />
                            <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <ChartTooltip
                                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                                content={(props) => {
                                    if (props?.payload && props.payload.length > 0) {
                                        return (
                                            <div className="border-border bg-background rounded-lg border p-2 shadow-md">
                                                <p className="text-sm font-medium">{props.label}</p>
                                                {props.payload.map((entry, index) => (
                                                    <div key={index} className="flex items-center gap-2 text-sm">
                                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                                        <span>{entry.name}: </span>
                                                        <span className="font-medium">{entry.value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Bar dataKey="current" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={35} stroke="#000" />
                            <Bar dataKey="previous" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={35} stroke="#000" />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    {isIncreasing ? 'Meningkat' : 'Menurun'} {Math.abs(Number(percentageChange))}% dari semester lalu
                    <TrendingUp className={`h-4 w-4 ${isIncreasing ? '' : 'rotate-180'}`} />
                </div>
                <div className="text-muted-foreground leading-none">
                    Membandingkan total {totalCurrent.toLocaleString()} mahasiswa dengan {totalPrevious.toLocaleString()} semester lalu
                </div>
            </CardFooter>
        </Card>
    );
};
