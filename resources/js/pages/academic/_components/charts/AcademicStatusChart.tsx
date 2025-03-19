'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import * as React from 'react';
import { Cell, Label, Pie, PieChart } from 'recharts';

const chartData = [
    { status: 'Aktif', students: 11245, fill: '#22c55e' }, // green
    { status: 'Cuti', students: 423, fill: '#eab308' }, // yellow
    { status: 'Probation', students: 790, fill: '#ef4444' }, // red
];

const chartConfig = {
    students: {
        label: 'Mahasiswa',
    },
    aktif: {
        label: 'Aktif',
        color: '#22c55e', // green
    },
    cuti: {
        label: 'Cuti',
        color: '#eab308', // yellow
    },
    probation: {
        label: 'Probation',
        color: '#ef4444', // red
    },
} satisfies ChartConfig;

export function AcademicStatusChart() {
    const totalStudents = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.students, 0);
    }, []);

    return (
        <Card className="flex flex-col">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">Status Akademik Mahasiswa</CardTitle>
                <CardDescription className="text-xs">Persentase berdasarkan status</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={(props) => {
                                if (props?.payload && props.payload.length > 0) {
                                    const data = props.payload[0].payload;
                                    const percentage = ((data.students / totalStudents) * 100).toFixed(1);

                                    return (
                                        <div className="border-border bg-background rounded-lg border p-2 shadow-md">
                                            <div className="flex items-center gap-2">
                                                <div className="h-3 w-3 rounded-full" style={{ background: data.fill }} />
                                                <span className="font-medium">{data.status}</span>
                                            </div>
                                            <div className="mt-1 text-sm">
                                                {data.students.toLocaleString()} mahasiswa ({percentage}%)
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Pie
                            data={chartData}
                            dataKey="students"
                            nameKey="status"
                            innerRadius={60}
                            outerRadius={90}
                            strokeWidth={5}
                            stroke="#fff"
                            paddingAngle={2}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                                        return (
                                            <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                                                    {totalStudents.toLocaleString()}
                                                </tspan>
                                                <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground text-sm">
                                                    Mahasiswa
                                                </tspan>
                                            </text>
                                        );
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="pt-2">
                <div className="flex w-full flex-wrap justify-center gap-6">
                    {chartData.map((item) => (
                        <div key={item.status} className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
                            <span className="text-sm">
                                {item.status} ({((item.students / totalStudents) * 100).toFixed(1)}%)
                            </span>
                        </div>
                    ))}
                </div>
            </CardFooter>
        </Card>
    );
}
