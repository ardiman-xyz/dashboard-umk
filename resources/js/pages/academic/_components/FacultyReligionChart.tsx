import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { router } from '@inertiajs/react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

interface ReligionData {
    name: string;
    value: number;
}

interface FacultyReligionChartProps {
    religionDistribution: ReligionData[];
    facultyName: string;
    facultyId?: string; // ADD this prop
    termYearId?: string; // ADD this prop
    studentStatus?: string; // ADD this prop
    onReligionClick?: (religion: string) => void; // ADD this prop
}

const religionColors = [
    '#22c55e', // green
    '#3b82f6', // blue
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // violet
    '#06b6d4', // cyan
    '#84cc16', // lime
    '#f97316', // orange
];

const chartConfig = {
    value: {
        label: 'Jumlah Mahasiswa',
        color: 'hsl(var(--chart-1))',
    },
} satisfies ChartConfig;
export default function FacultyReligionChart({
    religionDistribution,
    facultyName,
    facultyId, // ADD this
    termYearId, // ADD this
    studentStatus, // ADD this
    onReligionClick, // ADD this
}: FacultyReligionChartProps) {
    const chartData = religionDistribution.map((item, index) => ({
        ...item,
        color: religionColors[index % religionColors.length],
    }));

    const totalStudents = religionDistribution.reduce((sum, item) => sum + item.value, 0);
    const majorityReligion = religionDistribution.length > 0 ? religionDistribution[0] : null;
    const majorityPercentage = majorityReligion && totalStudents > 0 ? ((majorityReligion.value / totalStudents) * 100).toFixed(1) : '0';

    const handlePieClick = (data: any) => {
        if (data && data.name && facultyId) {
            const selectedReligion = data.name;

            // Update URL with parameter tab and religion
            const url = new URL(window.location.href);
            url.searchParams.set('tab', 'students');
            url.searchParams.set('religion', selectedReligion);

            // Navigate to the new URL
            router.visit(url.toString(), {
                preserveState: true,
                replace: true,
                onSuccess: () => {
                    if (onReligionClick) {
                        onReligionClick(selectedReligion);
                    }
                },
            });
        }
    };

    const handleLegendClick = (religion: string) => {
        if (facultyId) {
            const url = new URL(window.location.href);
            url.searchParams.set('tab', 'students');
            url.searchParams.set('religion', religion);

            router.visit(url.toString(), {
                preserveState: true,
                replace: true,
                onSuccess: () => {
                    if (onReligionClick) {
                        onReligionClick(religion);
                    }
                },
            });
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Distribusi Agama</CardTitle>
                <CardDescription>Persentase mahasiswa berdasarkan agama di {facultyName}</CardDescription>
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
                                onClick={handlePieClick} // ADD this line
                                cursor="pointer" // ADD this line
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <ChartTooltip
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length > 0) {
                                        const data = payload[0].payload;
                                        const percentage = totalStudents > 0 ? ((data.value / totalStudents) * 100).toFixed(1) : '0';

                                        return (
                                            <div className="bg-background border-border rounded-lg border p-2 shadow-md">
                                                <p className="font-medium">{data.name}</p>
                                                <p className="text-sm">
                                                    {data.value.toLocaleString()} mahasiswa ({percentage}%)
                                                </p>
                                                <p className="mt-1 text-xs text-blue-600">Klik untuk filter data mahasiswa</p> // ADD this line
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
                    {chartData.slice(0, 6).map((item) => {
                        const percentage = totalStudents > 0 ? ((item.value / totalStudents) * 100).toFixed(1) : '0';

                        return (
                            <div
                                key={item.name}
                                className="flex cursor-pointer items-center gap-2 rounded p-2 transition-colors hover:bg-gray-50" // ADD cursor-pointer and hover styles
                                onClick={() => handleLegendClick(item.name)} // ADD this line
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
                    {majorityReligion ? majorityReligion.name : 'N/A'} merupakan agama mayoritas ({majorityPercentage}%)
                </div>
                <div className="text-muted-foreground">
                    Total {totalStudents.toLocaleString()} mahasiswa dengan {religionDistribution.length} kategori agama
                </div>
            </CardFooter>
        </Card>
    );
}
