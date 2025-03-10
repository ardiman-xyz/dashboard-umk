import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface FacultyChartProps {
    data: Array<{ name: string; count: number }>;
}

export const FacultyChart: React.FC<FacultyChartProps> = ({ data }) => {
    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>Distribusi Mahasiswa per Fakultas</CardTitle>
                <CardDescription>Total mahasiswa berdasarkan fakultas pada semester berjalan</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" name="Jumlah Mahasiswa" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
};
