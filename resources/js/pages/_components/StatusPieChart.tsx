import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import React from 'react';
import { Label, Pie, PieChart } from 'recharts';

interface StatusData {
    status: string;
    count: number;
    color: string;
}

interface StatusPieChartProps {
    data: StatusData[];
    totalStudents: number;
}

export const StatusPieChart: React.FC<StatusPieChartProps> = ({ data, totalStudents }) => {
    // Ubah data yang diterima menjadi format yang sesuai untuk chart
    const chartData = data.map((item) => ({
        status: item.status,
        students: item.count,
        fill: item.color,
    }));

    // Buat konfigurasi chart sesuai dengan format shadcn/ui
    const chartConfig: ChartConfig = {
        students: {
            label: 'Mahasiswa',
        },
    };

    // Tambahkan setiap status ke konfigurasi
    data.forEach((item, index) => {
        chartConfig[item.status] = {
            label: item.status,
            color: item.color,
        };
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle>Status Akademik Mahasiswa</CardTitle>
                <CardDescription>Persentase mahasiswa berdasarkan status akademik</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={(props) => {
                                if (props?.payload && props.payload.length > 0) {
                                    const data = props.payload[0];
                                    return (
                                        <div className="border-border bg-background rounded-lg border p-2 shadow-md">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full" style={{ background: data.payload.fill }} />
                                                <span className="text-sm font-medium">{data.name}: </span>
                                                <span className="text-sm font-medium">
                                                    {data.value} ({((Number(data.value) / totalStudents) * 100).toFixed(1)}%)
                                                </span>
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
                            paddingAngle={2}
                            strokeWidth={1}
                            stroke="#000"
                        >
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
                                    return null;
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>

                {/* Footer */}
                <CardFooter className="flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2 leading-none font-medium">
                        Meningkat 3.2% dari tahun lalu <TrendingUp className="h-4 w-4" />
                    </div>
                    <div className="text-muted-foreground leading-none">Menampilkan total mahasiswa aktif semester ini</div>
                </CardFooter>
            </CardContent>
        </Card>
    );
};
