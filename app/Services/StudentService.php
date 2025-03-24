<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class StudentService
{
    /**
     * Mendapatkan jumlah mahasiswa aktif
     * 
     * @return array Data statistik mahasiswa aktif
     */
    public function getActiveStudentsCount()
    {
        // Menggunakan Redis cache jika tersedia
        return Cache::remember('active-students-stats', 3600, function () {
            // Hitung total mahasiswa aktif
            $currentTotal = DB::table('acd_student')
                // ->where('Register_Status_Id', 'A') // Asumsi status 'A' adalah mahasiswa aktif
                ->count();

            // Hitung total mahasiswa aktif tahun lalu (untuk perbandingan)
            $lastYearTotal = DB::table('acd_student')
                // ->where('Register_Status_Id', 'A')
                ->where('Entry_Year_Id', '<', 2024)
                ->count();

            // Hitung persentase perubahan
            $percentage = 0;
            if ($lastYearTotal > 0) {
                $percentage = (($currentTotal - $lastYearTotal) / $lastYearTotal) * 100;
            }

            // Tentukan tren (naik/turun)
            $trend = 'neutral';
            if ($percentage > 0) {
                $trend = 'up';
            } elseif ($percentage < 0) {
                $trend = 'down';
                $percentage = abs($percentage); // Jadikan positif untuk tampilan
            }

            return [
                'total' => number_format($currentTotal, 0, ',', '.'),
                'trend' => [
                    'value' => number_format($percentage, 1, ',', '.') . '% dari tahun lalu',
                    'type' => $trend
                ]
            ];
        });
    }

    /**
     * Mendapatkan statistik mahasiswa berdasarkan program studi
     * 
     * @return array Statistik mahasiswa per program studi
     */
    public function getStudentsByProgram()
    {
        return Cache::remember('students-by-program', 3600, function () {
            return DB::table('acd_student')
                ->select('Class_Prog_Id', DB::raw('count(*) as total'))
                ->where('Register_Status_Id', 'A')
                ->groupBy('Class_Prog_Id')
                ->get()
                ->toArray();
        });
    }

    /**
     * Mendapatkan statistik mahasiswa berdasarkan departemen/fakultas
     * 
     * @return array Statistik mahasiswa per departemen
     */
    public function getStudentsByDepartment()
    {
        return Cache::remember('students-by-department', 3600, function () {
            return DB::table('acd_student')
                ->select('Department_Id', DB::raw('count(*) as total'))
                ->where('Register_Status_Id', 'A')
                ->groupBy('Department_Id')
                ->get()
                ->toArray();
        });
    }

    /**
     * Mendapatkan statistik mahasiswa berdasarkan tahun masuk
     * 
     * @return array Statistik mahasiswa per tahun masuk
     */
    public function getStudentsByEntryYear()
    {
        return Cache::remember('students-by-entry-year', 3600, function () {
            return DB::table('acd_student')
                ->select('Entry_Year_Id', DB::raw('count(*) as total'))
                ->where('Register_Status_Id', 'A')
                ->groupBy('Entry_Year_Id')
                ->orderBy('Entry_Year_Id', 'desc')
                ->get()
                ->toArray();
        });
    }

    /**
     * Mendapatkan mahasiswa dengan status akademik bermasalah
     * 
     * @return array Data statistik mahasiswa bermasalah
     */
    public function getAcademicProblemStudentsCount()
    {
        return Cache::remember('problem-students-stats', 3600, function () {
            // Asumsi mahasiswa bermasalah memiliki status tertentu atau kondisi lain
            // Sesuaikan dengan aturan akademik kampus Anda
            $totalProblem = DB::table('acd_student')
                ->where('Register_Status_Id', 'P') // Asumsi 'P' adalah status percobaan/probation
                ->count();

            $totalStudents = DB::table('acd_student')
                ->where('Register_Status_Id', 'A')
                ->count();
            
            $percentage = 0;
            if ($totalStudents > 0) {
                $percentage = ($totalProblem / $totalStudents) * 100;
            }

            return [
                'total' => number_format($totalProblem, 0, ',', '.'),
                'trend' => [
                    'value' => number_format($percentage, 1, ',', '.') . '% dari total mahasiswa',
                    'type' => 'down' // Karena semakin sedikit yang bermasalah semakin baik
                ]
            ];
        });
    }
}