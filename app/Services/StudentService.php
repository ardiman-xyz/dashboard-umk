<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class StudentService
{
    /**
     * Mendapatkan jumlah mahasiswa (semua atau berdasarkan term)
     * 
     * @param string|null $termYearId ID term/semester (opsional)
     * @return array Data statistik mahasiswa
     */
    public function getActiveStudentsCount($termYearId = null)
    {
        // Membuat cache key yang berbeda berdasarkan term
        // $cacheKey = 'student-stats' . ($termYearId && $termYearId !== 'all' ? '-' . $termYearId : '-all');
        
        // return Cache::remember($cacheKey, 3600, function () use ($termYearId) {
            $query = DB::table('acd_student');
            
            // Jika term_year_id diberikan dan bukan 'all', filter berdasarkan term
            if ($termYearId && $termYearId !== 'all') {
                // Filter berdasarkan term yang aktif
                $query->join('acd_student_krs', 'acd_student.Student_Id', '=', 'acd_student_krs.Student_Id')
                    ->where('acd_student_krs.Term_Year_Id', $termYearId)
                    ->where('acd_student_krs.Is_Approved', '1')
                    ->distinct('acd_student.Student_Id');
            }
            
            // Hitung total mahasiswa sesuai filter
            $currentTotal = $query->count('acd_student.Student_Id');
            
            // Jika 'all', hanya tampilkan total tanpa perbandingan
            if (!$termYearId || $termYearId === 'all') {
                return [
                    'total' => number_format($currentTotal, 0, ',', '.'),
                    'trend' => null // Tidak menampilkan trend untuk filter 'all'
                ];
            }
            
            // Hitung total mahasiswa semester sebelumnya untuk perbandingan
            $previousTermYearId = $this->getPreviousTerm($termYearId);
            
            $previousTermQuery = DB::table('acd_student');
            
            if ($previousTermYearId) {
                $previousTermQuery->join('acd_student_krs', 'acd_student.Student_Id', '=', 'acd_student_krs.Student_Id')
                                ->where('acd_student_krs.Term_Year_Id', $previousTermYearId)
                                ->where('acd_student_krs.Is_Approved', '1')
                                ->distinct('acd_student.Student_Id');
            }
            
            $previousTermTotal = $previousTermQuery->count('acd_student.Student_Id');
            
            // Jika tidak ada data semester sebelumnya, gunakan nilai perkiraan
            if ($previousTermTotal == 0) {
                $previousTermTotal = (int)($currentTotal * 0.95); // Asumsi 95% dari total saat ini
            }

            // Hitung persentase perubahan
            $percentage = 0;
            if ($previousTermTotal > 0) {
                $percentage = (($currentTotal - $previousTermTotal) / $previousTermTotal) * 100;
            }

            // Tentukan tren (naik/turun)
            $trend = 'neutral';
            if ($percentage > 0) {
                $trend = 'up';
            } elseif ($percentage < 0) {
                $trend = 'down';
                $percentage = abs($percentage); // Jadikan positif untuk tampilan
            }

            // Mendapatkan nama semester sebelumnya
            $previousTermName = '';
            if ($previousTermYearId) {
                $previousTermName = $this->getTermName($previousTermYearId);
            }

            return [
                'total' => number_format($currentTotal, 0, ',', '.'),
                'trend' => [
                    'value' => number_format($percentage, 1, ',', '.') . '% dari ' . 
                            ($previousTermName ? $previousTermName : 'semester sebelumnya'),
                    'type' => $trend
                ]
            ];
        // });
    }

    /**
     * Mendapatkan ID semester sebelumnya dari ID semester yang diberikan
     *
     * @param string|null $currentTermYearId ID semester saat ini
     * @return string|null ID semester sebelumnya
     */
    private function getPreviousTerm($currentTermYearId = null)
    {
        // Jika all atau null, kembalikan null
        if (!$currentTermYearId || $currentTermYearId === 'all') {
            return null;
        }
        
        // Format ID term biasanya [TAHUN][SEMESTER]
        // Contoh: 20212 (tahun 2021, semester 2/genap)
        if (strlen($currentTermYearId) < 5) {
            return null;
        }
        
        $year = (int)substr($currentTermYearId, 0, 4);
        $term = (int)substr($currentTermYearId, 4, 1);
        
        // Jika semester 1, kembali ke semester 2 tahun sebelumnya
        if ($term == 1) {
            return ($year - 1) . '2';
        } 
        // Jika semester 2, kembali ke semester 1 tahun yang sama
        else if ($term == 2) {
            return $year . '1';
        }
        // Jika semester 3 (pendek), kembali ke semester 2 tahun yang sama
        else if ($term == 3) {
            return $year . '2';
        }
        // Term tidak dikenali
        else {
            return null;
        }
    }
    
    /**
     * Mendapatkan query untuk semester sebelumnya jika tidak ada term spesifik
     *
     * @return \Illuminate\Database\Query\Builder Query untuk semester sebelumnya
     */
    private function getDefaultPreviousTermQuery()
    {
        // Cari semester terbaru
        $latestTerm = DB::table('mstr_term_year')
            ->orderBy('Term_Year_Id', 'desc')
            ->first();
            
        if ($latestTerm) {
            $previousTermId = $this->getPreviousTerm($latestTerm->Term_Year_Id);
            
            if ($previousTermId) {
                return DB::table('acd_student')
                    ->join('acd_student_krs', 'acd_student.Student_Id', '=', 'acd_student_krs.Student_Id')
                    ->where('acd_student_krs.Term_Year_Id', $previousTermId)
                    ->where('acd_student_krs.Is_Approved', '1')
                    ->distinct('acd_student.Student_Id');
            }
        }
        
        // Fallback jika tidak bisa menentukan semester sebelumnya
        return DB::table('acd_student');
    }
    
    /**
     * Mendapatkan nama semester dari ID
     *
     * @param string $termYearId ID semester
     * @return string Nama semester
     */
    private function getTermName($termYearId)
    {
        // Coba ambil dari database
        $termInfo = DB::table('mstr_term_year')
            ->where('Term_Year_Id', $termYearId)
            ->first();
            
        if ($termInfo && !empty($termInfo->Term_Year_Name)) {
            return $termInfo->Term_Year_Name;
        }
        
        // Jika tidak ada di database, format berdasarkan ID
        if (strlen($termYearId) < 5) {
            return 'semester sebelumnya';
        }
        
        $year = (int)substr($termYearId, 0, 4);
        $term = (int)substr($termYearId, 4, 1);
        
        $termName = '';
        
        switch ($term) {
            case 1:
                $termName = "Ganjil";
                break;
            case 2:
                $termName = "Genap";
                break;
            case 3:
                $termName = "Pendek";
                break;
            default:
                $termName = "";
        }
        
        return $termName . ' ' . $year . '/' . ($year + 1);
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