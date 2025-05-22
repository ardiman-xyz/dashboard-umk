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
     * @param string $studentStatus Status mahasiswa ('all' atau 'active')
     * @return array Data distribusi mahasiswa per fakultas
     */
    public function getFacultyDistribution($termYearId = null, $studentStatus = 'all')
    {
        $cacheKey = 'faculty-distribution' . ($termYearId ? '-' . $termYearId : '-all') . '-' . $studentStatus;
        
        return Cache::remember($cacheKey, 3600, function () use ($termYearId, $studentStatus) {
            // Jika filter 'all' dan student status 'all', ambil semua data mahasiswa
            if (($termYearId === 'all' || $termYearId === null) && $studentStatus === 'all') {
                // Query untuk semua mahasiswa tanpa filter
                $currentData = DB::table('acd_student')
                    ->join('mstr_department', 'acd_student.Department_Id', '=', 'mstr_department.Department_Id')
                    ->join('mstr_faculty', 'mstr_department.Faculty_Id', '=', 'mstr_faculty.Faculty_Id')
                    ->select(
                        'mstr_faculty.Faculty_Id as faculty_id',
                        'mstr_faculty.Faculty_Name as faculty_name',
                        'mstr_faculty.Faculty_Acronym as faculty_acronym',
                        DB::raw('COUNT(acd_student.Student_Id) as student_count')
                    )
                    ->groupBy('mstr_faculty.Faculty_Id', 'mstr_faculty.Faculty_Name', 'mstr_faculty.Faculty_Acronym')
                    ->get();
            } 
            // Jika filter status 'active', ambil mahasiswa yang mengambil KRS di semester saat ini
            else if ($studentStatus === 'active') {
                // Dapatkan term saat ini jika termYearId adalah 'all'
                $currentTermId = ($termYearId === 'all' || $termYearId === null) 
                    ? $this->getCurrentActiveTermId() 
                    : $termYearId;
                
                // Query untuk mahasiswa aktif (yang mengambil KRS di semester saat ini)
                $currentData = DB::table('acd_student')
                    ->join('mstr_department', 'acd_student.Department_Id', '=', 'mstr_department.Department_Id')
                    ->join('mstr_faculty', 'mstr_department.Faculty_Id', '=', 'mstr_faculty.Faculty_Id')
                    ->join('acd_student_krs', 'acd_student.Student_Id', '=', 'acd_student_krs.Student_Id')
                    ->where('acd_student_krs.Term_Year_Id', $currentTermId)
                    ->where('acd_student_krs.Is_Approved', '1')
                    ->select(
                        'mstr_faculty.Faculty_Id as faculty_id',
                        'mstr_faculty.Faculty_Name as faculty_name',
                        'mstr_faculty.Faculty_Acronym as faculty_acronym',
                        DB::raw('COUNT(DISTINCT acd_student.Student_Id) as student_count')
                    )
                    ->groupBy('mstr_faculty.Faculty_Id', 'mstr_faculty.Faculty_Name', 'mstr_faculty.Faculty_Acronym')
                    ->get();
            }
            // Filter berdasarkan status aktif saja
            else {
                // Query untuk semua mahasiswa aktif (Register_Status_Id = 'A')
                $currentData = DB::table('acd_student')
                    ->join('mstr_department', 'acd_student.Department_Id', '=', 'mstr_department.Department_Id')
                    ->join('mstr_faculty', 'mstr_department.Faculty_Id', '=', 'mstr_faculty.Faculty_Id')
                    ->where('acd_student.Register_Status_Id', 'A')
                    ->select(
                        'mstr_faculty.Faculty_Id as faculty_id',
                        'mstr_faculty.Faculty_Name as faculty_name',
                        'mstr_faculty.Faculty_Acronym as faculty_acronym',
                        DB::raw('COUNT(acd_student.Student_Id) as student_count')
                    )
                    ->groupBy('mstr_faculty.Faculty_Id', 'mstr_faculty.Faculty_Name', 'mstr_faculty.Faculty_Acronym')
                    ->get();
            }

            // Untuk filter 'all' atau 'active', tidak ada perbandingan
            if ($termYearId === 'all' || $termYearId === null || $studentStatus === 'active') {
                $result = [];
                foreach ($currentData as $facultyData) {
                    $result[] = [
                        'faculty' => $facultyData->faculty_name,
                        'faculty_acronym' => $facultyData->faculty_acronym,
                        'faculty_id' => $facultyData->faculty_id,
                        'current' => $facultyData->student_count,
                        'previous' => 0, // Tidak ada data pembanding untuk 'all'
                        'percent_change' => 0 // Tidak ada perubahan untuk 'all'
                    ];
                }
            } else {
                // Logika existing untuk filter berdasarkan term spesifik
                $currentYear = $this->getYearFromTermId($termYearId);
                $previousYear = $currentYear - 1;
                
                $currentData = $this->getStudentCountByFaculty($currentYear);
                $previousData = $this->getStudentCountByFaculty($previousYear);
                
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
            }
            
            // Urutkan berdasarkan jumlah mahasiswa saat ini (terbanyak ke terkecil)
            usort($result, function($a, $b) {
                return $b['current'] <=> $a['current'];
            });
            
            return $result;
        });
    }
    
    /**
     * Mendapatkan jumlah mahasiswa per fakultas berdasarkan tahun akademik
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
                    ->groupBy('mstr_faculty.Faculty_Id', 'mstr_faculty.Faculty_Name', 'mstr_faculty.Faculty_Acronym')
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
        if ($termYearId && $termYearId !== 'all' && strlen($termYearId) >= 4) {
            return (int)substr($termYearId, 0, 4);
        }
        
        // Jika tidak ada termYearId atau 'all', gunakan tahun saat ini
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
     * Mendapatkan term aktif saat ini
     * 
     * @return string ID term saat ini
     */
    private function getCurrentActiveTermId()
    {
        // Cari term dengan tanggal mulai dan selesai yang mencakup tanggal hari ini
        $currentTerm = DB::table('mstr_term_year')
            ->where('Start_Date', '<=', now())
            ->where('End_Date', '>=', now())
            ->first();
        
        // Jika tidak ada term aktif, ambil term terakhir
        if (!$currentTerm) {
            $currentTerm = DB::table('mstr_term_year')
                ->orderBy('Term_Year_Id', 'desc')
                ->first();
        }
        
        return $currentTerm ? $currentTerm->Term_Year_Id : '20242'; // Default fallback
    }

    /**
     * Mendapatkan ringkasan data distribusi fakultas
     * 
     * @param string|null $termYearId ID term/semester (opsional)
     * @param string $studentStatus Status mahasiswa ('all' atau 'active')
     * @return array Ringkasan data distribusi fakultas
     */
    public function getFacultyDistributionSummary($termYearId = null, $studentStatus = 'all')
    {
        $facultyData = $this->getFacultyDistribution($termYearId, $studentStatus);
        
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

    // Update method getGenderDistributionByFaculty
    public function getGenderDistributionByFaculty($termYearId = null, $studentStatus = 'all')
    {
        $cacheKey = 'gender-distribution-faculty-' . ($termYearId ?: 'all') . '-' . $studentStatus;
        
        return Cache::remember($cacheKey, 3600, function () use ($termYearId, $studentStatus) {
            $query = DB::table('acd_student')
                ->join('mstr_department', 'acd_student.Department_Id', '=', 'mstr_department.Department_Id')
                ->join('mstr_faculty', 'mstr_department.Faculty_Id', '=', 'mstr_faculty.Faculty_Id')
                ->join('mstr_gender', 'acd_student.Gender_Id', '=', 'mstr_gender.Gender_Id'); // JOIN dengan master gender

            // Apply filters sama seperti sebelumnya
            if ($studentStatus === 'active') {
                $currentTermId = ($termYearId === 'all' || $termYearId === null) 
                    ? $this->getCurrentActiveTermId() 
                    : $termYearId;
                
                $query->join('acd_student_krs', 'acd_student.Student_Id', '=', 'acd_student_krs.Student_Id')
                    ->where('acd_student_krs.Term_Year_Id', $currentTermId)
                    ->where('acd_student_krs.Is_Approved', '1');
            } elseif ($termYearId !== 'all' && $termYearId !== null) {
                $year = $this->getYearFromTermId($termYearId);
                $query->where('acd_student.Entry_Year_Id', 'like', $year . '%');
            }

            return $query->select(
                    'mstr_faculty.Faculty_Acronym as faculty',
                    DB::raw('SUM(CASE WHEN acd_student.Gender_Id = 1 THEN 1 ELSE 0 END) as laki'),
                    DB::raw('SUM(CASE WHEN acd_student.Gender_Id = 2 THEN 1 ELSE 0 END) as perempuan')
                )
                ->groupBy('mstr_faculty.Faculty_Id', 'mstr_faculty.Faculty_Acronym')
                ->orderBy('mstr_faculty.Faculty_Acronym')
                ->get();
        });
    }


    public function getReligionDistribution($termYearId = null, $studentStatus = 'all')
    {
        $cacheKey = 'religion-distribution-' . ($termYearId ?: 'all') . '-' . $studentStatus;
        
        return Cache::remember($cacheKey, 3600, function () use ($termYearId, $studentStatus) {
            $query = DB::table('acd_student')
                ->leftJoin('mstr_religion', 'acd_student.Religion_Id', '=', 'mstr_religion.Religion_Id'); 
    
            // Apply filters SAMA PERSIS seperti getFacultyDistribution
            if ($studentStatus === 'active') {
                $currentTermId = ($termYearId === 'all' || $termYearId === null) 
                    ? $this->getCurrentActiveTermId() 
                    : $termYearId;
                
                $query->join('acd_student_krs', 'acd_student.Student_Id', '=', 'acd_student_krs.Student_Id')
                      ->where('acd_student_krs.Term_Year_Id', $currentTermId)
                      ->where('acd_student_krs.Is_Approved', '1');
            } elseif ($termYearId !== 'all' && $termYearId !== null) {
                $year = $this->getYearFromTermId($termYearId);
                $query->where('acd_student.Entry_Year_Id', 'like', $year . '%');
            }
    
            return $query->select(
                    DB::raw('CASE 
                        WHEN mstr_religion.Religion_Name IS NULL THEN "Lainnya" 
                        ELSE mstr_religion.Religion_Name 
                    END as name'),
                    DB::raw('COUNT(acd_student.Student_Id) as value')
                )
                ->groupBy(
                    DB::raw('CASE 
                        WHEN mstr_religion.Religion_Name IS NULL THEN "Lainnya" 
                        ELSE mstr_religion.Religion_Name 
                    END')
                )
                ->orderBy('value', 'desc')
                ->get();
        });
    }


    public function getAgeDistribution($termYearId = null, $studentStatus = 'all')
    {
        $useCache = true; // Toggle cache
        
        $cacheKey = 'age-distribution-' . ($termYearId ?: 'all') . '-' . $studentStatus;
        
        if ($useCache) {
            return Cache::remember($cacheKey, 3600, function () use ($termYearId, $studentStatus) {
                return $this->executeAgeQuery($termYearId, $studentStatus);
            });
        }
        
        return $this->executeAgeQuery($termYearId, $studentStatus);
    }

    private function executeAgeQuery($termYearId, $studentStatus)
    {
        $query = DB::table('acd_student')
            ->whereNotNull('acd_student.Birth_Date'); // Pastikan ada tanggal lahir
    
        // Apply filters SAMA PERSIS seperti method lain
        if ($studentStatus === 'active') {
            $currentTermId = ($termYearId === 'all' || $termYearId === null) 
                ? $this->getCurrentActiveTermId() 
                : $termYearId;
            
            $query->join('acd_student_krs', 'acd_student.Student_Id', '=', 'acd_student_krs.Student_Id')
                  ->where('acd_student_krs.Term_Year_Id', $currentTermId)
                  ->where('acd_student_krs.Is_Approved', '1');
        } elseif ($termYearId !== 'all' && $termYearId !== null) {
            $year = $this->getYearFromTermId($termYearId);
            $query->where('acd_student.Entry_Year_Id', 'like', $year . '%');
        }
    
        // Menggunakan subquery untuk menghindari GROUP BY error
        $results = $query->select(
                DB::raw('
                    CASE 
                        WHEN TIMESTAMPDIFF(YEAR, Birth_Date, CURDATE()) BETWEEN 17 AND 19 THEN "17-19"
                        WHEN TIMESTAMPDIFF(YEAR, Birth_Date, CURDATE()) BETWEEN 20 AND 22 THEN "20-22"
                        WHEN TIMESTAMPDIFF(YEAR, Birth_Date, CURDATE()) BETWEEN 23 AND 25 THEN "23-25"
                        WHEN TIMESTAMPDIFF(YEAR, Birth_Date, CURDATE()) BETWEEN 26 AND 30 THEN "26-30"
                        WHEN TIMESTAMPDIFF(YEAR, Birth_Date, CURDATE()) > 30 THEN "> 30"
                        ELSE "Tidak Diketahui"
                    END as age_range
                '),
                DB::raw('
                    CASE 
                        WHEN TIMESTAMPDIFF(YEAR, Birth_Date, CURDATE()) BETWEEN 17 AND 19 THEN 1
                        WHEN TIMESTAMPDIFF(YEAR, Birth_Date, CURDATE()) BETWEEN 20 AND 22 THEN 2
                        WHEN TIMESTAMPDIFF(YEAR, Birth_Date, CURDATE()) BETWEEN 23 AND 25 THEN 3
                        WHEN TIMESTAMPDIFF(YEAR, Birth_Date, CURDATE()) BETWEEN 26 AND 30 THEN 4
                        WHEN TIMESTAMPDIFF(YEAR, Birth_Date, CURDATE()) > 30 THEN 5
                        ELSE 6
                    END as sort_order
                '),
                DB::raw('COUNT(acd_student.Student_Id) as value')
            )
            ->groupBy('age_range', 'sort_order')
            ->orderBy('sort_order')
            ->get();
    
        return $results->map(function ($item) {
            return [
                'age' => $item->age_range,
                'value' => $item->value
            ];
        });
    }

    public function getRegionDistribution($termYearId = null, $studentStatus = 'all')
    {
        $useCache = true; // Toggle cache
        
        $cacheKey = 'region-distribution-' . ($termYearId ?: 'all') . '-' . $studentStatus;
        
        if ($useCache) {
            return Cache::remember($cacheKey, 3600, function () use ($termYearId, $studentStatus) {
                return $this->executeRegionQuery($termYearId, $studentStatus);
            });
        }
        
        return $this->executeRegionQuery($termYearId, $studentStatus);
    }

    private function executeRegionQuery($termYearId, $studentStatus)
    {
        $query = DB::table('acd_student');
    
        // Apply filters sama seperti sebelumnya
        if ($studentStatus === 'active') {
            $currentTermId = ($termYearId === 'all' || $termYearId === null) 
                ? $this->getCurrentActiveTermId() 
                : $termYearId;
            
            $query->join('acd_student_krs', 'acd_student.Student_Id', '=', 'acd_student_krs.Student_Id')
                  ->where('acd_student_krs.Term_Year_Id', $currentTermId)
                  ->where('acd_student_krs.Is_Approved', '1');
        } elseif ($termYearId !== 'all' && $termYearId !== null) {
            $year = $this->getYearFromTermId($termYearId);
            $query->where('acd_student.Entry_Year_Id', 'like', $year . '%');
        }
    
        // Query yang lebih inclusive
        return $query->select(
                DB::raw('
                    CASE 
                        -- Sulawesi Tenggara (lebih komprehensif)
                        WHEN UPPER(COALESCE(Birth_Place, "")) LIKE "%KENDARI%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%BAUBAU%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%RAHA%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%KOLAKA%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%KONAWE%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULTRA%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULAWESI TENGGARA%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%WAKATOBI%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%BOMBANA%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%BUTON%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%MUNA%" 
                        THEN "Sulawesi Tenggara"
                        
                        -- Sulawesi Selatan
                        WHEN UPPER(COALESCE(Birth_Place, "")) LIKE "%MAKASSAR%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%GOWA%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%BONE%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%MAROS%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULSEL%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULAWESI SELATAN%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%PARE%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%PINRANG%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%MAJENE%" 
                        THEN "Sulawesi Selatan"
                        
                        -- Sulawesi Tengah
                        WHEN UPPER(COALESCE(Birth_Place, "")) LIKE "%PALU%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULTENG%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULAWESI TENGAH%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%DONGGALA%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%POSO%" 
                        THEN "Sulawesi Tengah"
                        
                        -- Sulawesi Barat
                        WHEN UPPER(COALESCE(Birth_Place, "")) LIKE "%MAMUJU%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULBAR%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULAWESI BARAT%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%POLEWALI%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%MANDAR%" 
                        THEN "Sulawesi Barat"
                        
                        -- Sulawesi Utara
                        WHEN UPPER(COALESCE(Birth_Place, "")) LIKE "%MANADO%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%BITUNG%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%TOMOHON%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULUT%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULAWESI UTARA%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%MINAHASA%" 
                        THEN "Sulawesi Utara"
                        
                        -- Gorontalo
                        WHEN UPPER(COALESCE(Birth_Place, "")) LIKE "%GORONTALO%" 
                        THEN "Gorontalo"
                        
                        -- Papua
                        WHEN UPPER(COALESCE(Birth_Place, "")) LIKE "%PAPUA%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%JAYAPURA%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%MERAUKE%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SORONG%" 
                        THEN "Papua"
                        
                        -- Maluku
                        WHEN UPPER(COALESCE(Birth_Place, "")) LIKE "%MALUKU%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%AMBON%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%TERNATE%" 
                        THEN "Maluku"
                        
                        -- Handle NULL/Empty
                        WHEN Birth_Place IS NULL OR Birth_Place = "" OR TRIM(Birth_Place) = "" 
                        THEN "Tidak Diketahui"
                        
                        -- Semua yang tidak match
                        ELSE "Daerah Lainnya"
                    END as name
                '),
                DB::raw('COUNT(acd_student.Student_Id) as value')
            )
            ->groupBy(
                DB::raw('
                    CASE 
                        WHEN UPPER(COALESCE(Birth_Place, "")) LIKE "%KENDARI%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%BAUBAU%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%RAHA%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%KOLAKA%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%KONAWE%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULTRA%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULAWESI TENGGARA%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%WAKATOBI%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%BOMBANA%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%BUTON%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%MUNA%" 
                        THEN "Sulawesi Tenggara"
                        WHEN UPPER(COALESCE(Birth_Place, "")) LIKE "%MAKASSAR%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%GOWA%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%BONE%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%MAROS%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULSEL%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULAWESI SELATAN%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%PARE%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%PINRANG%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%MAJENE%" 
                        THEN "Sulawesi Selatan"
                        WHEN UPPER(COALESCE(Birth_Place, "")) LIKE "%PALU%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULTENG%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULAWESI TENGAH%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%DONGGALA%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%POSO%" 
                        THEN "Sulawesi Tengah"
                        WHEN UPPER(COALESCE(Birth_Place, "")) LIKE "%MAMUJU%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULBAR%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULAWESI BARAT%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%POLEWALI%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%MANDAR%" 
                        THEN "Sulawesi Barat"
                        WHEN UPPER(COALESCE(Birth_Place, "")) LIKE "%MANADO%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%BITUNG%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%TOMOHON%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULUT%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULAWESI UTARA%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%MINAHASA%" 
                        THEN "Sulawesi Utara"
                        WHEN UPPER(COALESCE(Birth_Place, "")) LIKE "%GORONTALO%" 
                        THEN "Gorontalo"
                        WHEN UPPER(COALESCE(Birth_Place, "")) LIKE "%PAPUA%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%JAYAPURA%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%MERAUKE%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SORONG%" 
                        THEN "Papua"
                        WHEN UPPER(COALESCE(Birth_Place, "")) LIKE "%MALUKU%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%AMBON%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%TERNATE%" 
                        THEN "Maluku"
                        WHEN Birth_Place IS NULL OR Birth_Place = "" OR TRIM(Birth_Place) = "" 
                        THEN "Tidak Diketahui"
                        ELSE "Daerah Lainnya"
                    END
                ')
            )
            ->orderBy('value', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->name,
                    'value' => $item->value
                ];
            });
    }

    
}