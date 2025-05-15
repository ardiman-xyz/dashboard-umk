// StudentDistribution.tsx
// Simpan di: pages/academic/student/_components/StudentDistribution.tsx

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const StudentDistribution: React.FC = () => {
    // Data distribusi berdasarkan fakultas - tahun ini dan tahun lalu
    const facultyData = [
        { faculty: 'FKIP', current: 380, previous: 340 },
        { faculty: 'TEKNIK', current: 320, previous: 290 },
        { faculty: 'EKONOMI DAN BISNIS ISLAM', current: 300, previous: 340 },
        { faculty: 'HUKUM', current: 240, previous: 220 },
        { faculty: 'PERIKANAN DAN ILMU KELAUTAN', current: 160, previous: 120 },
        { faculty: 'AGAMA ISLAM', current: 140, previous: 130 },
        { faculty: 'ILMU SOSIAL DAN ILMU POLITIK', current: 120, previous: 110 },
        { faculty: 'PERTANIAN', current: 90, previous: 100 },
    ];

    // Konfigurasi chart untuk fakultas
    const facultyChartConfig = {
        current: {
            label: 'Tahun Ini',
            color: 'hsl(174, 100%, 29%)', // Warna teal
        },
        previous: {
            label: 'Tahun Lalu',
            color: 'hsl(5, 85%, 63%)', // Warna merah-oranye
        },
    } satisfies ChartConfig;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Distribusi Mahasiswa per Fakultas</CardTitle>
                <CardDescription>Total mahasiswa berdasarkan fakultas UMKendari</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={facultyChartConfig} className="h-[300px] w-full">
                    <BarChart
                        data={facultyData}
                        layout="horizontal" // Horizontal layout
                        margin={{ left: 10, right: 10, top: 10, bottom: 0 }} // Extra bottom margin for labels
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="faculty"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            angle={-20} // Rotate labels
                            textAnchor="end" // Align labels
                            interval={0} // Show all labels
                            height={100} // More space for labels
                            fontSize={10}
                        />
                        <YAxis tickLine={false} axisLine={false} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                        <Bar
                            dataKey="current"
                            fill="#283618" // Teal color (Sesuaikan dengan tema Anda)
                            radius={[4, 4, 0, 0]}
                            barSize={20}
                        />
                        <Bar
                            dataKey="previous"
                            fill="#dda15e" // Merah-oranye (Sesuaikan dengan tema Anda)
                            radius={[4, 4, 0, 0]}
                            barSize={20}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Meningkat 5,2% dibandingkan tahun lalu <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-muted-foreground leading-none">Menampilkan total mahasiswa per fakultas pada semester ini</div>
            </CardFooter>
        </Card>
    );
};

export default StudentDistribution;
