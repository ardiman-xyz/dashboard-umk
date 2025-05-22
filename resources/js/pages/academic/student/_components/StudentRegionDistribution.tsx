import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';

interface RegionData {
    name: string;
    value: number;
    color?: string;
}

interface TooltipProps {
    active?: boolean;
    payload?: Array<{
        payload: RegionData;
    }>;
}

const StudentRegionDistribution: React.FC<{
    regionDistribution?: RegionData[];
    studentStatus?: string;
    isAllFilter?: boolean;
}> = ({ regionDistribution, studentStatus = 'all', isAllFilter = false }) => {
    // Predefined colors untuk regions
    const regionColors: { [key: string]: string } = {
        'Sulawesi Tenggara': '#22c55e', // green
        'Sulawesi Selatan': '#3b82f6', // blue
        'Sulawesi Tengah': '#6366f1', // indigo
        'Sulawesi Barat': '#f59e0b', // amber
        'Sulawesi Utara': '#ef4444', // red
        Gorontalo: '#8b5cf6', // violet
        Papua: '#ec4899', // pink
        Maluku: '#f97316', // orange
        'Daerah Lainnya': '#6b7280', // gray
        'Tidak Diketahui': '#9ca3af', // gray-400
    };

    // Function untuk assign warna berdasarkan nama region
    const getColorByRegion = (regionName: string): string => {
        return regionColors[regionName] || '#6b7280'; // default gray
    };

    // Data fallback jika props tidak tersedia
    const fallbackData: RegionData[] = [
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

    // Gunakan data real jika ada, fallback ke dummy
    const regionData: RegionData[] =
        regionDistribution && regionDistribution.length > 0
            ? regionDistribution.map((item) => ({
                  name: item.name,
                  value: item.value,
                  color: item.color || getColorByRegion(item.name),
              }))
            : fallbackData;

    // Dynamic title dan description berdasarkan filter
    const getChartTitle = () => {
        if (studentStatus === 'active') {
            return 'Distribusi Asal Daerah Mahasiswa Aktif';
        }
        return 'Distribusi Asal Daerah';
    };

    const getChartDescription = () => {
        if (studentStatus === 'active') {
            if (isAllFilter) {
                return 'Asal daerah mahasiswa aktif semester saat ini';
            }
            return 'Asal daerah mahasiswa aktif berdasarkan semester';
        }

        if (isAllFilter) {
            return 'Mahasiswa berdasarkan provinsi asal (semua data)';
        }
        return 'Mahasiswa berdasarkan provinsi asal';
    };

    // Hitung total dan statistik
    const totalStudents: number = regionData.reduce((sum, item) => sum + item.value, 0);

    // Cari provinsi dengan mahasiswa terbanyak
    const largestRegion = totalStudents > 0 ? [...regionData].sort((a, b) => b.value - a.value)[0] : { name: 'N/A', value: 0 };

    const largestRegionPercentage = totalStudents > 0 ? ((largestRegion.value / totalStudents) * 100).toFixed(1) : '0';

    // Hitung persentase mahasiswa asal Sulawesi
    const sulawesiProvinces = ['Sulawesi Tenggara', 'Sulawesi Selatan', 'Sulawesi Tengah', 'Sulawesi Barat', 'Sulawesi Utara', 'Gorontalo'];

    const sulawesiStudents = regionData.filter((region) => sulawesiProvinces.includes(region.name)).reduce((sum, item) => sum + item.value, 0);

    const sulawesiPercentage = totalStudents > 0 ? ((sulawesiStudents / totalStudents) * 100).toFixed(1) : '0';

    // Format jumlah dengan tanda ribuan
    const formatNumber = (num: number): string => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    // Konfigurasi chart
    const chartConfig = {
        value: {
            label: studentStatus === 'active' ? 'Mahasiswa Aktif' : 'Jumlah Mahasiswa',
            color: 'hsl(var(--chart-1))',
        },
    } satisfies ChartConfig;

    // Custom tooltip untuk menampilkan informasi saat hover
    const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length > 0) {
            const data = payload[0].payload;
            const percentage = totalStudents > 0 ? ((data.value / totalStudents) * 100).toFixed(1) : '0';

            return (
                <div className="bg-background border-border rounded-lg border p-2 shadow-md">
                    <p className="font-medium">{data.name}</p>
                    <p className="text-sm">
                        {formatNumber(data.value)} mahasiswa {studentStatus === 'active' ? 'aktif' : ''}
                    </p>
                    <p className="text-muted-foreground text-sm">{percentage}% dari total</p>
                </div>
            );
        }
        return null;
    };

    // Dynamic footer text
    const getFooterText = () => {
        if (totalStudents === 0) return 'Data tidak tersedia';

        if (studentStatus === 'active') {
            return `Mayoritas mahasiswa aktif dari ${largestRegion.name} (${largestRegionPercentage}%)`;
        }
        return `Mayoritas dari ${largestRegion.name} (${largestRegionPercentage}%)`;
    };

    const getFooterDescription = () => {
        if (totalStudents === 0) return 'Tidak ada data mahasiswa';

        if (studentStatus === 'active') {
            return `${sulawesiPercentage}% mahasiswa aktif berasal dari Pulau Sulawesi`;
        }
        return `${sulawesiPercentage}% mahasiswa berasal dari Pulau Sulawesi`;
    };

    return (
        <Card className="">
            <CardHeader>
                <CardTitle>{getChartTitle()}</CardTitle>
                <CardDescription>{getChartDescription()}</CardDescription>
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
                <div className="flex gap-2 leading-none font-medium">{getFooterText()}</div>
                <div className="text-muted-foreground leading-none">{getFooterDescription()}</div>
            </CardFooter>
        </Card>
    );
};

export default StudentRegionDistribution;
