import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { router } from '@inertiajs/react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

interface GenderDistribution {
    laki: number | string;
    perempuan: number | string;
    total: number | string;
}

interface DepartmentGenderChartProps {
    genderDistribution: GenderDistribution;
    departmentName: string;
    departmentId: string; // Add departmentId prop
    termYearId: string; // Add termYearId prop
    studentStatus: string; // Add studentStatus prop
    onGenderClick?: (gender: 'laki' | 'perempuan') => void;
}

const genderColors = ['#3b82f6', '#ec4899']; // Blue for male, Pink for female

const chartConfig = {
    value: {
        label: 'Jumlah Mahasiswa',
        color: 'hsl(var(--chart-1))',
    },
} satisfies ChartConfig;

export default function DepartmentGenderChart({
    genderDistribution,
    departmentName,
    departmentId,
    termYearId,
    studentStatus,
    onGenderClick,
}: DepartmentGenderChartProps) {
    // Convert string to number jika diperlukan
    const laki = typeof genderDistribution?.laki === 'string' ? parseInt(genderDistribution.laki) : genderDistribution?.laki || 0;
    const perempuan = typeof genderDistribution?.perempuan === 'string' ? parseInt(genderDistribution.perempuan) : genderDistribution?.perempuan || 0;
    const total = laki + perempuan;

    // Handle case jika data tidak tersedia atau kosong
    const hasValidData = total > 0;

    // Handle pie click dengan navigation ke URL
    const handlePieClick = (data: any) => {
        if (data) {
            const gender = data.name === 'Laki-laki' ? 'laki' : 'perempuan';

            // Update URL dengan parameter tab dan gender
            const url = new URL(window.location.href);
            url.searchParams.set('tab', 'students');
            url.searchParams.set('gender', gender);

            // Navigate to the new URL
            router.visit(url.toString(), {
                preserveState: true,
                replace: true,
                onSuccess: () => {
                    // Call the onGenderClick callback if provided
                    if (onGenderClick) {
                        onGenderClick(gender);
                    }
                },
            });
        }
    };

    // Handle legend click dengan navigation
    const handleLegendClick = (gender: 'laki' | 'perempuan') => {
        // Update URL dengan parameter tab dan gender
        const url = new URL(window.location.href);
        url.searchParams.set('tab', 'students');
        url.searchParams.set('gender', gender);

        // Navigate to the new URL
        router.visit(url.toString(), {
            preserveState: true,
            replace: true,
            onSuccess: () => {
                // Call the onGenderClick callback if provided
                if (onGenderClick) {
                    onGenderClick(gender);
                }
            },
        });
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
        <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
                <CardTitle>Distribusi Jenis Kelamin</CardTitle>
                <CardDescription>
                    Perbandingan mahasiswa laki-laki dan perempuan di {departmentName}
                    <span className="mt-1 block text-xs text-blue-600">💡 Klik pada chart untuk melihat data mahasiswa berdasarkan gender</span>
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
                                className="cursor-pointer"
                                cursor="pointer"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} className="cursor-pointer transition-opacity hover:opacity-80" />
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
                                                <p className="mt-1 text-xs text-blue-600">Klik untuk filter data mahasiswa</p>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>

                {/* Interactive Legend */}
                <div className="mt-4 grid grid-cols-2 gap-2">
                    {chartData.map((item) => {
                        const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : '0';
                        const gender = item.name === 'Laki-laki' ? 'laki' : 'perempuan';

                        return (
                            <div
                                key={item.name}
                                className="flex cursor-pointer items-center gap-2 rounded p-2 transition-colors hover:bg-gray-50"
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
                <div className="text-xs text-blue-600 italic">Klik pada chart atau legend untuk melihat detail mahasiswa berdasarkan gender</div>
            </CardFooter>
        </Card>
    );
}
