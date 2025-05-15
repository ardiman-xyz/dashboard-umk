import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';

interface AgeData {
    age: string;
    value: number;
    color: string;
}

interface TooltipProps {
    active?: boolean;
    payload?: Array<{
        payload: AgeData;
    }>;
}

const StudentAgeDistribution: React.FC = () => {
    // Data distribusi umur
    const ageData: AgeData[] = [
        { age: '17-19', value: 6243, color: '#a1cca5' },
        { age: '20-22', value: 10785, color: '#8fb996' },
        { age: '23-25', value: 5421, color: '#709775' },
        { age: '26-30', value: 1438, color: '#415d43' },
        { age: '> 30', value: 380, color: '#111d13' },
    ];

    // Hitung total dan statistik
    const totalStudents: number = ageData.reduce((sum, item) => sum + item.value, 0);

    // Cari kelompok umur terbanyak
    const largestAgeGroup = [...ageData].sort((a, b) => b.value - a.value)[0];
    const largestAgeGroupPercentage = ((largestAgeGroup.value / totalStudents) * 100).toFixed(1);

    // Hitung rata-rata umur (perkiraan sederhana)
    // Menggunakan nilai tengah untuk setiap kelompok umur
    const averageAge = ((6243 * 18 + 10785 * 21 + 5421 * 24 + 1438 * 28 + 380 * 35) / totalStudents).toFixed(1);

    // Konfigurasi chart
    const chartConfig = {
        value: {
            label: 'Jumlah Mahasiswa',
            color: 'hsl(var(--chart-3))',
        },
    } satisfies ChartConfig;

    // Format jumlah dengan tanda ribuan
    const formatNumber = (num: number): string => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    // Custom tooltip untuk menampilkan informasi saat hover
    const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length > 0) {
            const data = payload[0].payload;
            const percentage = ((data.value / totalStudents) * 100).toFixed(1);

            return (
                <div className="bg-background border-border rounded-lg border p-2 shadow-md">
                    <p className="font-medium">Umur {data.age} tahun</p>
                    <p className="text-sm">{formatNumber(data.value)} mahasiswa</p>
                    <p className="text-muted-foreground text-sm">{percentage}% dari total</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="h-[600px]">
            <CardHeader>
                <CardTitle>Distribusi Umur Mahasiswa</CardTitle>
                <CardDescription>Jumlah mahasiswa berdasarkan kelompok umur</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        data={ageData}
                        margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                        barSize={40} // Ukuran bar yang lebih besar
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="age" tickLine={false} axisLine={false} tick={{ fill: '#666' }} />
                        <YAxis hide />
                        <ChartTooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} content={<CustomTooltip />} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {ageData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Mayoritas umur {largestAgeGroup.age} tahun ({largestAgeGroupPercentage}%)
                </div>
                <div className="text-muted-foreground leading-none">Rata-rata umur mahasiswa: {averageAge} tahun</div>
            </CardFooter>
        </Card>
    );
};

export default StudentAgeDistribution;
