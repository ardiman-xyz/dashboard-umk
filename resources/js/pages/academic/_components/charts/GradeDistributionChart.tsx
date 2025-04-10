import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type AcademicStats, type GradeData } from '@/types/academic';
import { PageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';
import { TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';

interface PagePropsWithStats extends PageProps {
    stats: AcademicStats;
}

const chartConfig = {
    count: {
        label: 'Jumlah Mahasiswa',
        color: '#3b82f6',
    },
} satisfies ChartConfig;

export function GradeDistributionChart() {
    const { stats } = usePage<PagePropsWithStats>().props;
    const [displayMode, setDisplayMode] = useState<'letter' | 'detail'>('letter');
    const [letterGradeData, setLetterGradeData] = useState<GradeData[]>([]);
    const [detailGradeData, setDetailGradeData] = useState<GradeData[]>([]);
    const [goodGradePercentage, setGoodGradePercentage] = useState<number>(0);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [hasData, setHasData] = useState<boolean>(false);

    useEffect(() => {
        if (stats?.gradeDistribution) {
            // Data Nilai Huruf
            if (stats.gradeDistribution.letter_grade?.data && stats.gradeDistribution.letter_grade.data.length > 0) {
                setLetterGradeData(stats.gradeDistribution.letter_grade.data);
                setGoodGradePercentage(stats.gradeDistribution.letter_grade.good_grade_percentage);
                setTotalCount(stats.gradeDistribution.letter_grade.total_count);
                setHasData(true);
            }

            // Data Range IPK Detail
            if (stats.gradeDistribution.detail_grade?.data && stats.gradeDistribution.detail_grade.data.length > 0) {
                setDetailGradeData(stats.gradeDistribution.detail_grade.data);
                setHasData(true);
            }
        }
    }, [stats]);

    // Pilih data berdasarkan mode tampilan
    const chartData = displayMode === 'letter' ? letterGradeData : detailGradeData;

    // Update good grade percentage based on display mode
    useEffect(() => {
        if (stats?.gradeDistribution) {
            if (displayMode === 'letter' && stats.gradeDistribution.letter_grade) {
                setGoodGradePercentage(stats.gradeDistribution.letter_grade.good_grade_percentage);
                setTotalCount(stats.gradeDistribution.letter_grade.total_count);
            } else if (displayMode === 'detail' && stats.gradeDistribution.detail_grade) {
                setGoodGradePercentage(stats.gradeDistribution.detail_grade.good_grade_percentage);
                setTotalCount(stats.gradeDistribution.detail_grade.total_count);
            }
        }
    }, [displayMode, stats]);

    // Jika tidak ada data, tampilkan pesan
    if (!hasData || chartData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Distribusi Nilai</CardTitle>
                    <CardDescription className="text-xs">Persentase nilai semester ini</CardDescription>
                </CardHeader>
                <CardContent className="flex h-64 items-center justify-center">
                    <p className="text-muted-foreground">Data distribusi nilai belum tersedia</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-base">Distribusi Nilai</CardTitle>
                        <CardDescription className="text-xs">Persentase nilai semester ini</CardDescription>
                    </div>
                    <Select defaultValue="letter" onValueChange={(value) => setDisplayMode(value as 'letter' | 'detail')}>
                        <SelectTrigger className="h-8 w-[160px] text-xs">
                            <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="letter">Nilai Huruf (A-E)</SelectItem>
                            <SelectItem value="detail">Range IPK Detail</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 10 }} barGap={4}>
                        <CartesianGrid horizontal strokeDasharray="3 3" />
                        <YAxis dataKey="grade" type="category" tickLine={false} axisLine={false} width={55} fontSize={12} />
                        <XAxis type="number" tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
                        <ChartTooltip
                            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                            content={(props) => {
                                if (props?.payload && props.payload.length > 0) {
                                    const data = props.payload[0].payload as GradeData;
                                    return (
                                        <div className="border-border bg-background rounded-lg border p-2 shadow-md">
                                            <div className="font-medium">Nilai {data.grade}</div>
                                            <div className="text-sm">
                                                {data.count.toLocaleString()} mahasiswa ({data.percentage}%)
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="percentage" radius={[0, 4, 4, 0]} maxBarSize={30}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 pt-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    {displayMode === 'letter'
                        ? `${goodGradePercentage}% mahasiswa mendapat nilai A atau B`
                        : `${goodGradePercentage}% mahasiswa memiliki IPK ≥ 3.00`}
                    <TrendingUp className="h-4 w-4 text-green-500" />
                </div>
                <div className="text-muted-foreground leading-none">Total {totalCount.toLocaleString()} nilai yang diberikan</div>
            </CardFooter>
        </Card>
    );
}
