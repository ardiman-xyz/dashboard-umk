<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class FacultyDetailService
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
     * Set cache usage
     */
    public function setCacheEnabled($enabled = true)
    {
        $this->useCache = $enabled;
        return $this;
    }

    /**
     * Mendapatkan informasi fakultas
     */
    public function getFacultyInfo($facultyId)
    {
        if (!$this->useCache) {
            return $this->executeFacultyInfoQuery($facultyId);
        }

        return Cache::remember("faculty-info-{$facultyId}", $this->cacheDuration, function () use ($facultyId) {
            return $this->executeFacultyInfoQuery($facultyId);
        });
    }

    private function executeFacultyInfoQuery($facultyId)
    {
        return DB::table('mstr_faculty')
            ->where('Faculty_Id', $facultyId)
            ->first();
    }
    
    /**
     * Mendapatkan data detail fakultas
     */
    public function getFacultyDetailData($facultyId, $termYearId = null, $studentStatus = 'all')
    {
        if (!$this->useCache) {
            return $this->executeFacultyDetailQuery($facultyId, $termYearId, $studentStatus);
        }

        $cacheKey = "faculty-detail-{$facultyId}-{$termYearId}-{$studentStatus}";
        
        return Cache::remember($cacheKey, $this->cacheDuration, function () use ($facultyId, $termYearId, $studentStatus) {
            return $this->executeFacultyDetailQuery($facultyId, $termYearId, $studentStatus);
        });
    }

    private function executeFacultyDetailQuery($facultyId, $termYearId, $studentStatus)
    {
        // Statistik mahasiswa per program studi
        $departmentStats = $this->getDepartmentStatistics($facultyId, $termYearId, $studentStatus);
        
        // Distribusi gender
        $genderDistribution = $this->getGenderDistribution($facultyId, $termYearId, $studentStatus);
        
        // Distribusi agama
        $religionDistribution = $this->getReligionDistribution($facultyId, $termYearId, $studentStatus);
        
        // Distribusi umur
        $ageDistribution = $this->getAgeDistribution($facultyId, $termYearId, $studentStatus);
        
        // Distribusi asal daerah
        $regionDistribution = $this->getRegionDistribution($facultyId, $termYearId, $studentStatus);
        
        // Tren mahasiswa per semester
        $studentTrend = $this->getStudentTrend($facultyId);
        
        // Summary stats
        $summaryStats = $this->getSummaryStats($facultyId, $termYearId, $studentStatus);
        
        return [
            'departmentStats' => $departmentStats,
            'genderDistribution' => $genderDistribution,
            'religionDistribution' => $religionDistribution,
            'ageDistribution' => $ageDistribution,
            'regionDistribution' => $regionDistribution,
            'studentTrend' => $studentTrend,
            'summaryStats' => $summaryStats
        ];
    }
    
    /**
     * Statistik mahasiswa per program studi dalam fakultas
     */
    private function getDepartmentStatistics($facultyId, $termYearId, $studentStatus)
    {
        $query = DB::table('acd_student')
            ->join('mstr_department', 'acd_student.Department_Id', '=', 'mstr_department.Department_Id')
            ->where('mstr_department.Faculty_Id', $facultyId);
            
        // Apply filters
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
                'mstr_department.Department_Id',
                'mstr_department.Department_Name',
                'mstr_department.Department_Acronym',
                DB::raw('COUNT(DISTINCT acd_student.Student_Id) as student_count')
            )
            ->groupBy('mstr_department.Department_Id', 'mstr_department.Department_Name', 'mstr_department.Department_Acronym')
            ->orderBy('student_count', 'desc')
            ->get();
    }
    
    /**
     * Distribusi gender di fakultas
     */
    private function getGenderDistribution($facultyId, $termYearId, $studentStatus)
    {
        $query = DB::table('acd_student')
            ->join('mstr_department', 'acd_student.Department_Id', '=', 'mstr_department.Department_Id')
            ->where('mstr_department.Faculty_Id', $facultyId);
            
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
     * Distribusi agama di fakultas
     */
    private function getReligionDistribution($facultyId, $termYearId, $studentStatus)
    {
        $query = DB::table('acd_student')
            ->join('mstr_department', 'acd_student.Department_Id', '=', 'mstr_department.Department_Id')
            ->leftJoin('mstr_religion', 'acd_student.Religion_Id', '=', 'mstr_religion.Religion_Id')
            ->where('mstr_department.Faculty_Id', $facultyId);
            
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
     * Distribusi umur di fakultas
     */
    private function getAgeDistribution($facultyId, $termYearId, $studentStatus)
    {
        $query = DB::table('acd_student')
            ->join('mstr_department', 'acd_student.Department_Id', '=', 'mstr_department.Department_Id')
            ->where('mstr_department.Faculty_Id', $facultyId)
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
     * Distribusi asal daerah di fakultas
     */
    private function getRegionDistribution($facultyId, $termYearId, $studentStatus)
    {
        $query = DB::table('acd_student')
            ->join('mstr_department', 'acd_student.Department_Id', '=', 'mstr_department.Department_Id')
            ->where('mstr_department.Faculty_Id', $facultyId);
            
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
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULTRA%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULAWESI TENGGARA%" 
                        THEN "Sulawesi Tenggara"
                        WHEN UPPER(COALESCE(Birth_Place, "")) LIKE "%MAKASSAR%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULSEL%" 
                          OR UPPER(COALESCE(Birth_Place, "")) LIKE "%SULAWESI SELATAN%" 
                        THEN "Sulawesi Selatan"
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
     * Tren mahasiswa per semester
     */
    private function getStudentTrend($facultyId)
    {
        return DB::table('acd_student_krs')
            ->join('acd_student', 'acd_student_krs.Student_Id', '=', 'acd_student.Student_Id')
            ->join('mstr_department', 'acd_student.Department_Id', '=', 'mstr_department.Department_Id')
            ->join('mstr_term_year', 'acd_student_krs.Term_Year_Id', '=', 'mstr_term_year.Term_Year_Id')
            ->where('mstr_department.Faculty_Id', $facultyId)
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
     * Summary statistics
     */
    private function getSummaryStats($facultyId, $termYearId, $studentStatus)
    {
        $query = DB::table('acd_student')
            ->join('mstr_department', 'acd_student.Department_Id', '=', 'mstr_department.Department_Id')
            ->where('mstr_department.Faculty_Id', $facultyId);
            
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
        
        // Program studi count
        $departmentCount = DB::table('mstr_department')
            ->where('Faculty_Id', $facultyId)
            ->count();
            
        return [
            'total_students' => $total,
            'total_departments' => $departmentCount
        ];
    }
    
    /**
     * Mendapatkan daftar mahasiswa fakultas dengan pagination dan filter
     */
    public function getFacultyStudents($facultyId, $termYearId, $studentStatus, $search, $page, $perPage, $genderFilter = null, $religionFilter = null, $ageFilter = null)
    {
        // Don't use cache for student list with filters or search
        if (!empty($search) || $genderFilter || $religionFilter || $ageFilter) {
            return $this->executeFacultyStudentsQuery($facultyId, $termYearId, $studentStatus, $search, $page, $perPage, $genderFilter, $religionFilter, $ageFilter);
        }

        if (!$this->useCache) {
            return $this->executeFacultyStudentsQuery($facultyId, $termYearId, $studentStatus, $search, $page, $perPage, $genderFilter, $religionFilter, $ageFilter);
        }

        $cacheKey = "faculty-students-{$facultyId}-{$termYearId}-{$studentStatus}-{$page}-{$perPage}";
        
        return Cache::remember($cacheKey, $this->cacheDuration, function () use ($facultyId, $termYearId, $studentStatus, $search, $page, $perPage, $genderFilter, $religionFilter, $ageFilter) {
            return $this->executeFacultyStudentsQuery($facultyId, $termYearId, $studentStatus, $search, $page, $perPage, $genderFilter, $religionFilter, $ageFilter);
        });
    }

    private function executeFacultyStudentsQuery($facultyId, $termYearId, $studentStatus, $search, $page, $perPage, $genderFilter = null, $religionFilter = null, $ageFilter = null)
    {
        $query = DB::table('acd_student')
            ->join('mstr_department', 'acd_student.Department_Id', '=', 'mstr_department.Department_Id')
            ->leftJoin('mstr_religion', 'acd_student.Religion_Id', '=', 'mstr_religion.Religion_Id')
            ->where('mstr_department.Faculty_Id', $facultyId);
            
        // Apply base filters
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
                  ->orWhere('acd_student.Student_Id', 'like', "%{$search}%")
                  ->orWhere('acd_student.Nim', 'like', "%{$search}%");
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

        // Religion filter
        if ($religionFilter) {
            if ($religionFilter === 'Lainnya') {
                $query->whereNull('mstr_religion.Religion_Name');
            } else {
                $query->where('mstr_religion.Religion_Name', $religionFilter);
            }
        }

        // Age filter
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
        
        $total = $query->count();
        
        $students = $query->select(
                'acd_student.Student_Id',
                'acd_student.Full_Name',
                'acd_student.Entry_Year_Id',
                'acd_student.Register_Status_Id',
                'acd_student.Gender_Id',
                'acd_student.Nim',
                'acd_student.Birth_Date',
                'mstr_religion.Religion_Name',
                'mstr_department.Department_Name',
                'mstr_department.Department_Acronym',
                'mstr_department.Department_Id',
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
                END as Religion_Display_Name'),
                DB::raw('CASE
                    WHEN acd_student.Birth_Date IS NOT NULL THEN
                        TIMESTAMPDIFF(YEAR, acd_student.Birth_Date, CURDATE())
                    ELSE NULL
                END as Age'),
                DB::raw('CASE
                    WHEN acd_student.Birth_Date IS NOT NULL THEN
                        CASE
                            WHEN TIMESTAMPDIFF(YEAR, acd_student.Birth_Date, CURDATE()) BETWEEN 17 AND 19 THEN "17-19"
                            WHEN TIMESTAMPDIFF(YEAR, acd_student.Birth_Date, CURDATE()) BETWEEN 20 AND 22 THEN "20-22"
                            WHEN TIMESTAMPDIFF(YEAR, acd_student.Birth_Date, CURDATE()) BETWEEN 23 AND 25 THEN "23-25"
                            WHEN TIMESTAMPDIFF(YEAR, acd_student.Birth_Date, CURDATE()) BETWEEN 26 AND 30 THEN "26-30"
                            WHEN TIMESTAMPDIFF(YEAR, acd_student.Birth_Date, CURDATE()) > 30 THEN "> 30"
                            ELSE "Tidak Diketahui"
                        END
                    ELSE "Tidak Diketahui"
                END as Age_Range')
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
}