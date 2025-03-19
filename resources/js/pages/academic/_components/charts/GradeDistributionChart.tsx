'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';

// Data distribusi nilai semester ini
const chartData = [
    { grade: 'A', count: 3245, percentage: 26, color: '#22c55e' }, // green
    { grade: 'B', count: 5367, percentage: 43, color: '#3b82f6' }, // blue
    { grade: 'C', count: 2856, percentage: 23, color: '#eab308' }, // yellow
    { grade: 'D', count: 745, percentage: 6, color: '#f97316' }, // orange
    { grade: 'E', count: 245, percentage: 2, color: '#ef4444' }, // red
];

const chartConfig = {
    count: {
        label: 'Jumlah Mahasiswa',
        color: '#3b82f6',
    },
} satisfies ChartConfig;

export function GradeDistributionChart() {
    // Total nilai
    const totalGrades = chartData.reduce((sum, item) => sum + item.count, 0);

    // A dan B dianggap baik
    const goodGradePercentage = chartData.filter((item) => ['A', 'B'].includes(item.grade)).reduce((sum, item) => sum + item.percentage, 0);

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Distribusi Nilai</CardTitle>
                <CardDescription className="text-xs">Persentase nilai semester ini</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 10 }} barGap={4}>
                        <CartesianGrid horizontal strokeDasharray="3 3" />
                        <YAxis dataKey="grade" type="category" tickLine={false} axisLine={false} width={30} />
                        <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                        <ChartTooltip
                            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                            content={(props) => {
                                if (props?.payload && props.payload.length > 0) {
                                    const data = props.payload[0].payload;
                                    return (
                                        <div className="border-border bg-background rounded-lg border p-2 shadow-md">
                                            <div className="font-medium">Nilai {data.grade}</div>
                                            <div className="text-sm">
                                                {data.count.toLocaleString()} mahasiswa ({data.percentage}%)
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="percentage" radius={[0, 4, 4, 0]} maxBarSize={30}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 pt-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    {goodGradePercentage}% mahasiswa mendapat nilai A atau B <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">Total {totalGrades.toLocaleString()} nilai yang diberikan</div>
            </CardFooter>
        </Card>
    );
}
