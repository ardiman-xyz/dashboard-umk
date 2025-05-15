import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';

interface RegionData {
    name: string;
    value: number;
    color: string;
}

interface TooltipProps {
    active?: boolean;
    payload?: Array<{
        payload: RegionData;
    }>;
}

const StudentRegionDistribution: React.FC = () => {
    // Data distribusi daerah asal
    const regionData: RegionData[] = [
        { name: 'Sulawesi Tenggara', value: 15670, color: '#22c55e' },
        { name: 'Sulawesi Selatan', value: 3245, color: '#3b82f6' },
        { name: 'Sulawesi Tengah', value: 1458, color: '#6366f1' },
        { name: 'Sulawesi Barat', value: 765, color: '#f59e0b' },
        { name: 'Sulawesi Utara', value: 512, color: '#ef4444' },
        { name: 'Gorontalo', value: 328, color: '#8b5cf6' },
        { name: 'Papua', value: 156, color: '#ec4899' },
        { name: 'Maluku', value: 245, color: '#f97316' },
        { name: 'Daerah Lainnya', value: 1888, color: '#6b7280' },
    ];

    // Hitung total dan statistik
    const totalStudents: number = regionData.reduce((sum, item) => sum + item.value, 0);

    // Cari provinsi dengan mahasiswa terbanyak
    const largestRegion = [...regionData].sort((a, b) => b.value - a.value)[0];
    const largestRegionPercentage = ((largestRegion.value / totalStudents) * 100).toFixed(1);

    // Hitung persentase mahasiswa asal Sulawesi
    const sulawesiProvinces = ['Sulawesi Tenggara', 'Sulawesi Selatan', 'Sulawesi Tengah', 'Sulawesi Barat', 'Sulawesi Utara', 'Gorontalo'];
    const sulawesiStudents = regionData.filter((region) => sulawesiProvinces.includes(region.name)).reduce((sum, item) => sum + item.value, 0);
    const sulawesiPercentage = ((sulawesiStudents / totalStudents) * 100).toFixed(1);

    // Format jumlah dengan tanda ribuan
    const formatNumber = (num: number): string => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    // Konfigurasi chart
    const chartConfig = {
        value: {
            label: 'Jumlah Mahasiswa',
            color: 'hsl(var(--chart-1))',
        },
    } satisfies ChartConfig;

    // Custom tooltip untuk menampilkan informasi saat hover
    const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length > 0) {
            const data = payload[0].payload;
            const percentage = ((data.value / totalStudents) * 100).toFixed(1);

            return (
                <div className="bg-background border-border rounded-lg border p-2 shadow-md">
                    <p className="font-medium">{data.name}</p>
                    <p className="text-sm">{formatNumber(data.value)} mahasiswa</p>
                    <p className="text-muted-foreground text-sm">{percentage}% dari total</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card className="">
            <CardHeader>
                <CardTitle>Distribusi Asal Daerah</CardTitle>
                <CardDescription>Mahasiswa berdasarkan provinsi asal</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        data={regionData}
                        layout="vertical"
                        margin={{ top: 5, right: 5, left: 50, bottom: 5 }}
                        barSize={15} // Mengurangi ukuran bar
                    >
                        <CartesianGrid horizontal strokeDasharray="3 3" stroke="#eee" />
                        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} fontSize={12} tick={{ fill: '#666' }} />
                        <XAxis type="number" hide={true} />
                        <ChartTooltip cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }} content={<CustomTooltip />} />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {regionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Mayoritas dari {largestRegion.name} ({largestRegionPercentage}%)
                </div>
                <div className="text-muted-foreground leading-none">{sulawesiPercentage}% mahasiswa berasal dari Pulau Sulawesi</div>
            </CardFooter>
        </Card>
    );
};

export default StudentRegionDistribution;
