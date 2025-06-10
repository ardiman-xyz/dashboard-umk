import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { router } from '@inertiajs/react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface DepartmentStat {
    Department_Id: string;
    Department_Name: string;
    Department_Acronym: string;
    student_count: number;
}

interface FacultyDepartmentChartProps {
    departmentStats: DepartmentStat[];
    facultyName: string;
}

const chartConfig = {
    student_count: {
        label: 'Jumlah Mahasiswa',
        color: '#2563eb',
    },
} satisfies ChartConfig;

export default function FacultyDepartmentChart({ departmentStats, facultyName }: FacultyDepartmentChartProps) {
    const totalStudents = departmentStats.reduce((sum, dept) => sum + dept.student_count, 0);
    const largestDept = departmentStats.length > 0 ? departmentStats[0] : null;
    const largestDeptPercentage = largestDept && totalStudents > 0 ? ((largestDept.student_count / totalStudents) * 100).toFixed(1) : '0';

    const chartData = departmentStats.map((dept) => ({
        name: dept.Department_Acronym || dept.Department_Name,
        value: dept.student_count,
        fullName: dept.Department_Name,
        departmentId: dept.Department_Id,
    }));

    const handleBarClick = (data: DepartmentStat, index: number) => {
        const clickedData = chartData[index];

        if (clickedData && clickedData.departmentId) {
            router.visit(
                route('academic.department.detail', {
                    departmentId: clickedData.departmentId,
                }),
            );
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Distribusi per Program Studi</CardTitle>
                <CardDescription>Jumlah mahasiswa per program studi di {facultyName}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid horizontal strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={80} fontSize={12} tickLine={false} axisLine={false} />
                        <ChartTooltip
                            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length > 0) {
                                    const data = payload[0].payload;
                                    const percentage = totalStudents > 0 ? ((data.value / totalStudents) * 100).toFixed(1) : '0';

                                    return (
                                        <div className="bg-background border-border rounded-lg border p-2 shadow-md">
                                            <p className="font-medium">{data.fullName}</p>
                                            <p className="text-sm">
                                                {data.value.toLocaleString()} mahasiswa ({percentage}%)
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar
                            onClick={handleBarClick}
                            style={{ cursor: 'pointer' }}
                            dataKey="value"
                            fill="var(--color-student_count)"
                            radius={[0, 4, 4, 0]}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="font-medium">
                    {largestDept ? largestDept.Department_Name : 'N/A'} memiliki mahasiswa terbanyak ({largestDeptPercentage}%)
                </div>
                <div className="text-muted-foreground">
                    Total {totalStudents.toLocaleString()} mahasiswa di {departmentStats.length} program studi
                </div>
            </CardFooter>
        </Card>
    );
}
