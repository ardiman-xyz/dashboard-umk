import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';

interface GradeData {
    grade: string;
    count: number;
    percentage: number;
    color: string;
}

const detailGradeData: GradeData[] = [
    { grade: '3.75-4.00', count: 1245, percentage: 10, color: '#16a34a' }, // green-600
    { grade: '3.50-3.74', count: 2000, percentage: 16, color: '#22c55e' }, // green-500
    { grade: '3.25-3.49', count: 2420, percentage: 19, color: '#3b82f6' }, // blue-500
    { grade: '3.00-3.24', count: 2947, percentage: 24, color: '#60a5fa' }, // blue-400
    { grade: '2.50-2.99', count: 1856, percentage: 15, color: '#eab308' }, // yellow-500
    { grade: '2.00-2.49', count: 1245, percentage: 10, color: '#f97316' }, // orange-500
    { grade: '1.00-1.99', count: 620, percentage: 5, color: '#ef4444' }, // red-500
    { grade: '0.00-0.99', count: 125, percentage: 1, color: '#b91c1c' }, // red-700
];

const letterGradeData: GradeData[] = [
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
    const [displayMode, setDisplayMode] = useState<'letter' | 'detail'>('letter');

    // Pilih data berdasarkan mode tampilan
    const chartData = displayMode === 'letter' ? letterGradeData : detailGradeData;

    // Hitung total nilai bagus (A&B atau >=3.00)
    const goodGradePercentage =
        displayMode === 'letter'
            ? letterGradeData.filter((item) => ['A', 'B'].includes(item.grade)).reduce((sum, item) => sum + item.percentage, 0)
            : detailGradeData.filter((item) => item.grade >= '3.00-3.24').reduce((sum, item) => sum + item.percentage, 0);

    // Total nilai
    const totalGrades = chartData.reduce((sum, item) => sum + item.count, 0);

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base">Distribusi Nilai</CardTitle>
                        <CardDescription className="text-xs">Persentase nilai semester ini</CardDescription>
                    </div>
                    <Select defaultValue="letter" onValueChange={(value) => setDisplayMode(value as 'letter' | 'detail')}>
                        <SelectTrigger className="h-8 w-[160px] text-xs">
                            <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="letter">Nilai Huruf (A-E)</SelectItem>
                            <SelectItem value="detail">Range IPK Detail</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 10 }} barGap={4}>
                        <CartesianGrid horizontal strokeDasharray="3 3" />
                        <YAxis dataKey="grade" type="category" tickLine={false} axisLine={false} width={55} fontSize={12} />
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
                    {displayMode === 'letter'
                        ? `${goodGradePercentage}% mahasiswa mendapat nilai A atau B`
                        : `${goodGradePercentage}% mahasiswa memiliki IPK ≥ 3.00`}
                    <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">Total {totalGrades.toLocaleString()} nilai yang diberikan</div>
            </CardFooter>
        </Card>
    );
}
