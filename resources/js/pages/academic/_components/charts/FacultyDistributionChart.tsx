import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartData = [
    { faculty: 'Teknik', current: 1845, previous: 1720 },
    { faculty: 'Pertanian', current: 1576, previous: 1450 },
    { faculty: 'Perikanan', current: 1234, previous: 1150 },
    { faculty: 'Ilmu Sosial', current: 1368, previous: 1300 },
    { faculty: 'Hukum', current: 993, previous: 940 },
    { faculty: 'Ekonomi', current: 1742, previous: 1650 },
    { faculty: 'Keguruan', current: 2140, previous: 2050 },
    { faculty: 'Agama Islam', current: 1560, previous: 1480 },
];

const chartConfig = {
    current: {
        label: 'Semester Ini',
        color: '#2A9D90', // Warna teal eksplisit
    },
    previous: {
        label: 'Semester Lalu',
        color: '#E76E50', // Warna oranye eksplisit
    },
} satisfies ChartConfig;

export function FacultyDistributionChart() {
    const totalCurrent = chartData.reduce((sum, item) => sum + item.current, 0);
    const totalPrevious = chartData.reduce((sum, item) => sum + item.previous, 0);
    const percentChange = (((totalCurrent - totalPrevious) / totalPrevious) * 100).toFixed(1);

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Distribusi Mahasiswa per Fakultas</CardTitle>
                <CardDescription className="text-xs">Total mahasiswa berdasarkan fakultas UMKendari</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        margin={{ left: 0, right: 0, top: 10, bottom: 10 }}
                        barGap={4}
                        layout="vertical"
                        height={300}
                    >
                        <CartesianGrid horizontal={true} vertical={false} strokeDasharray="3 3" />
                        <YAxis dataKey="faculty" type="category" tickLine={false} axisLine={false} width={100} fontSize={12} />
                        <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                        <Bar dataKey="current" fill="var(--color-current)" radius={[0, 4, 4, 0]} maxBarSize={30} />
                        <Bar dataKey="previous" fill="var(--color-previous)" radius={[0, 4, 4, 0]} maxBarSize={30} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Meningkat {percentChange}% dari semester lalu <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">Total {totalCurrent.toLocaleString()} mahasiswa semester ini</div>
            </CardFooter>
        </Card>
    );
}
