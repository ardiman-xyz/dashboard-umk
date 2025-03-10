import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface StatusData {
    status: string;
    count: number;
    color: string;
}

interface StatusPieChartProps {
    data: StatusData[];
    totalStudents: number;
}

export const StatusPieChart: React.FC<StatusPieChartProps> = ({ data, totalStudents }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Status Akademik Mahasiswa</CardTitle>
                <CardDescription>Persentase mahasiswa berdasarkan status akademik</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex h-60 items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                                nameKey="status"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Legend />
                            <Tooltip formatter={(value: any) => [`${value} (${((Number(value) / totalStudents) * 100).toFixed(1)}%)`, 'Jumlah']} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
