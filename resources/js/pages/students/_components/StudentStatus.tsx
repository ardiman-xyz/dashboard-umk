import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';

const StudentStatus = () => {
    const chartData = [
        { name: 'Laki-laki', desktop: 186, mobile: 80 },
        { name: 'Perempuan', desktop: 305, mobile: 200 },
    ];
    const chartConfig = {
        desktop: {
            label: 'Desktop',
            color: '#2A9D90',
        },
        mobile: {
            label: 'Mobile',
            color: '#E76E50',
        },
        label: {
            color: 'hsl(var(--background))',
        },
    } satisfies ChartConfig;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Distribusi Gender</CardTitle>
                <CardDescription>Perbandingan jumlah mahasiswa berdasarkan jenis kelamin</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-40 w-full">
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            right: 16,
                        }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                            hide
                        />
                        <XAxis dataKey="desktop" type="number" hide />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                        <Bar dataKey="desktop" layout="vertical" fill="var(--color-desktop)" radius={4}>
                            <LabelList dataKey="name" position="insideLeft" offset={8} className="fill-white" fontSize={12} />
                            <LabelList dataKey="desktop" position="right" offset={8} className="fill-foreground" fontSize={12} />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">Showing total visitors for the last 6 months</div>
            </CardFooter>
        </Card>
    );
};

export default StudentStatus;
