<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class FacultyDistributionService
{
    /**
     * Mendapatkan distribusi mahasiswa per fakultas
     * 
     * @param string|null $termYearId ID term/semester (opsional)
     * @return array Data distribusi mahasiswa per fakultas
     */
    public function getFacultyDistribution($termYearId = null)
    {
        // $cacheKey = 'faculty-distribution' . ($termYearId ? '-' . $termYearId : '');
        
        // return Cache::remember($cacheKey, 3600, function () use ($termYearId) {
            // Menentukan tahun akademik untuk perbandingan
            $currentYear = $this->getYearFromTermId($termYearId);
            $previousYear = $currentYear - 1;

            
            // Query untuk mendapatkan data mahasiswa saat ini per fakultas
            $currentData = $this->getStudentCountByFaculty($currentYear);
            
            // Query untuk mendapatkan data mahasiswa tahun lalu per fakultas
            $previousData = $this->getStudentCountByFaculty($previousYear);
            
            // Gabungkan data dari tahun ini dan tahun lalu
            $result = [];
            
            foreach ($currentData as $facultyData) {
                $facultyId = $facultyData->faculty_id;
                $facultyName = $facultyData->faculty_name;
                $facultyAcronym = $facultyData->faculty_acronym;
                $currentCount = $facultyData->student_count;
                
                // Cari data tahun lalu untuk fakultas ini
                $previousCount = 0;
                foreach ($previousData as $prevData) {
                    if ($prevData->faculty_id == $facultyId) {
                        $previousCount = $prevData->student_count;
                        break;
                    }
                }
                
                // Hitung persentase perubahan
                $percentChange = 0;
                if ($previousCount > 0) {
                    $percentChange = (($currentCount - $previousCount) / $previousCount) * 100;
                }
                
                $result[] = [
                    'faculty' => $facultyName,
                    'faculty_acronym' => $facultyAcronym,
                    'faculty_id' => $facultyId,
                    'current' => $currentCount,
                    'previous' => $previousCount,
                    'percent_change' => round($percentChange, 1)
                ];
            }
            
            // Urutkan berdasarkan jumlah mahasiswa saat ini (terbanyak ke terkecil)
            usort($result, function($a, $b) {
                return $b['current'] <=> $a['current'];
            });
            
            return $result;
        // });
    }
    
    /**
     * Mendapatkan jumlah mahasiswa per fakultas
     * 
     * @param int $academicYear Tahun akademik
     * @return \Illuminate\Support\Collection Data jumlah mahasiswa per fakultas
     */
    private function getStudentCountByFaculty($academicYear)
    {
        return DB::table('acd_student')
                    ->join('mstr_department', 'acd_student.Department_Id', '=', 'mstr_department.Department_Id')
                    ->join('mstr_faculty', 'mstr_department.Faculty_Id', '=', 'mstr_faculty.Faculty_Id')
                    ->where('acd_student.Entry_Year_Id', 'like', $academicYear . '%') 
                    ->select(
                        'mstr_faculty.Faculty_Id as faculty_id',
                        'mstr_faculty.Faculty_Name as faculty_name',
                        'mstr_faculty.Faculty_Acronym as faculty_acronym',
                        DB::raw('COUNT(acd_student.Student_Id) as student_count')
                    )
                    ->groupBy('mstr_faculty.Faculty_Id', 'mstr_faculty.Faculty_Name')
                    ->get();
    }
    
    /**
     * Mendapatkan tahun akademik dari ID term
     * 
     * @param string|null $termYearId ID term/semester
     * @return int Tahun akademik
     */
    private function getYearFromTermId($termYearId = null)
    {
        if ($termYearId && strlen($termYearId) >= 4) {
            return (int)substr($termYearId, 0, 4);
        }
        
        // Jika tidak ada termYearId, gunakan tahun saat ini
        $currentYear = (int)date('Y');
        
        // Cek apakah kita sudah di semester baru (setelah Juli)
        $currentMonth = (int)date('m');
        if ($currentMonth >= 7) {
            return $currentYear;
        } else {
            return $currentYear - 1;
        }
    }
    
    /**
     * Mendapatkan ringkasan data distribusi fakultas
     * 
     * @param string|null $termYearId ID term/semester (opsional)
     * @return array Ringkasan data distribusi fakultas
     */
    public function getFacultyDistributionSummary($termYearId = null)
    {
        $facultyData = $this->getFacultyDistribution($termYearId);
        
        $totalCurrent = 0;
        $totalPrevious = 0;
        
        foreach ($facultyData as $faculty) {
            $totalCurrent += $faculty['current'];
            $totalPrevious += $faculty['previous'];
        }
        
        $percentChange = 0;
        if ($totalPrevious > 0) {
            $percentChange = (($totalCurrent - $totalPrevious) / $totalPrevious) * 100;
        }
        
        return [
            'total_current' => $totalCurrent,
            'total_previous' => $totalPrevious,
            'percent_change' => round($percentChange, 1),
            'distribution' => $facultyData
        ];
    }
}