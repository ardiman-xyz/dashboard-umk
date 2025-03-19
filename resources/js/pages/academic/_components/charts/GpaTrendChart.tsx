'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

// Data IPK per semester selama 5 tahun terakhir (10 semester)
const chartData = [
    { semester: '2020-1', ipk: 3.21, label: 'Ganjil 2020' },
    { semester: '2020-2', ipk: 3.25, label: 'Genap 2020' },
    { semester: '2021-1', ipk: 3.28, label: 'Ganjil 2021' },
    { semester: '2021-2', ipk: 3.3, label: 'Genap 2021' },
    { semester: '2022-1', ipk: 3.34, label: 'Ganjil 2022' },
    { semester: '2022-2', ipk: 3.37, label: 'Genap 2022' },
    { semester: '2023-1', ipk: 3.35, label: 'Ganjil 2023' },
    { semester: '2023-2', ipk: 3.38, label: 'Genap 2023' },
    { semester: '2024-1', ipk: 3.41, label: 'Ganjil 2024' },
    { semester: '2024-2', ipk: 3.42, label: 'Genap 2024' },
];

const chartConfig = {
    ipk: {
        label: 'Rata-rata IPK',
        color: '#f97316', // orange-500
    },
} satisfies ChartConfig;

export function GpaTrendChart() {
    // Hitung perubahan persentase dari semester pertama hingga terakhir
    const firstIPK = chartData[0].ipk;
    const lastIPK = chartData[chartData.length - 1].ipk;
    const percentChange = (((lastIPK - firstIPK) / firstIPK) * 100).toFixed(1);

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Tren IPK 5 Tahun Terakhir</CardTitle>
                <CardDescription className="text-xs">Rata-rata IPK per semester</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        data={chartData}
                        margin={{
                            top: 10,
                            right: 10,
                            left: 10,
                            bottom: 10,
                        }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="semester"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.split('-')[0].slice(2) + (value.endsWith('1') ? '.1' : '.2')}
                        />
                        <YAxis domain={[3.0, 3.5]} tickCount={6} tickLine={false} axisLine={false} tickFormatter={(value) => value.toFixed(1)} />
                        <ChartTooltip
                            cursor={{ strokeDasharray: '3 3' }}
                            content={(props) => {
                                if (props?.payload && props.payload.length > 0) {
                                    const data = props.payload[0].payload;
                                    return (
                                        <div className="border-border bg-background rounded-lg border p-2 shadow-md">
                                            <div className="font-medium">{data.label}</div>
                                            <div className="text-sm">
                                                IPK: <span className="font-medium">{data.ipk.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Line type="monotone" dataKey="ipk" stroke="#f97316" strokeWidth={2.5} activeDot={{ r: 6, strokeWidth: 0 }} dot={{ r: 0 }} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 pt-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Meningkat {percentChange}% dalam 5 tahun terakhir <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">IPK semester terakhir: {lastIPK.toFixed(2)}</div>
            </CardFooter>
        </Card>
    );
}
