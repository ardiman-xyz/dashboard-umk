import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React from 'react';

interface Course {
    code: string;
    name: string;
    instructor: string;
    students: number;
}

interface PopularCoursesTableProps {
    courses: Course[];
}

export const PopularCoursesTable: React.FC<PopularCoursesTableProps> = ({ courses }) => {
    return (
        <Card className="col-span-3">
            <CardHeader>
                <CardTitle>Mata Kuliah Terpopuler</CardTitle>
                <CardDescription>Mata kuliah dengan jumlah pendaftar terbanyak semester ini</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Kode MK</TableHead>
                            <TableHead>Nama Mata Kuliah</TableHead>
                            <TableHead>Dosen</TableHead>
                            <TableHead className="text-right">Pendaftar</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {courses.map((course) => (
                            <TableRow key={course.code}>
                                <TableCell className="font-medium">{course.code}</TableCell>
                                <TableCell>{course.name}</TableCell>
                                <TableCell>{course.instructor}</TableCell>
                                <TableCell className="text-right">{course.students}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};
