import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartTooltip } from '@/components/ui/chart';
import { router } from '@inertiajs/react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

interface GenderDistribution {
    laki: number | string;
    perempuan: number | string;
    total: number | string;
}

interface FacultyGenderChartProps {
    genderDistribution: GenderDistribution;
    facultyName: string;
    onGenderClick?: (gender: 'laki' | 'perempuan') => void;
}

const chartConfig = {
    laki: {
        label: 'Laki-laki',
        color: '#3b82f6',
    },
    perempuan: {
        label: 'Perempuan',
        color: '#ec4899',
    },
} satisfies ChartConfig;

export default function FacultyGenderChart({ genderDistribution, facultyName, onGenderClick }: FacultyGenderChartProps) {
    // Convert string to number jika diperlukan
    const laki = typeof genderDistribution?.laki === 'string' ? parseInt(genderDistribution.laki) : genderDistribution?.laki || 0;
    const perempuan = typeof genderDistribution?.perempuan === 'string' ? parseInt(genderDistribution.perempuan) : genderDistribution?.perempuan || 0;
    const total = typeof genderDistribution?.total === 'string' ? parseInt(genderDistribution.total) : genderDistribution?.total || laki + perempuan;

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
                    if (onGenderClick) {
                        onGenderClick(gender);
                    }
                },
            });
        }
    };

    // Handle legend click dengan navigation
    const handleLegendClick = (gender: 'laki' | 'perempuan') => {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', 'students');
        url.searchParams.set('gender', gender);
        router.visit(url.toString(), {
            preserveState: true,
            replace: true,
            onSuccess: () => {
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
                    <CardDescription>Perbandingan mahasiswa laki-laki dan perempuan di {facultyName}</CardDescription>
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
            color: '#3b82f6',
        },
        {
            name: 'Perempuan',
            value: perempuan,
            color: '#ec4899',
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
                    Perbandingan mahasiswa laki-laki dan perempuan di {facultyName}
                    <span className="mt-1 block text-xs text-blue-600">💡 Klik pada chart untuk melihat data mahasiswa berdasarkan gender</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-4">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                innerRadius={30}
                                paddingAngle={2}
                                dataKey="value"
                                labelLine={false}
                                label={({ percent }) => (percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : '')}
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
                </div>

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
