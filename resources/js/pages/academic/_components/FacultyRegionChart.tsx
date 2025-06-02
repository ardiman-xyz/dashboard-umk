import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';

interface RegionData {
    name: string;
    value: number;
}

interface FacultyRegionChartProps {
    regionDistribution: RegionData[];
    facultyName: string;
}

const regionColors: { [key: string]: string } = {
    'Sulawesi Tenggara': '#22c55e', // green
    'Sulawesi Selatan': '#3b82f6', // blue
    'Sulawesi Tengah': '#6366f1', // indigo
    'Sulawesi Barat': '#f59e0b', // amber
    'Sulawesi Utara': '#ef4444', // red
    Gorontalo: '#8b5cf6', // violet
    Papua: '#ec4899', // pink
    Maluku: '#f97316', // orange
    'Daerah Lainnya': '#6b7280', // gray
    'Tidak Diketahui': '#9ca3af', // gray-400
};

const chartConfig = {
    value: {
        label: 'Jumlah Mahasiswa',
        color: 'hsl(var(--chart-1))',
    },
} satisfies ChartConfig;

export default function FacultyRegionChart({ regionDistribution, facultyName }: FacultyRegionChartProps) {
    const chartData = regionDistribution.map((item) => ({
        ...item,
        color: regionColors[item.name] || '#6b7280',
    }));

    const totalStudents = regionDistribution.reduce((sum, item) => sum + item.value, 0);
    const largestRegion = regionDistribution.length > 0 ? regionDistribution[0] : null;
    const largestRegionPercentage = largestRegion && totalStudents > 0 ? ((largestRegion.value / totalStudents) * 100).toFixed(1) : '0';

    // Hitung persentase mahasiswa asal Sulawesi
    const sulawesiProvinces = ['Sulawesi Tenggara', 'Sulawesi Selatan', 'Sulawesi Tengah', 'Sulawesi Barat', 'Sulawesi Utara', 'Gorontalo'];
    const sulawesiStudents = regionDistribution
        .filter((region) => sulawesiProvinces.includes(region.name))
        .reduce((sum, item) => sum + item.value, 0);

    const sulawesiPercentage = totalStudents > 0 ? ((sulawesiStudents / totalStudents) * 100).toFixed(1) : '0';

    return (
        <Card>
            <CardHeader>
                <CardTitle>Distribusi Asal Daerah</CardTitle>
                <CardDescription>Mahasiswa berdasarkan provinsi asal di {facultyName}</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 5, left: 50, bottom: 5 }} barSize={15}>
                        <CartesianGrid horizontal strokeDasharray="3 3" />
                        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} fontSize={12} tick={{ fill: '#666' }} width={120} />
                        <XAxis type="number" hide />
                        <ChartTooltip
                            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
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
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="font-medium">
                    Mayoritas dari {largestRegion ? largestRegion.name : 'N/A'} ({largestRegionPercentage}%)
                </div>
                <div className="text-muted-foreground">{sulawesiPercentage}% mahasiswa berasal dari Pulau Sulawesi</div>
            </CardFooter>
        </Card>
    );
}
