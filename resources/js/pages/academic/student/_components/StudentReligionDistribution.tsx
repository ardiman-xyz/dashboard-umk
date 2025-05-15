import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

interface ReligionData {
    name: string;
    value: number;
    color: string;
}

interface TooltipProps {
    active?: boolean;
    payload?: Array<{
        payload: ReligionData;
    }>;
}

const StudentReligionDistribution: React.FC = () => {
    // Data distribusi agama
    const religionData: ReligionData[] = [
        { name: 'Islam', value: 18935, color: '#333d29' }, // emerald-500
        { name: 'Kristen', value: 2956, color: '#936639' }, // blue-500
        { name: 'Katolik', value: 1745, color: '#c2c5aa' }, // indigo-500
        { name: 'Hindu', value: 358, color: '#7f4f24' }, // amber-500
        { name: 'Buddha', value: 215, color: '#a4ac86' }, // red-500
        { name: 'Konghucu', value: 58, color: '#7f4f24' }, // violet-500
    ];

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
            const percentage = ((data.value / totalStudents) * 100).toFixed(1);

            return (
                <div className="bg-background border-border rounded-lg border p-2 shadow-md">
                    <p className="font-medium">{data.name}</p>
                    <p className="text-sm">{formatNumber(data.value)} mahasiswa</p>
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
                                <td className="py-2 text-right">{((item.value / totalStudents) * 100).toFixed(1)}%</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </ScrollArea>
    );

    return (
        <Card className="h-[600px]">
            <CardHeader>
                <CardTitle>Distribusi Agama Mahasiswa</CardTitle>
                <CardDescription>Persentase mahasiswa berdasarkan agama yang dianut</CardDescription>
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
                <div className="leading-none font-medium">Total {formatNumber(totalStudents)} mahasiswa</div>
                <div className="text-muted-foreground leading-none">
                    {religionData[0].name} merupakan agama mayoritas ({((religionData[0].value / totalStudents) * 100).toFixed(1)}%)
                </div>
            </CardFooter>
        </Card>
    );
};

export default StudentReligionDistribution;
