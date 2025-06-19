import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

interface GenderDistribution {
    laki: number | string;
    perempuan: number | string;
    total: number | string;
}

interface DepartmentGenderChartProps {
    genderDistribution: GenderDistribution;
    departmentName: string;
    onGenderClick?: (gender: 'laki' | 'perempuan') => void;
}

const genderColors = ['#3b82f6', '#ec4899']; // Blue for male, Pink for female

const chartConfig = {
    value: {
        label: 'Jumlah Mahasiswa',
        color: 'hsl(var(--chart-1))',
    },
} satisfies ChartConfig;

export default function DepartmentGenderChart({ genderDistribution, departmentName, onGenderClick }: DepartmentGenderChartProps) {
    // Convert string to number jika diperlukan
    const laki = typeof genderDistribution?.laki === 'string' ? parseInt(genderDistribution.laki) : genderDistribution?.laki || 0;
    const perempuan = typeof genderDistribution?.perempuan === 'string' ? parseInt(genderDistribution.perempuan) : genderDistribution?.perempuan || 0;
    const total = laki + perempuan;

    // Handle case jika data tidak tersedia atau kosong
    const hasValidData = total > 0;

    // Handle pie click
    const handlePieClick = (data: any) => {
        if (onGenderClick && data) {
            const gender = data.name === 'Laki-laki' ? 'laki' : 'perempuan';
            onGenderClick(gender);
        }
    };

    // Handle legend click
    const handleLegendClick = (gender: 'laki' | 'perempuan') => {
        if (onGenderClick) {
            onGenderClick(gender);
        }
    };

    if (!hasValidData) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Distribusi Jenis Kelamin</CardTitle>
                    <CardDescription>Perbandingan mahasiswa laki-laki dan perempuan di {departmentName}</CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                    <div className="flex h-[250px] items-center justify-center">
                        <p className="text-muted-foreground">Data distribusi jenis kelamin tidak tersedia</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const chartData = [
        {
            name: 'Laki-laki',
            value: laki,
            color: genderColors[0],
        },
        {
            name: 'Perempuan',
            value: perempuan,
            color: genderColors[1],
        },
    ].filter((item) => item.value > 0);

    const malePercentage = total > 0 ? ((laki / total) * 100).toFixed(1) : '0';
    const femalePercentage = total > 0 ? ((perempuan / total) * 100).toFixed(1) : '0';

    const dominantGender = laki > perempuan ? 'Laki-laki' : 'Perempuan';
    const dominantPercentage = laki > perempuan ? malePercentage : femalePercentage;

    return (
        <Card className={onGenderClick ? 'transition-shadow hover:shadow-lg' : ''}>
            <CardHeader>
                <CardTitle>Distribusi Jenis Kelamin</CardTitle>
                <CardDescription>
                    Perbandingan mahasiswa laki-laki dan perempuan di {departmentName}
                    {onGenderClick && (
                        <span className="mt-1 block text-xs text-blue-600">💡 Klik pada chart untuk filter data mahasiswa berdasarkan gender</span>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                innerRadius={30}
                                paddingAngle={1}
                                dataKey="value"
                                labelLine={false}
                                label={({ percent }) => (percent > 5 ? `${(percent * 100).toFixed(0)}%` : '')}
                                onClick={handlePieClick}
                                className={onGenderClick ? 'cursor-pointer' : ''}
                                cursor={'pointer'}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={entry.color}
                                        className={onGenderClick ? 'cursor-pointer hover:opacity-80' : ''}
                                    />
                                ))}
                            </Pie>
                            <ChartTooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length > 0) {
                                        const data = payload[0].payload;
                                        const percentage = total > 0 ? ((data.value / total) * 100).toFixed(1) : '0';

                                        return (
                                            <div className="bg-background border-border rounded-lg border p-2 shadow-md">
                                                <p className="font-medium">{data.name}</p>
                                                <p className="text-sm">
                                                    {data.value.toLocaleString()} mahasiswa ({percentage}%)
                                                </p>
                                                {onGenderClick && <p className="mt-1 text-xs text-blue-600">Klik untuk filter</p>}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>

                {/* Legend */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                    {chartData.map((item) => {
                        const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
                        const gender = item.name === 'Laki-laki' ? 'laki' : 'perempuan';

                        return (
                            <div
                                key={item.name}
                                className={`flex items-center gap-2 ${onGenderClick ? 'cursor-pointer rounded p-2 transition-colors hover:bg-gray-50' : ''}`}
                                onClick={() => handleLegendClick(gender)}
                            >
                                <div className="h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="truncate text-xs">
                                    {item.name} ({percentage}%)
                                </span>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="font-medium">
                    {dominantGender} dominan dengan {dominantPercentage}% dari total mahasiswa
                </div>
                <div className="text-muted-foreground">
                    Total {total.toLocaleString()} mahasiswa ({laki.toLocaleString()} L, {perempuan.toLocaleString()} P)
                </div>
            </CardFooter>
        </Card>
    );
}
