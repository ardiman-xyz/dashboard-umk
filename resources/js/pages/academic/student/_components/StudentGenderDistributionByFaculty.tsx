import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface GenderData {
    faculty: string;
    laki: number;
    perempuan: number;
}

const StudentGenderDistributionByFaculty: React.FC<{
    genderDistribution?: GenderData[];
    studentStatus?: string;
    isAllFilter?: boolean;
}> = ({ genderDistribution, studentStatus = 'all', isAllFilter = false }) => {
    // Data fallback jika props tidak tersedia
    const fallbackData = [
        { faculty: 'FKIP', laki: 124, perempuan: 256 },
        { faculty: 'Teknik', laki: 285, perempuan: 44 },
        { faculty: 'Ekonomi/Bisnis/Islam', laki: 145, perempuan: 168 },
        { faculty: 'Hukum', laki: 124, perempuan: 104 },
        { faculty: 'Perikanan/Ilmu Kelautan', laki: 112, perempuan: 76 },
        { faculty: 'Agama Islam', laki: 105, perempuan: 62 },
        { faculty: 'Ilmu Sosial/Politik', laki: 95, perempuan: 106 },
        { faculty: 'Pertanian', laki: 95, perempuan: 100 },
    ];

    // Gunakan data real jika tersedia, jika tidak gunakan fallback
    const genderByFacultyData =
        genderDistribution && genderDistribution.length > 0
            ? genderDistribution.map((item) => ({
                  faculty: item.faculty,
                  laki: item.laki,
                  perempuan: item.perempuan,
              }))
            : fallbackData;

    const maleColor = '#283618';
    const femaleColor = '#dda15e';

    // Dynamic title dan description berdasarkan filter
    const getChartTitle = () => {
        if (studentStatus === 'active') {
            return 'Distribusi Jenis Kelamin Mahasiswa Aktif per Fakultas';
        }
        return 'Distribusi Jenis Kelamin Mahasiswa per Fakultas';
    };

    const getChartDescription = () => {
        if (studentStatus === 'active') {
            if (isAllFilter) {
                return 'Jenis kelamin mahasiswa aktif semester saat ini per fakultas';
            }
            return 'Jenis kelamin mahasiswa aktif berdasarkan fakultas UMKendari';
        }

        if (isAllFilter) {
            return 'Jenis kelamin seluruh mahasiswa per fakultas';
        }
        return 'Jenis kelamin mahasiswa berdasarkan fakultas UMKendari';
    };

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
    const femalePercentage = totalStudents > 0 ? ((totalPerempuan / totalStudents) * 100).toFixed(1) : '0';

    // Cari fakultas dengan dominasi gender tertentu
    let maleDominatedFaculty = '';
    let femaleDominatedFaculty = '';
    let highestMalePercentage = 0;
    let highestFemalePercentage = 0;

    genderByFacultyData.forEach((faculty) => {
        const total = faculty.laki + faculty.perempuan;
        if (total > 0) {
            const malePercentage = (faculty.laki / total) * 100;
            const femalePercentage = (faculty.perempuan / total) * 100;

            if (malePercentage > highestMalePercentage) {
                highestMalePercentage = malePercentage;
                maleDominatedFaculty = faculty.faculty;
            }

            if (femalePercentage > highestFemalePercentage) {
                highestFemalePercentage = femalePercentage;
                femaleDominatedFaculty = faculty.faculty;
            }
        }
    });

    // Format rasio untuk display
    const genderRatio =
        totalStudents > 0
            ? totalPerempuan > totalLaki
                ? `P:L = ${(totalPerempuan / totalLaki).toFixed(1)}:1`
                : `L:P = ${(totalLaki / totalPerempuan).toFixed(1)}:1`
            : 'N/A';

    // Dynamic footer text
    const getFooterText = () => {
        if (studentStatus === 'active') {
            return `Rasio ${genderRatio} (${femalePercentage}% perempuan aktif)`;
        }
        return `Rasio ${genderRatio} (${femalePercentage}% perempuan)`;
    };

    const getFooterDescription = () => {
        const maleText = maleDominatedFaculty ? `${maleDominatedFaculty} dominasi laki-laki (${highestMalePercentage.toFixed(1)}%)` : '';
        const femaleText = femaleDominatedFaculty ? `${femaleDominatedFaculty} dominasi perempuan (${highestFemalePercentage.toFixed(1)}%)` : '';

        if (maleText && femaleText) {
            return `${maleText}, ${femaleText}`;
        }
        return maleText || femaleText || 'Data tidak tersedia';
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{getChartTitle()}</CardTitle>
                <CardDescription>{getChartDescription()}</CardDescription>
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
                        <YAxis dataKey="faculty" type="category" tickLine={false} axisLine={false} width={120} fontSize={12} />
                        <XAxis type="number" tickLine={false} axisLine={false} />
                        <ChartTooltip
                            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                            content={(props) => {
                                if (props?.payload && props.payload.length) {
                                    const faculty = props.payload[0].payload;
                                    const total = faculty.laki + faculty.perempuan;
                                    const malePercent = total > 0 ? ((faculty.laki / total) * 100).toFixed(1) : '0';
                                    const femalePercent = total > 0 ? ((faculty.perempuan / total) * 100).toFixed(1) : '0';

                                    return (
                                        <div className="bg-background border-border rounded-lg border p-2 shadow-md">
                                            <p className="font-medium">{faculty.faculty}</p>
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
                                            <p className="text-muted-foreground mt-1 text-sm">
                                                Total: {total} mahasiswa {studentStatus === 'active' ? 'aktif' : ''}
                                            </p>
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
                <div className="flex gap-2 leading-none font-medium">{getFooterText()}</div>
                <div className="text-muted-foreground leading-none">{getFooterDescription()}</div>
            </CardFooter>
        </Card>
    );
};

export default StudentGenderDistributionByFaculty;
