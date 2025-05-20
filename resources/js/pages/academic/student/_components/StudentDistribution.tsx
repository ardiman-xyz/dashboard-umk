import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp } from 'lucide-react';
import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface FacultyData {
    faculty: string;
    faculty_acronym: string;
    faculty_id: string;
    current: number;
    previous: number;
    percent_change: number;
}

interface FacultyDistributionProps {
    distribution: FacultyData[];
    total_current: number;
    total_previous: number;
    percent_change: number;
}

const StudentDistribution: React.FC<{ facultyDistribution?: FacultyDistributionProps }> = ({ facultyDistribution }) => {
    // Data fallback jika props tidak tersedia
    const fallbackData = [
        { faculty: 'FKIP', current: 380, previous: 340 },
        { faculty: 'TEKNIK', current: 320, previous: 290 },
        { faculty: 'EKONOMI DAN BISNIS ISLAM', current: 300, previous: 340 },
        { faculty: 'HUKUM', current: 240, previous: 220 },
        { faculty: 'PERIKANAN DAN ILMU KELAUTAN', current: 160, previous: 120 },
        { faculty: 'AGAMA ISLAM', current: 140, previous: 130 },
        { faculty: 'ILMU SOSIAL DAN ILMU POLITIK', current: 120, previous: 110 },
        { faculty: 'PERTANIAN', current: 90, previous: 100 },
    ];

    // Gunakan data dari fakultyDistribution jika tersedia, jika tidak gunakan fallback
    const chartData = facultyDistribution
        ? facultyDistribution.distribution.map((item) => ({
              faculty: item.faculty_acronym === 'T' ? item.faculty : item.faculty_acronym,
              current: item.current,
              previous: item.previous,
          }))
        : fallbackData;

    // Gunakan persentase perubahan dari data jika tersedia
    const percentChange = facultyDistribution ? facultyDistribution.percent_change : 5.2;

    // Konfigurasi chart untuk fakultas
    const facultyChartConfig = {
        current: {
            label: 'Tahun Ini',
            color: '#283618', // Hijau tua
        },
        previous: {
            label: 'Tahun Lalu',
            color: '#dda15e', // Cokelat
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
                    <BarChart data={chartData} layout="horizontal" margin={{ left: 10, right: 10, top: 10, bottom: 0 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="faculty"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                            angle={-20}
                            textAnchor="end"
                            interval={0}
                            height={100}
                            fontSize={10}
                        />
                        <YAxis tickLine={false} axisLine={false} domain={[0, 'dataMax + 50']} ticks={[0, 95, 190, 285, 380]} />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                        <Bar
                            dataKey="current"
                            fill="#283618" // Hijau tua (sesuai dengan screenshot)
                            radius={[4, 4, 0, 0]}
                            barSize={20}
                        />
                        <Bar
                            dataKey="previous"
                            fill="#dda15e" // Cokelat (sesuai dengan screenshot)
                            radius={[4, 4, 0, 0]}
                            barSize={20}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Meningkat {percentChange}% dibandingkan tahun lalu <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-muted-foreground leading-none">Menampilkan total mahasiswa per fakultas pada semester ini</div>
            </CardFooter>
        </Card>
    );
};

export default StudentDistribution;
