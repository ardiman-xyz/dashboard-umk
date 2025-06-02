<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class AcademicTermRelationService
{
    /**
     * Mendapatkan data akademik berdasarkan relasi tahun akademik dan semester
     * 
     * @param string|null $academicYear Tahun akademik (contoh: 2024)
     * @param string|null $semester Semester (1=Ganjil, 2=Genap, 3=Pendek)
     * @param string $studentStatus Status mahasiswa ('all' atau 'active')
     * @return array Data akademik per tahun dan semester
     */
    public function getAcademicDataByTermRelation($academicYear = null, $semester = null, $studentStatus = 'all')
    {
        // $cacheKey = 'academic-term-relation-' . ($academicYear ?? 'all') . '-' . ($semester ?? 'all') . '-' . $studentStatus;
        
        // return Cache::remember($cacheKey, 3600, function () use ($academicYear, $semester, $studentStatus) {
            // Buat Term Year ID dari tahun akademik dan semester
            $termYearId = null;
            if ($academicYear && $semester) {
                $termYearId = $academicYear . $semester;
            }
            
            // Data mahasiswa berdasarkan relasi tahun akademik dan semester
            $studentData = $this->getStudentsByAcademicTermRelation($academicYear, $semester, $studentStatus);
            
            // Data dosen berdasarkan tahun akademik
            $lecturerData = $this->getLecturersByAcademicYear($academicYear);
            
            // Data IPK berdasarkan semester
            $gpaData = $this->getGpaByAcademicTermRelation($academicYear, $semester);
            
            // Data distribusi fakultas
            $facultyData = $this->getFacultyDistributionByTermRelation($academicYear, $semester, $studentStatus);
            
            return [
                'academic_year' => $academicYear,
                'semester' => $semester,
                'term_year_id' => $termYearId,
                'student_statistics' => $studentData,
                'lecturer_statistics' => $lecturerData,
                'gpa_statistics' => $gpaData,
                'faculty_distribution' => $facultyData,
                'period_info' => $this->getAcademicPeriodInfo($academicYear, $semester)
            ];
        // });
    }
    
    /**
     * Mendapatkan data mahasiswa berdasarkan relasi tahun akademik dan semester
     */
    private function getStudentsByAcademicTermRelation($academicYear, $semester, $studentStatus)
    {
        $query = DB::table('acd_student as s');
        
        // Join dengan KRS jika perlu filter berdasarkan semester aktif
        if ($academicYear && $semester && $studentStatus === 'active') {
            $termYearId = $academicYear . $semester;
            $query->join('acd_student_krs as krs', 's.Student_Id', '=', 'krs.Student_Id')
                  ->where('krs.Term_Year_Id', $termYearId)
                  ->where('krs.Is_Approved', '1');
        }
        
        // Filter berdasarkan tahun masuk jika ada tahun akademik
        if ($academicYear && $studentStatus !== 'active') {
            $query->where('s.Entry_Year_Id', 'like', $academicYear . '%');
        }
        
        // Filter status mahasiswa
        if ($studentStatus === 'all') {
            // Semua mahasiswa
        } else {
            $query->where('s.Register_Status_Id', 'A'); // Aktif
        }
        
        // Hitung total dengan distinct untuk menghindari duplikasi
        $totalStudents = $query->distinct('s.Student_Id')->count('s.Student_Id');
        
        // Distribusi berdasarkan status akademik
        $statusDistribution = $this->getStudentStatusDistribution($academicYear, $semester, $studentStatus);
        
        // Distribusi berdasarkan jenis kelamin
        $genderDistribution = $this->getGenderDistributionByTerm($academicYear, $semester, $studentStatus);
        
        return [
            'total_students' => $totalStudents,
            'status_distribution' => $statusDistribution,
            'gender_distribution' => $genderDistribution,
            'growth_comparison' => $this->getStudentGrowthComparison($academicYear, $semester)
        ];
    }
    
    /**
     * Mendapatkan distribusi status mahasiswa
     */
    private function getStudentStatusDistribution($academicYear, $semester, $studentStatus)
    {
        $query = DB::table('acd_student as s')
            ->select(
                's.Register_Status_Id',
                DB::raw('COUNT(DISTINCT s.Student_Id) as count')
            );
            
        // Apply same filters as main query
        if ($academicYear && $semester && $studentStatus === 'active') {
            $termYearId = $academicYear . $semester;
            $query->join('acd_student_krs as krs', 's.Student_Id', '=', 'krs.Student_Id')
                  ->where('krs.Term_Year_Id', $termYearId)
                  ->where('krs.Is_Approved', '1');
        } elseif ($academicYear && $studentStatus !== 'active') {
            $query->where('s.Entry_Year_Id', 'like', $academicYear . '%');
        }
        
        $results = $query->groupBy('s.Register_Status_Id')->get();
        
        // Map status codes to readable names
        $statusMap = [
            'A' => 'Aktif',
            'C' => 'Cuti',
            'L' => 'Lulus',
            'K' => 'Keluar',
            'P' => 'Probation'
        ];
        
        $distribution = [];
        foreach ($results as $result) {
            $statusName = $statusMap[$result->Register_Status_Id] ?? 'Lainnya';
            $distribution[] = [
                'status' => $statusName,
                'count' => $result->count,
                'status_code' => $result->Register_Status_Id
            ];
        }
        
        return $distribution;
    }
    
    /**
     * Mendapatkan distribusi jenis kelamin berdasarkan term
     */
    private function getGenderDistributionByTerm($academicYear, $semester, $studentStatus)
    {
        $query = DB::table('acd_student as s')
            ->select(
                's.Gender_Id',
                DB::raw('COUNT(DISTINCT s.Student_Id) as count')
            );
            
        // Apply same filters
        if ($academicYear && $semester && $studentStatus === 'active') {
            $termYearId = $academicYear . $semester;
            $query->join('acd_student_krs as krs', 's.Student_Id', '=', 'krs.Student_Id')
                  ->where('krs.Term_Year_Id', $termYearId)
                  ->where('krs.Is_Approved', '1');
        } elseif ($academicYear && $studentStatus !== 'active') {
            $query->where('s.Entry_Year_Id', 'like', $academicYear . '%');
        }
        
        $results = $query->groupBy('s.Gender_Id')->get();
        
        $genderMap = [
            1 => 'Laki-laki',
            2 => 'Perempuan'
        ];
        
        $distribution = [];
        foreach ($results as $result) {
            $genderName = $genderMap[$result->Gender_Id] ?? 'Tidak Diketahui';
            $distribution[] = [
                'gender' => $genderName,
                'count' => $result->count,
                'gender_id' => $result->Gender_Id
            ];
        }
        
        return $distribution;
    }
    
    /**
     * Mendapatkan perbandingan pertumbuhan mahasiswa
     */
    private function getStudentGrowthComparison($academicYear, $semester)
    {
        if (!$academicYear || !$semester) {
            return null;
        }
        
        // Hitung mahasiswa semester saat ini
        $currentTermId = $academicYear . $semester;
        $currentCount = DB::table('acd_student_krs')
            ->where('Term_Year_Id', $currentTermId)
            ->where('Is_Approved', '1')
            ->distinct('Student_Id')
            ->count('Student_Id');
        
        // Hitung mahasiswa semester sebelumnya
        $previousTermId = $this->getPreviousTermId($currentTermId);
        $previousCount = 0;
        
        if ($previousTermId) {
            $previousCount = DB::table('acd_student_krs')
                ->where('Term_Year_Id', $previousTermId)
                ->where('Is_Approved', '1')
                ->distinct('Student_Id')
                ->count('Student_Id');
        }
        
        // Hitung persentase perubahan
        $percentageChange = 0;
        if ($previousCount > 0) {
            $percentageChange = (($currentCount - $previousCount) / $previousCount) * 100;
        }
        
        return [
            'current_count' => $currentCount,
            'previous_count' => $previousCount,
            'percentage_change' => round($percentageChange, 1),
            'trend' => $percentageChange >= 0 ? 'up' : 'down',
            'previous_term' => $this->formatTermName($previousTermId)
        ];
    }
    
    /**
     * Mendapatkan data dosen berdasarkan tahun akademik
     */
    private function getLecturersByAcademicYear($academicYear)
    {
        // Dosen biasanya tidak berubah per semester, lebih kepada per tahun akademik
        $query = DB::table('emp_employee as e')
            ->join('_user as u', 'e.Email_Corporate', '=', 'u.email')
            ->join('_role_user as ru', 'u.id', '=', 'ru.user_id')
            ->join('_role as r', 'ru.role_id', '=', 'r.id')
            ->where('r.name', 'like', '%Dosen%');
            
        // Filter berdasarkan tahun akademik jika diperlukan
        if ($academicYear) {
            // Bisa ditambahkan filter berdasarkan tahun aktif dosen
            // $query->where('e.Start_Date', '<=', $academicYear . '-12-31')
            //       ->where(function($q) use ($academicYear) {
            //           $q->whereNull('e.End_Date')
            //             ->orWhere('e.End_Date', '>=', $academicYear . '-01-01');
            //       });
        }
        
        $totalLecturers = $query->distinct('e.Employee_Id')->count('e.Employee_Id');
        
        return [
            'total_lecturers' => $totalLecturers,
            'academic_year' => $academicYear
        ];
    }
    
    /**
     * Mendapatkan data IPK berdasarkan relasi tahun akademik dan semester
     */
    private function getGpaByAcademicTermRelation($academicYear, $semester)
    {
        if (!$academicYear || !$semester) {
            return null;
        }
        
        $termYearId = $academicYear . $semester;
        
        // Hitung IPK rata-rata untuk semester ini
        $gpaData = DB::table('acd_student_krs as krs')
            ->join('acd_student_khs as khs', 'krs.Krs_Id', '=', 'khs.Krs_Id')
            ->where('krs.Term_Year_Id', $termYearId)
            ->where('khs.Is_For_Transkrip', '1')
            ->where('krs.Is_Approved', '1')
            ->select('khs.Weight_Value', 'krs.Sks')
            ->get();
        
        $totalWeightedGpa = 0;
        $totalSks = 0;
        
        foreach ($gpaData as $item) {
            $totalWeightedGpa += ($item->Weight_Value * $item->Sks);
            $totalSks += $item->Sks;
        }
        
        $averageGpa = $totalSks > 0 ? $totalWeightedGpa / $totalSks : 0;
        
        return [
            'average_gpa' => round($averageGpa, 2),
            'total_credits' => $totalSks,
            'academic_year' => $academicYear,
            'semester' => $semester,
            'term_year_id' => $termYearId
        ];
    }
    
    /**
     * Mendapatkan distribusi fakultas berdasarkan relasi term
     */
    private function getFacultyDistributionByTermRelation($academicYear, $semester, $studentStatus)
    {
        $query = DB::table('acd_student as s')
            ->join('mstr_department as d', 's.Department_Id', '=', 'd.Department_Id')
            ->join('mstr_faculty as f', 'd.Faculty_Id', '=', 'f.Faculty_Id');
            
        // Apply filters
        if ($academicYear && $semester && $studentStatus === 'active') {
            $termYearId = $academicYear . $semester;
            $query->join('acd_student_krs as krs', 's.Student_Id', '=', 'krs.Student_Id')
                  ->where('krs.Term_Year_Id', $termYearId)
                  ->where('krs.Is_Approved', '1');
        } elseif ($academicYear && $studentStatus !== 'active') {
            $query->where('s.Entry_Year_Id', 'like', $academicYear . '%');
        }
        
        if ($studentStatus !== 'all') {
            $query->where('s.Register_Status_Id', 'A');
        }
        
        $results = $query->select(
                'f.Faculty_Id',
                'f.Faculty_Name',
                'f.Faculty_Acronym',
                DB::raw('COUNT(DISTINCT s.Student_Id) as student_count')
            )
            ->groupBy('f.Faculty_Id', 'f.Faculty_Name', 'f.Faculty_Acronym')
            ->orderBy('student_count', 'desc')
            ->get();
            
        return $results->map(function($item) {
            return [
                'faculty_id' => $item->Faculty_Id,
                'faculty_name' => $item->Faculty_Name,
                'faculty_acronym' => $item->Faculty_Acronym,
                'student_count' => $item->student_count
            ];
        })->toArray();
    }
    
    /**
     * Mendapatkan informasi periode akademik
     */
    private function getAcademicPeriodInfo($academicYear, $semester)
    {
        if (!$academicYear || !$semester) {
            return null;
        }
        
        $termYearId = $academicYear . $semester;
        
        // Coba dapatkan dari database
        $termInfo = DB::table('mstr_term_year')
            ->where('Term_Year_Id', $termYearId)
            ->first();
            
        if ($termInfo) {
            return [
                'term_year_id' => $termInfo->Term_Year_Id,
                'term_name' => $termInfo->Term_Year_Name,
                'start_date' => $termInfo->Start_Date ?? null,
                'end_date' => $termInfo->End_Date ?? null,
                'is_active' => $this->isTermActive($termInfo)
            ];
        }
        
        // Jika tidak ada di database, buat informasi dasar
        return [
            'term_year_id' => $termYearId,
            'term_name' => $this->formatTermName($termYearId),
            'academic_year' => $academicYear,
            'semester' => $semester,
            'start_date' => null,
            'end_date' => null,
            'is_active' => false
        ];
    }
    
    /**
     * Mendapatkan daftar tahun akademik yang tersedia
     */
    public function getAvailableAcademicYears()
    {
        return Cache::remember('available-academic-years', 3600, function () {
            // Dari term_year
            $termsYears = DB::table('mstr_term_year')
                ->select(DB::raw('DISTINCT SUBSTRING(Term_Year_Id, 1, 4) as academic_year'))
                ->orderBy('academic_year', 'desc')
                ->pluck('academic_year')
                ->toArray();
            
            // Dari entry year mahasiswa
            $studentYears = DB::table('acd_student')
                ->select(DB::raw('DISTINCT LEFT(Entry_Year_Id, 4) as academic_year'))
                ->whereNotNull('Entry_Year_Id')
                ->orderBy('academic_year', 'desc')
                ->pluck('academic_year')
                ->toArray();
            
            // Gabungkan dan remove duplikasi
            $allYears = array_unique(array_merge($termsYears, $studentYears));
            rsort($allYears); // Sort descending
            
            return array_values($allYears);
        });
    }
    
    /**
     * Mendapatkan daftar semester yang tersedia untuk tahun akademik tertentu
     */
    public function getAvailableSemesters($academicYear = null)
    {
        if (!$academicYear) {
            return [
                ['id' => '1', 'name' => 'Semester Ganjil'],
                ['id' => '2', 'name' => 'Semester Genap'],
                ['id' => '3', 'name' => 'Semester Pendek']
            ];
        }
        
        $semesters = DB::table('mstr_term_year')
            ->where('Term_Year_Id', 'like', $academicYear . '%')
            ->select('Term_Year_Id', 'Term_Year_Name')
            ->orderBy('Term_Year_Id')
            ->get();
            
        return $semesters->map(function($term) {
            $semesterNumber = substr($term->Term_Year_Id, -1);
            return [
                'id' => $semesterNumber,
                'name' => $term->Term_Year_Name ?? $this->formatTermName($term->Term_Year_Id),
                'term_year_id' => $term->Term_Year_Id
            ];
        })->toArray();
    }
    
    /**
     * Helper methods
     */
    private function getPreviousTermId($currentTermId)
    {
        if (strlen($currentTermId) < 5) return null;
        
        $year = (int)substr($currentTermId, 0, 4);
        $term = (int)substr($currentTermId, 4, 1);
        
        if ($term == 1) {
            return ($year - 1) . '2';
        } elseif ($term == 2) {
            return $year . '1';
        } elseif ($term == 3) {
            return $year . '2';
        }
        
        return null;
    }
    
    private function formatTermName($termYearId)
    {
        if (strlen($termYearId) < 5) return $termYearId;
        
        $year = (int)substr($termYearId, 0, 4);
        $term = (int)substr($termYearId, 4, 1);
        
        $termNames = [
            1 => 'Ganjil',
            2 => 'Genap', 
            3 => 'Pendek'
        ];
        
        $termName = $termNames[$term] ?? 'Term ' . $term;
        return $termName . ' ' . $year . '/' . ($year + 1);
    }
    
    private function isTermActive($termInfo)
    {
        if (!$termInfo->Start_Date || !$termInfo->End_Date) {
            return false;
        }
        
        $now = now();
        return $now >= $termInfo->Start_Date && $now <= $termInfo->End_Date;
    }
}