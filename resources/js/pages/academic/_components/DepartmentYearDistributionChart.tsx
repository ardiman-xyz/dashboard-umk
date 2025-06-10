import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface YearData {
    year: string;
    student_count: number;
}

interface DepartmentYearDistributionChartProps {
    yearDistribution: YearData[];
    departmentName: string;
}

const chartConfig = {
    student_count: {
        label: 'Jumlah Mahasiswa',
        color: '#2563eb',
    },
} satisfies ChartConfig;

export default function DepartmentYearDistributionChart({ yearDistribution, departmentName }: DepartmentYearDistributionChartProps) {
    const totalStudents = yearDistribution.reduce((sum, item) => sum + item.student_count, 0);
    const latestYear = yearDistribution.length > 0 ? yearDistribution[0] : null;
    const latestYearPercentage = latestYear && totalStudents > 0 ? ((latestYear.student_count / totalStudents) * 100).toFixed(1) : '0';

    const chartData = yearDistribution.map((item) => ({
        year: item.year,
        value: item.student_count,
        label: `Angkatan ${item.year}`,
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Distribusi per Angkatan</CardTitle>
                <CardDescription>Jumlah mahasiswa per tahun masuk di {departmentName}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="year"
                            tickLine={false}
                            axisLine={false}
                            tick={{ fill: '#666', fontSize: 12 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                        />
                        <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => value.toString()} fontSize={12} />
                        <ChartTooltip
                            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length > 0) {
                                    const data = payload[0].payload;
                                    const percentage = totalStudents > 0 ? ((data.value / totalStudents) * 100).toFixed(1) : '0';

                                    return (
                                        <div className="bg-background border-border rounded-lg border p-2 shadow-md">
                                            <p className="font-medium">{data.label}</p>
                                            <p className="text-sm">
                                                {data.value.toLocaleString()} mahasiswa ({percentage}%)
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="value" fill="var(--color-student_count)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="font-medium">
                    {latestYear ? `Angkatan ${latestYear.year}` : 'N/A'} memiliki mahasiswa terbanyak ({latestYearPercentage}%)
                </div>
                <div className="text-muted-foreground">
                    Total {totalStudents.toLocaleString()} mahasiswa dari {yearDistribution.length} angkatan
                </div>
            </CardFooter>
        </Card>
    );
}
