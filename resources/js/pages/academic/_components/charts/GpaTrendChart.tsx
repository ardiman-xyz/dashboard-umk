import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { type AcademicStats } from '@/types/academic';
import { PageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';

interface PagePropsWithStats extends PageProps {
    stats: AcademicStats;
}

const chartConfig = {
    ipk: {
        label: 'Rata-rata IPK',
        color: '#f97316', // orange-500
    },
} satisfies ChartConfig;

export function GpaTrendChart() {
    const { stats } = usePage<PagePropsWithStats>().props;

    // Pastikan stats.gpaTrend.trend_data tersedia, jika tidak gunakan data dummy
    const gpaTrendData = stats?.gpaTrend?.trend_data || [
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

    // Gunakan nilai dari API jika tersedia
    const firstIPK = stats?.gpaTrend?.first_ipk || gpaTrendData[0].ipk;
    const lastIPK = stats?.gpaTrend?.last_ipk || gpaTrendData[gpaTrendData.length - 1].ipk;
    const percentChange =
        stats?.gpaTrend?.percent_change !== undefined
            ? stats.gpaTrend.percent_change
            : parseFloat((((lastIPK - firstIPK) / firstIPK) * 100).toFixed(1));

    const yearsCount = stats?.gpaTrend?.years_count || 5;

    // Hitung domain untuk Y-axis (min dan max IPK +/- margin)
    const minIpk = Math.max(2.0, Math.min(...gpaTrendData.map((d) => d.ipk)) - 0.1);
    const maxIpk = Math.min(4.0, Math.max(...gpaTrendData.map((d) => d.ipk)) + 0.1);

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Tren IPK {yearsCount} Tahun Terakhir</CardTitle>
                <CardDescription className="text-xs">Rata-rata IPK per semester</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        data={gpaTrendData}
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
                        <YAxis
                            domain={[minIpk, maxIpk]}
                            tickCount={6}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => value.toFixed(1)}
                        />
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
                    {percentChange >= 0 ? (
                        <>
                            Meningkat {percentChange}% dalam {yearsCount} tahun terakhir <TrendingUp className="h-4 w-4 text-green-500" />
                        </>
                    ) : (
                        <>
                            Menurun {Math.abs(percentChange)}% dalam {yearsCount} tahun terakhir <TrendingDown className="h-4 w-4 text-red-500" />
                        </>
                    )}
                </div>
                <div className="text-muted-foreground leading-none">IPK semester terakhir: {lastIPK.toFixed(2)}</div>
            </CardFooter>
        </Card>
    );
}
