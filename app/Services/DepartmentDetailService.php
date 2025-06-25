<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class DepartmentDetailService
{


    /**
     * Enable/disable caching
     * @var bool
     */
    protected $useCache = true;
    
    /**
     * Cache duration in seconds (default: 1 hour)
     * @var int
     */
    protected $cacheDuration = 3600;


     /**
     * Mendapatkan informasi program studi
     */
    public function getDepartmentInfo($departmentId)
    {
        if (!$this->useCache) {
            return $this->executeDepartmentInfoQuery($departmentId);
        }

        return Cache::remember("department-info-{$departmentId}", $this->cacheDuration, function () use ($departmentId) {
            return $this->executeDepartmentInfoQuery($departmentId);
        });
    }

    /**
     * Execute department info query
     */
    private function executeDepartmentInfoQuery($departmentId)
    {
        return DB::table('mstr_department')
            ->join('mstr_faculty', 'mstr_department.Faculty_Id', '=', 'mstr_faculty.Faculty_Id')
            ->select(
                'mstr_department.*',
                'mstr_faculty.Faculty_Name',
                'mstr_faculty.Faculty_Acronym'
            )
            ->where('mstr_department.Department_Id', $departmentId)
            ->first();
    }

       /**
     * Mendapatkan data detail program studi
     */
    public function getDepartmentDetailData($departmentId, $termYearId = null, $studentStatus = 'all')
    {
        if (!$this->useCache) {
            return $this->executeDepartmentDetailQuery($departmentId, $termYearId, $studentStatus);
        }

        $cacheKey = "department-detail-{$departmentId}-{$termYearId}-{$studentStatus}";
        
        return Cache::remember($cacheKey, $this->cacheDuration, function () use ($departmentId, $termYearId, $studentStatus) {
            return $this->executeDepartmentDetailQuery($departmentId, $termYearId, $studentStatus);
        });
    }

     /**
     * Execute department detail query
     */
    private function executeDepartmentDetailQuery($departmentId, $termYearId, $studentStatus)
    {
        // Distribusi gender
        $genderDistribution = $this->getGenderDistribution($departmentId, $termYearId, $studentStatus);
        
        // Distribusi agama
        $religionDistribution = $this->getReligionDistribution($departmentId, $termYearId, $studentStatus);
        
        // Distribusi umur
        $ageDistribution = $this->getAgeDistribution($departmentId, $termYearId, $studentStatus);
        
        // Distribusi asal daerah
        $regionDistribution = $this->getRegionDistribution($departmentId, $termYearId, $studentStatus);
        
        // Tren mahasiswa per semester
        $studentTrend = $this->getStudentTrend($departmentId);
        
        // Summary stats
        $summaryStats = $this->getSummaryStats($departmentId, $termYearId, $studentStatus);
        
        // Distribusi per angkatan
        $yearDistribution = $this->getYearDistribution($departmentId, $termYearId, $studentStatus);
        
        // IPK Statistics
        $gpaStats = $this->getGpaStatistics($departmentId, $termYearId, $studentStatus);
        
        return [
            'genderDistribution' => $genderDistribution,
            'religionDistribution' => $religionDistribution,
            'ageDistribution' => $ageDistribution,
            'regionDistribution' => $regionDistribution,
            'studentTrend' => $studentTrend,
            'summaryStats' => $summaryStats,
            'yearDistribution' => $yearDistribution,
            'gpaStats' => $gpaStats
        ];
    }



  
    /**
     * Distribusi gender di program studi
     */
    private function getGenderDistribution($departmentId, $termYearId, $studentStatus)
    {
        $query = DB::table('acd_student')
            ->where('acd_student.Department_Id', $departmentId);
            
        // Apply same filters
        if ($studentStatus === 'active') {
            $currentTermId = ($termYearId === 'all' || $termYearId === null) 
                ? $this->getCurrentActiveTermId() 
                : $termYearId;
            
            $query->join('acd_student_krs', 'acd_student.Student_Id', '=', 'acd_student_krs.Student_Id')
                  ->where('acd_student_krs.Term_Year_Id', $currentTermId)
                  ->where('acd_student_krs.Is_Approved', '1');
        } elseif ($termYearId !== 'all' && $termYearId !== null) {
            $year = substr($termYearId, 0, 4);
            $query->where('acd_student.Entry_Year_Id', 'like', $year . '%');
        }
        
        return $query->select(
                DB::raw('SUM(CASE WHEN acd_student.Gender_Id = 1 THEN 1 ELSE 0 END) as laki'),
                DB::raw('SUM(CASE WHEN acd_student.Gender_Id = 2 THEN 1 ELSE 0 END) as perempuan'),
                DB::raw('COUNT(DISTINCT acd_student.Student_Id) as total')
            )
            ->first();
    }
    
    /**
     * Distribusi agama di program studi
     */
    private function getReligionDistribution($departmentId, $termYearId, $studentStatus)
    {
        $query = DB::table('acd_student')
            ->leftJoin('mstr_religion', 'acd_student.Religion_Id', '=', 'mstr_religion.Religion_Id')
            ->where('acd_student.Department_Id', $departmentId);
            
        // Apply same filters
        if ($studentStatus === 'active') {
            $currentTermId = ($termYearId === 'all' || $termYearId === null) 
                ? $this->getCurrentActiveTermId() 
                : $termYearId;
            
            $query->join('acd_student_krs', 'acd_student.Student_Id', '=', 'acd_student_krs.Student_Id')
                  ->where('acd_student_krs.Term_Year_Id', $currentTermId)
                  ->where('acd_student_krs.Is_Approved', '1');
        } elseif ($termYearId !== 'all' && $termYearId !== null) {
            $year = substr($termYearId, 0, 4);
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
    }
    
    /**
     * Distribusi umur di program studi
     */
    private function getAgeDistribution($departmentId, $termYearId, $studentStatus)
    {
        $query = DB::table('acd_student')
            ->where('acd_student.Department_Id', $departmentId)
            ->whereNotNull('acd_student.Birth_Date');
            
        // Apply same filters
        if ($studentStatus === 'active') {
            $currentTermId = ($termYearId === 'all' || $termYearId === null) 
                ? $this->getCurrentActiveTermId() 
                : $termYearId;
            
            $query->join('acd_student_krs', 'acd_student.Student_Id', '=', 'acd_student_krs.Student_Id')
                  ->where('acd_student_krs.Term_Year_Id', $currentTermId)
                  ->where('acd_student_krs.Is_Approved', '1');
        } elseif ($termYearId !== 'all' && $termYearId !== null) {
            $year = substr($termYearId, 0, 4);
            $query->where('acd_student.Entry_Year_Id', 'like', $year . '%');
        }
        
        return $query->select(
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
                DB::raw('COUNT(acd_student.Student_Id) as value')
            )
            ->groupBy('age_range')
            ->orderBy('age_range')
            ->get()
            ->map(function ($item) {
                return [
                    'age' => $item->age_range,
                    'value' => $item->value
                ];
            });
    }
    
    /**
     * Distribusi asal daerah di program studi
     */
    private function getRegionDistribution($departmentId, $termYearId, $studentStatus)
    {
        $query = DB::table('acd_student')
            ->where('acd_student.Department_Id', $departmentId);
            
        // Apply same filters
        if ($studentStatus === 'active') {
            $currentTermId = ($termYearId === 'all' || $termYearId === null) 
                ? $this->getCurrentActiveTermId() 
                : $termYearId;
            
            $query->join('acd_student_krs', 'acd_student.Student_Id', '=', 'acd_student_krs.Student_Id')
                  ->where('acd_student_krs.Term_Year_Id', $currentTermId)
                  ->where('acd_student_krs.Is_Approved', '1');
        } elseif ($termYearId !== 'all' && $termYearId !== null) {
            $year = substr($termYearId, 0, 4);
            $query->where('acd_student.Entry_Year_Id', 'like', $year . '%');
        }
        
        return $query->select(
                DB::raw('
                    CASE 
                        WHEN UPPER(COALESCE(Birth_Place, "")) LIKE "%KENDARI%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%BAUBAU%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULTRA%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULAWESI TENGGARA%" 
                        THEN "Sulawesi Tenggara"
                        WHEN UPPER(COALESCE(Birth_Place, "")) LIKE "%MAKASSAR%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULSEL%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULAWESI SELATAN%" 
                        THEN "Sulawesi Selatan"
                        WHEN UPPER(COALESCE(Birth_Place, "")) LIKE "%PALU%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULTENG%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULAWESI TENGAH%" 
                        THEN "Sulawesi Tengah"
                        WHEN Birth_Place IS NULL OR Birth_Place = "" OR TRIM(Birth_Place) = "" 
                        THEN "Tidak Diketahui"
                        ELSE "Daerah Lainnya"
                    END as name
                '),
                DB::raw('COUNT(acd_student.Student_Id) as value')
            )
            ->groupBy('name')
            ->orderBy('value', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->name,
                    'value' => $item->value
                ];
            });
    }
    
    /**
     * Tren mahasiswa per semester untuk program studi
     */
    private function getStudentTrend($departmentId)
    {
        return DB::table('acd_student_krs')
            ->join('acd_student', 'acd_student_krs.Student_Id', '=', 'acd_student.Student_Id')
            ->join('mstr_term_year', 'acd_student_krs.Term_Year_Id', '=', 'mstr_term_year.Term_Year_Id')
            ->where('acd_student.Department_Id', $departmentId)
            ->where('acd_student_krs.Is_Approved', '1')
            ->select(
                'mstr_term_year.Term_Year_Id',
                'mstr_term_year.Term_Year_Name',
                DB::raw('COUNT(DISTINCT acd_student_krs.Student_Id) as student_count')
            )
            ->groupBy('mstr_term_year.Term_Year_Id', 'mstr_term_year.Term_Year_Name')
            ->orderBy('mstr_term_year.Term_Year_Id', 'desc')
            ->take(10)
            ->get();
    }
    
    /**
     * Summary statistics program studi
     */
    private function getSummaryStats($departmentId, $termYearId, $studentStatus)
    {
        $query = DB::table('acd_student')
            ->where('acd_student.Department_Id', $departmentId);
            
        // Apply same filters
        if ($studentStatus === 'active') {
            $currentTermId = ($termYearId === 'all' || $termYearId === null) 
                ? $this->getCurrentActiveTermId() 
                : $termYearId;
            
            $query->join('acd_student_krs', 'acd_student.Student_Id', '=', 'acd_student_krs.Student_Id')
                  ->where('acd_student_krs.Term_Year_Id', $currentTermId)
                  ->where('acd_student_krs.Is_Approved', '1');
        } elseif ($termYearId !== 'all' && $termYearId !== null) {
            $year = substr($termYearId, 0, 4);
            $query->where('acd_student.Entry_Year_Id', 'like', $year . '%');
        }
        
        $total = $query->count('acd_student.Student_Id');
        
        return [
            'total_students' => $total
        ];
    }
    
    /**
     * Distribusi mahasiswa per angkatan
     */
    private function getYearDistribution($departmentId, $termYearId, $studentStatus)
    {
        $query = DB::table('acd_student')
            ->where('acd_student.Department_Id', $departmentId);
            
        // Apply same filters
        if ($studentStatus === 'active') {
            $currentTermId = ($termYearId === 'all' || $termYearId === null) 
                ? $this->getCurrentActiveTermId() 
                : $termYearId;
            
            $query->join('acd_student_krs', 'acd_student.Student_Id', '=', 'acd_student_krs.Student_Id')
                  ->where('acd_student_krs.Term_Year_Id', $currentTermId)
                  ->where('acd_student_krs.Is_Approved', '1');
        } elseif ($termYearId !== 'all' && $termYearId !== null) {
            $year = substr($termYearId, 0, 4);
            $query->where('acd_student.Entry_Year_Id', 'like', $year . '%');
        }
        
        return $query->select(
                DB::raw('LEFT(Entry_Year_Id, 4) as year'),
                DB::raw('COUNT(acd_student.Student_Id) as student_count')
            )
            ->whereNotNull('acd_student.Entry_Year_Id')
            ->groupBy(DB::raw('LEFT(Entry_Year_Id, 4)'))
            ->orderBy('year', 'desc')
            ->take(10)
            ->get();
    }
    
    /**
     * Statistik IPK program studi
     */
    private function getGpaStatistics($departmentId, $termYearId, $studentStatus)
    {
        // For now, return dummy data as GPA calculation is complex
        return [
            'average_gpa' => 3.45,
            'highest_gpa' => 3.98,
            'lowest_gpa' => 2.45,
            'students_above_3' => 85 // percentage
        ];
    }

      /**
     * Mendapatkan daftar mahasiswa dengan pagination
     */
    public function getDepartmentStudents(
        $departmentId, 
        $termYearId, 
        $studentStatus, 
        $search, 
        $page, 
        $perPage, 
        $genderFilter,  
        $religionFilter = null,
        $ageFilter = null    
    )
    {
        if (!$this->useCache || !empty($search)) {
            return $this->executeDepartmentStudentsQuery($departmentId, $termYearId, $studentStatus, $search, $page, $perPage, $genderFilter, $religionFilter);
        // Age filter - NEW
            if ($ageFilter) {
                $query->whereNotNull('acd_student.Birth_Date');
                
                switch ($ageFilter) {
                    case '17-19':
                        $query->whereRaw('TIMESTAMPDIFF(YEAR, acd_student.Birth_Date, CURDATE()) BETWEEN 17 AND 19');
                        break;
                    case '20-22':
                        $query->whereRaw('TIMESTAMPDIFF(YEAR, acd_student.Birth_Date, CURDATE()) BETWEEN 20 AND 22');
                        break;
                    case '23-25':
                        $query->whereRaw('TIMESTAMPDIFF(YEAR, acd_student.Birth_Date, CURDATE()) BETWEEN 23 AND 25');
                        break;
                    case '26-30':
                        $query->whereRaw('TIMESTAMPDIFF(YEAR, acd_student.Birth_Date, CURDATE()) BETWEEN 26 AND 30');
                        break;
                    case '> 30':
                        $query->whereRaw('TIMESTAMPDIFF(YEAR, acd_student.Birth_Date, CURDATE()) > 30');
                        break;
                }
            }
        }
        $cacheKey = "department-students-{$departmentId}-{$termYearId}-{$studentStatus}-{$page}-{$perPage}-{$genderFilter}-{$religionFilter}-{$ageFilter}";
        
        return Cache::remember($cacheKey, $this->cacheDuration, function () use ($departmentId, $termYearId, $studentStatus, $search, $page, $perPage, $genderFilter, $religionFilter, $ageFilter) {
            return $this->executeDepartmentStudentsQuery($departmentId, $termYearId, $studentStatus, $search, $page, $perPage, $genderFilter, $religionFilter, $ageFilter);
        });
    }
    
    /**
     * Execute department students query
     */
    private function executeDepartmentStudentsQuery($departmentId, $termYearId, $studentStatus, $search, $page, $perPage, $genderFilter = null, $religionFilter = null)
    {
        $query = DB::table('acd_student')
            ->leftJoin('mstr_religion', 'acd_student.Religion_Id', '=', 'mstr_religion.Religion_Id')
            ->where('acd_student.Department_Id', $departmentId);
            
        if ($studentStatus === 'active') {
            $currentTermId = ($termYearId === 'all' || $termYearId === null) 
                ? $this->getCurrentActiveTermId() 
                : $termYearId;
            
            $query->join('acd_student_krs', 'acd_student.Student_Id', '=', 'acd_student_krs.Student_Id')
                ->where('acd_student_krs.Term_Year_Id', $currentTermId)
                ->where('acd_student_krs.Is_Approved', '1');
        } elseif ($termYearId !== 'all' && $termYearId !== null) {
            $year = substr($termYearId, 0, 4);
            $query->where('acd_student.Entry_Year_Id', 'like', $year . '%');
        }
        
        // Search filter
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('acd_student.Full_Name', 'like', "%{$search}%")
                ->orWhere('acd_student.Student_Id', 'like', "%{$search}%");
            });
        }
        
        // Gender filter
        if ($genderFilter) {
            $genderId = null;
            if ($genderFilter === 'laki') {
                $genderId = 1;
            } elseif ($genderFilter === 'perempuan') {
                $genderId = 2;
            }
            
            if ($genderId) {
                $query->where('acd_student.Gender_Id', $genderId);
            }
        }
        
        // Religion filter - NEW
        if ($religionFilter) {
            if ($religionFilter === 'Lainnya') {
                $query->whereNull('mstr_religion.Religion_Name');
            } else {
                $query->where('mstr_religion.Religion_Name', $religionFilter);
            }
        }
        
        $total = $query->count();
        
        $students = $query->select(
                'acd_student.Student_Id',
                'acd_student.Full_Name',
                'acd_student.Entry_Year_Id',
                'acd_student.Register_Status_Id',
                'acd_student.Gender_Id',
                'acd_student.Nim',
                'mstr_religion.Religion_Name', // Add religion name to select
                DB::raw('CASE 
                    WHEN acd_student.Register_Status_Id = "A" THEN "Aktif"
                    WHEN acd_student.Register_Status_Id = "C" THEN "Cuti"
                    WHEN acd_student.Register_Status_Id = "L" THEN "Lulus"
                    WHEN acd_student.Register_Status_Id = "K" THEN "Keluar"
                    ELSE "Lainnya"
                END as Status_Name'),
                DB::raw('CASE 
                    WHEN acd_student.Gender_Id = 1 THEN "Laki-laki"
                    WHEN acd_student.Gender_Id = 2 THEN "Perempuan"
                    ELSE "Tidak Diketahui"
                END as Gender_Name'),
                DB::raw('CASE 
                    WHEN mstr_religion.Religion_Name IS NULL THEN "Lainnya" 
                    ELSE mstr_religion.Religion_Name 
                END as Religion_Display_Name') // Add religion display name
            )
            ->offset(($page - 1) * $perPage)
            ->limit($perPage)
            ->orderBy('acd_student.Full_Name')
            ->get();
            
        return [
            'data' => $students,
            'total' => $total,
            'per_page' => $perPage,
            'current_page' => $page,
            'last_page' => ceil($total / $perPage)
        ];
    }
    /**
     * Get current active term ID
     */
    private function getCurrentActiveTermId()
    {
        $currentTerm = DB::table('mstr_term_year')
            ->where('Start_Date', '<=', now())
            ->where('End_Date', '>=', now())
            ->first();
        
        if (!$currentTerm) {
            $currentTerm = DB::table('mstr_term_year')
                ->orderBy('Term_Year_Id', 'desc')
                ->first();
        }
        
        return $currentTerm ? $currentTerm->Term_Year_Id : '20242';
    }

     /**
     * Set cache usage
     */
    public function setCacheEnabled($enabled = true)
    {
        $this->useCache = $enabled;
        return $this;
    }
}