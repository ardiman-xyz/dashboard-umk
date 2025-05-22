import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface ReligionData {
    name: string;
    value: number;
    color?: string;
}

interface TooltipProps {
    active?: boolean;
    payload?: Array<{
        payload: ReligionData;
    }>;
}

const StudentReligionDistribution: React.FC<{
    religionDistribution?: ReligionData[];
    studentStatus?: string;
    isAllFilter?: boolean;
}> = ({ religionDistribution, studentStatus = 'all', isAllFilter = false }) => {
    // Predefined colors untuk konsistensi
    const predefinedColors = [
        '#333d29', // dark green untuk Islam (mayoritas)
        '#936639', // brown untuk Kristen
        '#c2c5aa', // light green untuk Katolik
        '#7f4f24', // dark brown untuk Hindu
        '#a4ac86', // sage green untuk Buddha
        '#6b7280', // gray untuk Konghucu
    ];

    // Function untuk assign warna berdasarkan nama agama
    const getColorByReligion = (religionName: string): string => {
        const colorMap: { [key: string]: string } = {
            ISLAM: '#333d29', // dark green
            Islam: '#333d29', // dark green
            PROTESTAN: '#936639', // brown
            Protestan: '#936639', // brown
            Kristen: '#936639', // brown
            KATHOLIK: '#c2c5aa', // light green
            Katolik: '#c2c5aa', // light green
            HINDU: '#7f4f24', // dark brown
            Hindu: '#7f4f24', // dark brown
            BUDHA: '#a4ac86', // sage green
            Buddha: '#a4ac86', // sage green
            KONGHUCU: '#8b7355', // tan
            Konghucu: '#8b7355', // tan
            'Agama Lainnya': '#6b7280', // gray untuk NULL/lainnya
        };

        return colorMap[religionName] || '#6b7280'; // default gray
    };

    // Function untuk assign warna berdasarkan index (fallback)
    const getColorByIndex = (index: number): string => {
        return predefinedColors[index] || predefinedColors[predefinedColors.length - 1];
    };

    // Data fallback jika props tidak tersedia
    const fallbackData: ReligionData[] = [
        { name: 'Islam', value: 18935, color: '#333d29' },
        { name: 'Kristen', value: 2956, color: '#936639' },
        { name: 'Katolik', value: 1745, color: '#c2c5aa' },
        { name: 'Hindu', value: 358, color: '#7f4f24' },
        { name: 'Buddha', value: 215, color: '#a4ac86' },
        { name: 'Konghucu', value: 58, color: '#8b7355' },
        { name: 'Agama Lainnya', value: 19000, color: '#6b7280' }, // Tambah kategori Agama Lainnya
    ];

    // Gunakan data real jika ada, fallback ke dummy
    const religionData: ReligionData[] =
        religionDistribution && religionDistribution.length > 0
            ? religionDistribution.map((item, index) => ({
                  name: item.name,
                  value: item.value,
                  color: item.color || getColorByReligion(item.name) || getColorByIndex(index),
              }))
            : fallbackData;

    // Dynamic title dan description berdasarkan filter
    const getChartTitle = () => {
        if (studentStatus === 'active') {
            return 'Distribusi Agama Mahasiswa Aktif';
        }
        return 'Distribusi Agama Mahasiswa';
    };

    const getChartDescription = () => {
        if (studentStatus === 'active') {
            if (isAllFilter) {
                return 'Agama mahasiswa aktif semester saat ini';
            }
            return 'Agama mahasiswa aktif berdasarkan semester';
        }

        if (isAllFilter) {
            return 'Persentase seluruh mahasiswa berdasarkan agama';
        }
        return 'Persentase mahasiswa berdasarkan agama yang dianut';
    };

    // Hitung total dan persentase untuk insight
    const totalStudents: number = religionData.reduce((sum, item) => sum + item.value, 0);

    // Format jumlah dengan tanda ribuan
    const formatNumber = (num: number): string => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    // Custom tooltip untuk menampilkan informasi saat hover
    const CustomTooltip: React.FC<TooltipProps> = ({ active, payload }) => {
        if (active && payload && payload.length > 0) {
            const data = payload[0].payload;
            const percentage = totalStudents > 0 ? ((data.value / totalStudents) * 100).toFixed(1) : '0';

            return (
                <div className="bg-background border-border rounded-lg border p-2 shadow-md">
                    <p className="font-medium">{data.name}</p>
                    <p className="text-sm">
                        {formatNumber(data.value)} mahasiswa {studentStatus === 'active' ? 'aktif' : ''}
                    </p>
                    <p className="text-muted-foreground text-xs">{percentage}% dari total</p>
                </div>
            );
        }
        return null;
    };

    // Tampilkan data dalam format tabel untuk legenda
    const ReligionTable: React.FC = () => (
        <ScrollArea className="h-[175px] w-full rounded-md border p-4">
            <div className="mt-4 w-full overflow-hidden">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b">
                            <th className="pb-2 text-left">Agama</th>
                            <th className="pb-2 text-right">Jumlah</th>
                            <th className="pb-2 text-right">Persentase</th>
                        </tr>
                    </thead>
                    <tbody>
                        {religionData.map((item, index) => (
                            <tr key={index} className="border-muted border-b last:border-0">
                                <td className="py-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                        {item.name}
                                    </div>
                                </td>
                                <td className="py-2 text-right">{formatNumber(item.value)}</td>
                                <td className="py-2 text-right">{totalStudents > 0 ? ((item.value / totalStudents) * 100).toFixed(1) : '0'}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </ScrollArea>
    );

    // Dynamic footer text
    const getFooterText = () => {
        if (studentStatus === 'active') {
            return `Total ${formatNumber(totalStudents)} mahasiswa aktif`;
        }
        return `Total ${formatNumber(totalStudents)} mahasiswa`;
    };

    const getFooterDescription = () => {
        if (religionData.length > 0 && totalStudents > 0) {
            const majorityReligion = religionData[0].name;
            const majorityPercentage = ((religionData[0].value / totalStudents) * 100).toFixed(1);

            if (studentStatus === 'active') {
                return `${majorityReligion} merupakan agama mayoritas mahasiswa aktif (${majorityPercentage}%)`;
            }
            return `${majorityReligion} merupakan agama mayoritas (${majorityPercentage}%)`;
        }
        return 'Data tidak tersedia';
    };

    return (
        <Card className="h-[600px]">
            <CardHeader>
                <CardTitle>{getChartTitle()}</CardTitle>
                <CardDescription>{getChartDescription()}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <div className="h-64 w-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={religionData}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                innerRadius={50}
                                paddingAngle={2}
                                dataKey="value"
                                labelLine={false}
                                fontSize={12}
                                label={({ percent }) => `${percent ? (percent * 100).toFixed(0) : '0'}%`}
                            >
                                {religionData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <ReligionTable />
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="leading-none font-medium">{getFooterText()}</div>
                <div className="text-muted-foreground leading-none">{getFooterDescription()}</div>
            </CardFooter>
        </Card>
    );
};

export default StudentReligionDistribution;
