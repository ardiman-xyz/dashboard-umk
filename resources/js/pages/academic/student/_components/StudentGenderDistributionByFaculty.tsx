import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const StudentGenderDistributionByFaculty = () => {
    // Data distribusi gender per fakultas
    const genderByFacultyData = [
        { name: 'FKIP', laki: 124, perempuan: 256 },
        { name: 'Teknik', laki: 285, perempuan: 44 },
        { name: 'Ekonomi/Bisnis/Islam', laki: 145, perempuan: 168 },
        { name: 'Hukum', laki: 124, perempuan: 104 },
        { name: 'Perikanan/Ilmu Kelautan', laki: 112, perempuan: 76 },
        { name: 'Agama Islam', laki: 105, perempuan: 62 },
        { name: 'Ilmu Sosial/Politik', laki: 95, perempuan: 106 },
        { name: 'Pertanian', laki: 95, perempuan: 100 },
    ];

    const maleColor = '#283618';
    const femaleColor = '#dda15e';

    // Konfigurasi chart yang serasi
    const chartConfig = {
        laki: {
            label: 'Laki-laki',
            color: maleColor,
        },
        perempuan: {
            label: 'Perempuan',
            color: femaleColor,
        },
    } satisfies ChartConfig;

    // Hitung total dan persentase untuk insight
    const totalLaki = genderByFacultyData.reduce((sum, item) => sum + item.laki, 0);
    const totalPerempuan = genderByFacultyData.reduce((sum, item) => sum + item.perempuan, 0);
    const totalStudents = totalLaki + totalPerempuan;
    const femalePercentage = ((totalPerempuan / totalStudents) * 100).toFixed(1);

    // Cari fakultas dengan dominasi gender tertentu
    let maleDominatedFaculty = '';
    let femaleDominatedFaculty = '';
    let highestMalePercentage = 0;
    let highestFemalePercentage = 0;

    genderByFacultyData.forEach((faculty) => {
        const total = faculty.laki + faculty.perempuan;
        const malePercentage = (faculty.laki / total) * 100;
        const femalePercentage = (faculty.perempuan / total) * 100;

        if (malePercentage > highestMalePercentage) {
            highestMalePercentage = malePercentage;
            maleDominatedFaculty = faculty.name;
        }

        if (femalePercentage > highestFemalePercentage) {
            highestFemalePercentage = femalePercentage;
            femaleDominatedFaculty = faculty.name;
        }
    });

    // Format rasio untuk display
    const genderRatio =
        totalPerempuan > totalLaki ? `P:L = ${(totalPerempuan / totalLaki).toFixed(1)}:1` : `L:P = ${(totalLaki / totalPerempuan).toFixed(1)}:1`;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Distribusi Jenis Kelamin Mahasiswa per Fakultas</CardTitle>
                <CardDescription>Jenis Kelamin mahasiswa berdasarkan fakultas UMKendari</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-full w-full md:h-[300px]">
                    <BarChart
                        data={genderByFacultyData}
                        layout="vertical"
                        margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                        barSize={20} // Mengatur ukuran bar
                        barGap={0} // Menghilangkan gap antar grup bar
                        maxBarSize={20} // Maksimal ukuran bar
                    >
                        <CartesianGrid horizontal strokeDasharray="3 3" />
                        <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={120} fontSize={12} />
                        <XAxis type="number" tickLine={false} axisLine={false} />
                        <ChartTooltip
                            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                            content={(props) => {
                                if (props?.payload && props.payload.length) {
                                    const faculty = props.payload[0].payload;
                                    const total = faculty.laki + faculty.perempuan;
                                    const malePercent = ((faculty.laki / total) * 100).toFixed(1);
                                    const femalePercent = ((faculty.perempuan / total) * 100).toFixed(1);

                                    return (
                                        <div className="bg-background border-border rounded-lg border p-2 shadow-md">
                                            <p className="font-medium">{faculty.name}</p>
                                            <div className="mt-1 flex items-center gap-2">
                                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: maleColor }}></div>
                                                <p className="text-sm">
                                                    Laki-laki: {faculty.laki} ({malePercent}%)
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: femaleColor }}></div>
                                                <p className="text-sm">
                                                    Perempuan: {faculty.perempuan} ({femalePercent}%)
                                                </p>
                                            </div>
                                            <p className="text-muted-foreground mt-1 text-sm">Total: {total} mahasiswa</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar dataKey="laki" stackId="a" fill={maleColor} name="Laki-laki" />
                        <Bar dataKey="perempuan" stackId="a" fill={femaleColor} name="Perempuan" radius={[0, 4, 4, 0]} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 leading-none font-medium">
                    Rasio {genderRatio} ({femalePercentage}% perempuan)
                </div>
                <div className="text-muted-foreground leading-none">
                    {maleDominatedFaculty} dominasi laki-laki ({highestMalePercentage.toFixed(1)}%), {femaleDominatedFaculty} dominasi perempuan (
                    {highestFemalePercentage.toFixed(1)}%)
                </div>
            </CardFooter>
        </Card>
    );
};

export default StudentGenderDistributionByFaculty;
