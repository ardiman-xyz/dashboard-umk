'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

// Tipe data untuk chart
interface FacultyData {
    name: string;
    value: number;
    color: string;
}

interface GenderByFacultyData {
    name: string;
    male: number;
    female: number;
}

const StudentDistribution: React.FC = () => {
    // Data fakultas
    const facultyData = [
        { name: 'FKIP', value: 4820 },
        { name: 'Teknik', value: 3740 },
        { name: 'Ekonomi', value: 3510 },
        { name: 'FISIP', value: 2980 },
        { name: 'Hukum', value: 2650 },
        { name: 'Pertanian', value: 2240 },
        { name: 'FAI', value: 2110 },
        { name: 'Kedokteran', value: 2217 },
    ];

    // Data gender
    const genderData = [
        { name: 'Laki-laki', value: 10540, color: 'hsl(var(--chart-1))' },
        { name: 'Perempuan', value: 13727, color: 'hsl(var(--chart-2))' },
    ];

    // Data gender per fakultas
    const genderByFacultyData = [
        { name: 'FKIP', laki: 1324, perempuan: 3496 },
        { name: 'Teknik', laki: 2850, perempuan: 890 },
        { name: 'Ekonomi', laki: 1556, perempuan: 1954 },
        { name: 'FISIP', laki: 1320, perempuan: 1660 },
        { name: 'Hukum', laki: 1243, perempuan: 1407 },
        { name: 'Pertanian', laki: 1120, perempuan: 1120 },
        { name: 'FAI', laki: 1180, perempuan: 930 },
        { name: 'Kedokteran', laki: 947, perempuan: 1270 },
    ];

    // Konfigurasi chart fakultas
    const facultyChartConfig = {
        value: {
            label: 'Jumlah Mahasiswa',
            color: 'hsl(var(--chart-1))',
        },
    } satisfies ChartConfig;

    // Konfigurasi chart gender
    const genderChartConfig = {
        laki: {
            label: 'Laki-laki',
            color: 'hsl(var(--chart-1))',
        },
        perempuan: {
            label: 'Perempuan',
            color: 'hsl(var(--chart-2))',
        },
    } satisfies ChartConfig;

    // Menghitung total dan persentase
    const totalGender = genderData.reduce((sum, item) => sum + item.value, 0);
    const malePercentage = ((genderData[0].value / totalGender) * 100).toFixed(1);

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Chart Distribusi Fakultas */}
            <Card>
                <CardHeader>
                    <CardTitle>Distribusi Mahasiswa per Fakultas</CardTitle>
                    <CardDescription>Total mahasiswa berdasarkan fakultas</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={facultyChartConfig}>
                        <BarChart data={facultyData} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                            <CartesianGrid horizontal strokeDasharray="3 3" />
                            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={80} fontSize={12} />
                            <XAxis type="number" hide />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="var(--color-value)" />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 leading-none font-medium">
                        Total 24.267 mahasiswa aktif <TrendingUp className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="text-muted-foreground leading-none">Fakultas FKIP memiliki jumlah mahasiswa terbanyak (19.9%)</div>
                </CardFooter>
            </Card>

            {/* Chart Distribusi Gender */}
            <Card>
                <CardHeader>
                    <CardTitle>Distribusi Gender per Fakultas</CardTitle>
                    <CardDescription>Perbandingan jenis kelamin per fakultas</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={genderChartConfig}>
                        <BarChart data={genderByFacultyData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }} layout="vertical">
                            <CartesianGrid horizontal strokeDasharray="3 3" />
                            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={80} fontSize={12} />
                            <XAxis type="number" hide />
                            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                            <Bar dataKey="laki" stackId="a" fill="var(--color-laki)" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="perempuan" stackId="a" fill="var(--color-perempuan)" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col items-start gap-2 text-sm">
                    <div className="flex gap-2 leading-none font-medium">Rasio P:L = 1.3:1 (56.6% perempuan)</div>
                    <div className="text-muted-foreground leading-none">Teknik adalah satu-satunya fakultas dengan dominasi laki-laki (76.2%)</div>
                </CardFooter>
            </Card>
        </div>
    );
};

export default StudentDistribution;
