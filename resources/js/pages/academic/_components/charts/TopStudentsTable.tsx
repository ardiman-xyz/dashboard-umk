'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUpRight } from 'lucide-react';

// Data mahasiswa berprestasi
const topStudents = [
    {
        nim: 'S12345',
        name: 'Ahmad Fauzi',
        program: 'Teknik Informatika',
        faculty: 'Teknik',
        ipk: 3.97,
    },
    {
        nim: 'S12567',
        name: 'Dina Putri',
        program: 'Kedokteran',
        faculty: 'Kedokteran',
        ipk: 3.95,
    },
    {
        nim: 'S13456',
        name: 'Budi Santoso',
        program: 'Manajemen',
        faculty: 'Ekonomi',
        ipk: 3.92,
    },
    {
        nim: 'S15678',
        name: 'Rini Wulandari',
        program: 'Hukum',
        faculty: 'Hukum',
        ipk: 3.91,
    },
    {
        nim: 'S14567',
        name: 'Siti Rahayu',
        program: 'Akuntansi',
        faculty: 'Ekonomi',
        ipk: 3.89,
    },
];

export function TopStudentsTable() {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle>Mahasiswa Berprestasi</CardTitle>
                <CardDescription>Mahasiswa dengan IPK tertinggi</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>NIM</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>Program Studi</TableHead>
                            <TableHead className="text-right">IPK</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {topStudents.map((student) => (
                            <TableRow key={student.nim}>
                                <TableCell className="font-medium">{student.nim}</TableCell>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.program}</TableCell>
                                <TableCell className="text-right">{student.ipk}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <CardFooter className="justify-end">
                <Button variant="outline" size="sm" className="gap-1">
                    Lihat Semua <ArrowUpRight className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}
