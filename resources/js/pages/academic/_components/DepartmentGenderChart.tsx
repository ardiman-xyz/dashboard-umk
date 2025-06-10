import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartTooltip } from '@/components/ui/chart';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

interface GenderDistribution {
    laki: number | string;
    perempuan: number | string;
    total: number | string;
}

interface DepartmentGenderChartProps {
    genderDistribution: GenderDistribution;
    departmentName: string;
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

export default function DepartmentGenderChart({ genderDistribution, departmentName }: DepartmentGenderChartProps) {
    // Convert string to number jika diperlukan
    const laki = typeof genderDistribution?.laki === 'string' ? parseInt(genderDistribution.laki) : genderDistribution?.laki || 0;
    const perempuan = typeof genderDistribution?.perempuan === 'string' ? parseInt(genderDistribution.perempuan) : genderDistribution?.perempuan || 0;
    const total = typeof genderDistribution?.total === 'string' ? parseInt(genderDistribution.total) : genderDistribution?.total || laki + perempuan;

    // Handle case jika data tidak tersedia atau kosong
    const hasValidData = total > 0;

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
        <Card>
            <CardHeader>
                <CardTitle>Distribusi Jenis Kelamin</CardTitle>
                <CardDescription>Perbandingan mahasiswa laki-laki dan perempuan di {departmentName}</CardDescription>
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
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
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
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Legend */}
                <div className="mt-4 flex justify-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500" />
                        <span className="text-sm">Laki-laki ({malePercentage}%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-pink-500" />
                        <span className="text-sm">Perempuan ({femalePercentage}%)</span>
                    </div>
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
