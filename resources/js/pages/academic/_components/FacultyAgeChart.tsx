import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { router } from '@inertiajs/react';
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from 'recharts';

interface AgeData {
    age: string;
    value: number;
}

interface FacultyAgeChartProps {
    ageDistribution: AgeData[];
    facultyName: string;
    facultyId?: string; // ADD this prop
    termYearId?: string; // ADD this prop
    studentStatus?: string; // ADD this prop
    onAgeClick?: (age: string) => void; // ADD this prop
}

const ageColors = [
    '#a1cca5', // light green untuk 17-19
    '#8fb996', // medium green untuk 20-22
    '#709775', // dark green untuk 23-25
    '#415d43', // darker green untuk 26-30
    '#111d13', // darkest green untuk > 30
];

const chartConfig = {
    value: {
        label: 'Jumlah Mahasiswa',
        color: 'hsl(var(--chart-1))',
    },
} satisfies ChartConfig;

export default function FacultyAgeChart({
    ageDistribution,
    facultyName,
    facultyId, // ADD this
    termYearId, // ADD this
    studentStatus, // ADD this
    onAgeClick, // ADD this
}: FacultyAgeChartProps) {
    const chartData = ageDistribution.map((item, index) => ({
        ...item,
        color: ageColors[index % ageColors.length],
    }));

    const totalStudents = ageDistribution.reduce((sum, item) => sum + item.value, 0);
    const largestAgeGroup = ageDistribution.length > 0 ? [...ageDistribution].sort((a, b) => b.value - a.value)[0] : null;

    const largestAgeGroupPercentage = largestAgeGroup && totalStudents > 0 ? ((largestAgeGroup.value / totalStudents) * 100).toFixed(1) : '0';

    // Hitung rata-rata umur berdasarkan data
    const calculateAverageAge = () => {
        if (totalStudents === 0) return '0';

        let totalAge = 0;
        ageDistribution.forEach((group) => {
            let midAge = 0;

            // Tentukan nilai tengah untuk setiap kelompok
            switch (group.age) {
                case '17-19':
                    midAge = 18;
                    break;
                case '20-22':
                    midAge = 21;
                    break;
                case '23-25':
                    midAge = 24;
                    break;
                case '26-30':
                    midAge = 28;
                    break;
                case '> 30':
                    midAge = 35; // Estimasi untuk > 30
                    break;
                default:
                    midAge = 22; // Default jika tidak dikenali
            }

            totalAge += group.value * midAge;
        });

        return (totalAge / totalStudents).toFixed(1);
    };
    const handleBarClick = (data: any) => {
        if (data && data.age && facultyId) {
            const selectedAge = data.age;

            // Update URL with parameter tab and age
            const url = new URL(window.location.href);
            url.searchParams.set('tab', 'students');
            url.searchParams.set('age', selectedAge);

            // Navigate to the new URL
            router.visit(url.toString(), {
                preserveState: true,
                replace: true,
                onSuccess: () => {
                    if (onAgeClick) {
                        onAgeClick(selectedAge);
                    }
                },
            });
        }
    };

    const averageAge = calculateAverageAge();

    return (
        <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
                <CardTitle>Distribusi Umur</CardTitle>
                <CardDescription>
                    Kelompok umur mahasiswa di {facultyName}
                    <span className="mt-1 block text-xs text-blue-600">💡 Klik pada chart untuk melihat data mahasiswa berdasarkan umur</span>
                </CardDescription>
            </CardHeader>

            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }} barSize={40}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis dataKey="age" tickLine={false} axisLine={false} tick={{ fill: '#666', fontSize: 12 }} />
                        <YAxis hide />
                        <ChartTooltip
                            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length > 0) {
                                    const data = payload[0].payload;
                                    const percentage = totalStudents > 0 ? ((data.value / totalStudents) * 100).toFixed(1) : '0';

                                    return (
                                        <div className="bg-background border-border rounded-lg border p-2 shadow-md">
                                            <p className="font-medium">Umur {data.age} tahun</p>
                                            <p className="text-sm">
                                                {data.value.toLocaleString()} mahasiswa ({percentage}%)
                                            </p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} onClick={handleBarClick} className="cursor-pointer" style={{ cursor: 'pointer' }}>
                            {' '}
                            // ADD onClick, className, and style
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} className="cursor-pointer transition-opacity hover:opacity-80" /> // ADD className for hover effect
                            ))}
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="font-medium">
                    Mayoritas umur {largestAgeGroup ? largestAgeGroup.age : 'N/A'} tahun ({largestAgeGroupPercentage}%)
                </div>
                <div className="text-muted-foreground">Rata-rata umur mahasiswa: {averageAge} tahun</div>
                <div className="text-xs text-blue-600 italic">Klik pada chart untuk melihat detail mahasiswa berdasarkan umur</div> // ADD this line
            </CardFooter>
        </Card>
    );
}
