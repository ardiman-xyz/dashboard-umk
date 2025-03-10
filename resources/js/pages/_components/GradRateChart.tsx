import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { CartesianGrid, Line, LineChart, Legend as RechartsLegend, Tooltip as RechartsTooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';

interface GradRateChartProps {
    data: Array<{
        year: string;
        onTime: number;
        delayed: number;
    }>;
}

export const GradRateChart: React.FC<GradRateChartProps> = ({ data }) => {
    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Tren Tingkat Kelulusan</CardTitle>
                <CardDescription>Persentase kelulusan tepat waktu vs terlambat (5 tahun terakhir)</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" />
                            <YAxis />
                            <RechartsTooltip formatter={(value) => [`${value}%`, '']} />
                            <RechartsLegend />
                            <Line
                                type="monotone"
                                dataKey="onTime"
                                name="Tepat Waktu"
                                stroke="#22c55e"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="delayed"
                                name="Terlambat"
                                stroke="#ef4444"
                                strokeWidth={2}
                                dot={{ r: 4 }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
