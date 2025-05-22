import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';

interface AgeData {
    age: string;
    value: number;
    color?: string;
}

interface TooltipProps {
    active?: boolean;
    payload?: Array<{
        payload: AgeData;
    }>;
}

const StudentAgeDistribution: React.FC<{
    ageDistribution?: AgeData[];
    studentStatus?: string;
    isAllFilter?: boolean;
}> = ({ ageDistribution, studentStatus = 'all', isAllFilter = false }) => {
    // Predefined colors untuk age groups
    const ageColors = [
        '#a1cca5', // light green untuk 17-19
        '#8fb996', // medium green untuk 20-22
        '#709775', // dark green untuk 23-25
        '#415d43', // darker green untuk 26-30
        '#111d13', // darkest green untuk > 30
    ];

    // Function untuk assign warna berdasarkan index
    const getColorByIndex = (index: number): string => {
        return ageColors[index] || ageColors[ageColors.length - 1];
    };

    // Data fallback jika props tidak tersedia
    const fallbackData: AgeData[] = [
        { age: '17-19', value: 6243, color: '#a1cca5' },
        { age: '20-22', value: 10785, color: '#8fb996' },
        { age: '23-25', value: 5421, color: '#709775' },
        { age: '26-30', value: 1438, color: '#415d43' },
        { age: '> 30', value: 380, color: '#111d13' },
    ];

    // Gunakan data real jika ada, fallback ke dummy
    const ageData: AgeData[] =
        ageDistribution && ageDistribution.length > 0
            ? ageDistribution.map((item, index) => ({
                  age: item.age,
                  value: item.value,
                  color: item.color || getColorByIndex(index),
              }))
            : fallbackData;

    // Dynamic title dan description berdasarkan filter
    const getChartTitle = () => {
        if (studentStatus === 'active') {
            return 'Distribusi Umur Mahasiswa Aktif';
        }
        return 'Distribusi Umur Mahasiswa';
    };

    const getChartDescription = () => {
        if (studentStatus === 'active') {
            if (isAllFilter) {
                return 'Kelompok umur mahasiswa aktif semester saat ini';
            }
            return 'Kelompok umur mahasiswa aktif berdasarkan semester';
        }

        if (isAllFilter) {
            return 'Jumlah seluruh mahasiswa berdasarkan kelompok umur';
        }
        return 'Jumlah mahasiswa berdasarkan kelompok umur';
    };

    // Hitung total dan statistik
    const totalStudents: number = ageData.reduce((sum, item) => sum + item.value, 0);

    // Cari kelompok umur terbanyak
    const largestAgeGroup = totalStudents > 0 ? [...ageData].sort((a, b) => b.value - a.value)[0] : { age: 'N/A', value: 0 };

    const largestAgeGroupPercentage = totalStudents > 0 ? ((largestAgeGroup.value / totalStudents) * 100).toFixed(1) : '0';

    // Hitung rata-rata umur berdasarkan data real
    const calculateAverageAge = () => {
        if (totalStudents === 0) return '0';

        let totalAge = 0;
        ageData.forEach((group) => {
            let midAge = 0;

            // Tentukan nilai tengah untuk setiap kelompok
            switch (group.age) {
                case '17-19':
                    midAge = 18;
                    break;
                case '20-22':
                    midAge = 21;
                    break;
                case '23-25':
                    midAge = 24;
                    break;
                case '26-30':
                    midAge = 28;
                    break;
                case '> 30':
                    midAge = 35; // Estimasi untuk > 30
                    break;
                default:
                    midAge = 22; // Default jika tidak dikenali
            }

            totalAge += group.value * midAge;
        });

        return (totalAge / totalStudents).toFixed(1);
    };

    const averageAge = calculateAverageAge();

    // Konfigurasi chart
    const chartConfig = {
        value: {
            label: studentStatus === 'active' ? 'Mahasiswa Aktif' : 'Jumlah Mahasiswa',
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
            const percentage = totalStudents > 0 ? ((data.value / totalStudents) * 100).toFixed(1) : '0';

            return (
                <div className="bg-background border-border rounded-lg border p-2 shadow-md">
                    <p className="font-medium">Umur {data.age} tahun</p>
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
            return `Mayoritas mahasiswa aktif umur ${largestAgeGroup.age} tahun (${largestAgeGroupPercentage}%)`;
        }
        return `Mayoritas umur ${largestAgeGroup.age} tahun (${largestAgeGroupPercentage}%)`;
    };

    const getFooterDescription = () => {
        if (totalStudents === 0) return 'Tidak ada data mahasiswa';

        if (studentStatus === 'active') {
            return `Rata-rata umur mahasiswa aktif: ${averageAge} tahun`;
        }
        return `Rata-rata umur mahasiswa: ${averageAge} tahun`;
    };

    return (
        <Card className="h-[600px]">
            <CardHeader>
                <CardTitle>{getChartTitle()}</CardTitle>
                <CardDescription>{getChartDescription()}</CardDescription>
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
                <div className="flex gap-2 leading-none font-medium">{getFooterText()}</div>
                <div className="text-muted-foreground leading-none">{getFooterDescription()}</div>
            </CardFooter>
        </Card>
    );
};

export default StudentAgeDistribution;
