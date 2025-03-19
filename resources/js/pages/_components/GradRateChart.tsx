import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import React from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface GradRateChartProps {
    data: Array<{
        year: string;
        onTime: number;
        delayed: number;
    }>;
}

export const GradRateChart: React.FC<GradRateChartProps> = ({ data }) => {
    // Konfigurasi chart untuk Shadcn UI
    const chartConfig = {
        onTime: {
            label: 'Tepat Waktu',
            color: '#22c55e',
        },
        delayed: {
            label: 'Terlambat',
            color: '#ef4444',
        },
    } satisfies ChartConfig;

    // Menghitung perubahan persentase untuk kelulusan tepat waktu
    const firstYearRate = data[0].onTime;
    const lastYearRate = data[data.length - 1].onTime;
    const percentageChange = (((lastYearRate - firstYearRate) / firstYearRate) * 100).toFixed(1);
    const isIncreasing = lastYearRate > firstYearRate;

    const currentYear = new Date().getFullYear();

    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Tren Tingkat Kelulusan</CardTitle>
                <CardDescription>Persentase kelulusan tepat waktu vs terlambat (5 tahun terakhir)</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                            <defs>
                                <linearGradient id="gradientOnTime" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                                    <stop offset="75%" stopColor="#22c55e" stopOpacity={0.05} />
                                </linearGradient>
                                <linearGradient id="gradientDelayed" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                                    <stop offset="75%" stopColor="#ef4444" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                            <XAxis dataKey="year" axisLine={false} tickLine={false} tickMargin={10} stroke="var(--muted-foreground)" fontSize={12} />
                            <YAxis
                                tickCount={5}
                                tickFormatter={(value) => `${value}%`}
                                axisLine={false}
                                tickLine={false}
                                stroke="var(--muted-foreground)"
                                fontSize={12}
                                domain={[0, 100]}
                            />
                            <ChartTooltip
                                content={(props) => {
                                    if (props?.payload && props.payload.length > 0) {
                                        return (
                                            <div className="border-border bg-background rounded-lg border p-2 shadow-md">
                                                <p className="text-sm font-medium">Tahun {props.label}</p>
                                                {props.payload.map((entry, index) => (
                                                    <div key={index} className="flex items-center gap-2 text-sm">
                                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                                        <span>{entry.name}: </span>
                                                        <span className="font-medium">{entry.value}%</span>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey="onTime"
                                name="Tepat Waktu"
                                stroke="#22c55e"
                                strokeWidth={2.5}
                                dot={{ r: 0 }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                                isAnimationActive={true}
                                animationDuration={1500}
                            />
                            <Line
                                type="monotone"
                                dataKey="delayed"
                                name="Terlambat"
                                stroke="#ef4444"
                                strokeWidth={2.5}
                                dot={{ r: 0 }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                                isAnimationActive={true}
                                animationDuration={1500}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </ChartContainer>

                {/* Legend custom yang lebih menarik */}
                <div className="mt-2 flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                        <span className="text-muted-foreground text-sm">Tepat Waktu</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <span className="text-muted-foreground text-sm">Terlambat</span>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    {isIncreasing ? 'Meningkat' : 'Menurun'} {Math.abs(Number(percentageChange))}% dalam 5 tahun terakhir
                    <TrendingUp className={`h-4 w-4 ${isIncreasing ? '' : 'rotate-180'}`} />
                </div>
                <div className="text-muted-foreground leading-none">
                    Persentase kelulusan tepat waktu {currentYear}: {lastYearRate}%
                </div>
            </CardFooter>
        </Card>
    );
};
