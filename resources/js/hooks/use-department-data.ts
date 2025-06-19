import { useMemo } from 'react';

interface GenderDistribution {
    laki: number;
    perempuan: number;
    total: number;
}

interface GpaStats {
    average_gpa: number;
    highest_gpa: number;
    lowest_gpa: number;
    students_above_3: number;
}

export const useDepartmentData = (totalStudents: number, genderDistribution: GenderDistribution, gpaStats: GpaStats) => {
    const formatNumber = (num: number | null | undefined): string => {
        if (num === null || num === undefined || isNaN(num)) {
            return '0';
        }
        return num.toLocaleString('id-ID');
    };

    const genderPercentage = useMemo(() => {
        if (totalStudents === 0) return { male: 0, female: 0 };

        return {
            male: Math.round((genderDistribution.laki / totalStudents) * 100),
            female: Math.round((genderDistribution.perempuan / totalStudents) * 100),
        };
    }, [totalStudents, genderDistribution]);

    const formattedGpaStats = useMemo(
        () => ({
            averageGpa: gpaStats.average_gpa.toFixed(2),
            highestGpa: gpaStats.highest_gpa.toFixed(2),
            lowestGpa: gpaStats.lowest_gpa.toFixed(2),
            studentsAbove3: gpaStats.students_above_3,
        }),
        [gpaStats],
    );

    return {
        formatNumber,
        genderPercentage,
        formattedGpaStats,
    };
};
