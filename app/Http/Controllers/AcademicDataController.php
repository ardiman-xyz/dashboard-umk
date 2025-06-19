<?php

namespace App\Http\Controllers;

use App\Services\AverageGpaService;
use App\Services\DepartmentDetailService;
use App\Services\FacultyDetailService;
use App\Services\FacultyDistributionService;
use App\Services\GpaTrendService;
use App\Services\GradeDistributionService;
use App\Services\LecturerRatioService;
use App\Services\LecturerService;
use App\Services\StudentService;
use App\Services\TermService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;


class AcademicDataController extends Controller
{
    protected StudentService $studentService;
    protected AverageGpaService $averageGpaService;
    protected TermService $termService;
    protected FacultyDistributionService $facultyDistributionService;
    protected GpaTrendService $gpaTrendService;
    protected GradeDistributionService $gradeDistributionService;
    protected LecturerRatioService $lecturerRatioService;
    protected LecturerService $lecturerService;
    protected FacultyDetailService $facultyDetailService;
    protected DepartmentDetailService $departmentDetailService;

    public function __construct(
        StudentService $studentService, 
        AverageGpaService $averageGpaService,
        TermService $termService,
        FacultyDistributionService $facultyDistributionService,
        GpaTrendService $gpaTrendService,
        GradeDistributionService $gradeDistributionService,
        LecturerRatioService $lecturerRatioService,
        LecturerService $lecturerService,
        FacultyDetailService $facultyDetailService,
        DepartmentDetailService $departmentDetailService 
    ) {
        $this->studentService = $studentService;
        $this->averageGpaService = $averageGpaService;
        $this->termService = $termService;
        $this->facultyDistributionService = $facultyDistributionService;
        $this->gpaTrendService = $gpaTrendService;
        $this->gradeDistributionService = $gradeDistributionService;
        $this->lecturerRatioService = $lecturerRatioService;
        $this->lecturerService = $lecturerService;
        $this->facultyDetailService = $facultyDetailService;
        $this->departmentDetailService = $departmentDetailService;
    }

    public function index(Request $request)
    {
        // Ambil term_year_id dari request
        $termYearId = $request->input('term_year_id', 'all');
        
        $currentTerm = $this->termService->getCurrentTerm($termYearId);
        $availableTerms = $this->termService->getAvailableTerms();
        
        // Ambil data berdasarkan termYearId
        $lecturerRatio = $this->lecturerRatioService->getLecturerRatio($termYearId);
        $avgGpa = $termYearId === 'all' 
            ? $this->averageGpaService->getAverageGpa()
            : $this->averageGpaService->getAverageGpaByTerm($currentTerm['id']);
        $facultyDistribution = $this->facultyDistributionService->getFacultyDistributionSummary($termYearId);
        $gpaTrend = $this->gpaTrendService->getGpaTrendSummary(10, $termYearId);
        $gradeDistribution = $this->gradeDistributionService->getGradeDistributionSummary($termYearId);
        $lecturerCount = $this->lecturerService->getLecturerCount($termYearId);

        
        $stats = [
            'activeStudents' => $this->studentService->getActiveStudentsCount($termYearId),
            'avgGpa' => $avgGpa,
            'lecturerRatio' => $lecturerRatio,
            'graduationRate' => [
                'value' => '82%',
                'trend' => [
                    'value' => '5% dari tahun lalu',
                    'type' => 'up'
                ]
            ],
            'lecturerCount' => $lecturerCount,
            'facultyDistribution' => $facultyDistribution,
            'gpaTrend' => $gpaTrend,
            'gradeDistribution' => $gradeDistribution
        ];

        return Inertia::render("academic/index", [
            'stats' => $stats,
            'filters' => [
                'currentTerm' => $currentTerm,
                'availableTerms' => $availableTerms
            ]
        ]);
    }


    public function student(Request $request)
    {
        $termYearId = $request->input('term_year_id', 'all');
        $studentStatus = $request->input('student_status', 'all');

        $facultyDistribution = $this->facultyDistributionService->getFacultyDistributionSummary($termYearId, $studentStatus);
        $genderDistribution = $this->facultyDistributionService->getGenderDistributionByFaculty($termYearId, $studentStatus);
        $religionDistribution = $this->facultyDistributionService->getReligionDistribution($termYearId, $studentStatus);
        $ageDistribution = $this->facultyDistributionService->getAgeDistribution($termYearId, $studentStatus);
        $regionDistribution = $this->facultyDistributionService->getRegionDistribution($termYearId, $studentStatus);

        $currentTerm = $this->termService->getCurrentTerm($termYearId);
        $availableTerms = $this->getFormattedAvailableTerms(); // Updated method

        return Inertia::render("academic/student/index", [
            'facultyDistribution' => $facultyDistribution,
            'genderDistribution' => $genderDistribution,
            'studentStatus' => $studentStatus,
            'ageDistribution' => $ageDistribution,
            'regionDistribution' => $regionDistribution,
            'religionDistribution' => $religionDistribution,
            'filters' => [
                'currentTerm' => $currentTerm,
                'availableTerms' => $availableTerms,
            ]
        ]);
    }

    /**
     * Get formatted available terms with readable names
     */
    private function getFormattedAvailableTerms()
    {
        // Get terms from database, ordered by most recent first
        $terms = DB::table('mstr_term_year')
            ->orderBy('Term_Year_Id', 'desc')
            ->take(15) // Limit to recent 15 terms
            ->get(['Term_Year_Id', 'Term_Year_Name']);
        
        $formattedTerms = [];
        
        foreach ($terms as $term) {
            $termId = $term->Term_Year_Id;
            
            // Use database name if available, otherwise format it
            $termName = $term->Term_Year_Name ?? $this->formatTermName($termId);
            
            // Format like "2024/Gasal", "2023/Semester Pendek Genap", etc.
            if (strlen($termId) >= 5) {
                $year = substr($termId, 0, 4);
                $semester = substr($termId, 4, 1);
                
                // Simplified semester naming based on the image
                $semesterNames = [
                    '1' => 'Gasal',     // Semester Ganjil = Gasal
                    '2' => 'Genap',     // Semester Genap = Genap  
                    '3' => 'Semester Pendek Genap' // Semester Pendek
                ];
                
                $semesterName = $semesterNames[$semester] ?? $termName;
                $displayName = $year . '/' . $semesterName;
            } else {
                $displayName = $termName;
            }
            
            $formattedTerms[] = [
                'id' => $termId,
                'name' => $displayName
            ];
        }
        
        return $formattedTerms;
    }

    /**
     * Format term name from ID
     */
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


    /**
     * Halaman detail fakultas
     */
    public function facultyDetail(Request $request, $facultyId)
    {
        $termYearId = $request->input('term_year_id', 'all');
        $studentStatus = $request->input('student_status', 'all');
        
        // Ambil informasi fakultas
        $facultyInfo = $this->facultyDetailService->getFacultyInfo($facultyId);
        
        if (!$facultyInfo) {
            abort(404, 'Fakultas tidak ditemukan');
        }
        
        // Ambil data detail fakultas
        $facultyDetail = $this->facultyDetailService->getFacultyDetailData($facultyId, $termYearId, $studentStatus);
        
        // Ambil data untuk filter
        $currentTerm = $this->termService->getCurrentTerm($termYearId);
        $availableTerms = $this->termService->getAvailableTerms();
        
        return Inertia::render("academic/detail", [
            'facultyInfo' => $facultyInfo,
            'facultyDetail' => $facultyDetail,
            'filters' => [
                'currentTerm' => $currentTerm,
                'availableTerms' => $availableTerms
            ],
            'termYearId' => $termYearId,
            'studentStatus' => $studentStatus
        ]);
    }

    /**
     * Halaman detail program studi
     */
    public function departmentDetail(Request $request, $departmentId)
    {
        $termYearId = $request->input('term_year_id', 'all');
        $studentStatus = $request->input('student_status', 'all');
        
        // Ambil informasi program studi
        $departmentInfo = $this->departmentDetailService->getDepartmentInfo($departmentId);
        
        if (!$departmentInfo) {
            abort(404, 'Program studi tidak ditemukan');
        }
        
        // Ambil data detail program studi
        $departmentDetail = $this->departmentDetailService->getDepartmentDetailData($departmentId, $termYearId, $studentStatus);
        // dd($departmentDetail);
        
        // Ambil data untuk filter
        $currentTerm = $this->termService->getCurrentTerm($termYearId);
        $availableTerms = $this->termService->getAvailableTerms();
        
        return Inertia::render("academic/department/detail", [
            'departmentInfo' => $departmentInfo,
            'departmentDetail' => $departmentDetail,
            'filters' => [
                'currentTerm' => $currentTerm,
                'availableTerms' => $availableTerms
            ],
            'termYearId' => $termYearId,
            'studentStatus' => $studentStatus
        ]);
    }

    /**
     * API endpoint untuk daftar mahasiswa program studi
     */
    public function departmentStudents(Request $request, $departmentId)
    {
        $termYearId = $request->input('term_year_id', 'all');
        $studentStatus = $request->input('student_status', 'all');
        $search = $request->input('search', '');
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 20);
        $genderFilter = $request->input('gender_filter', null); // New parameter for gender filtering

        $students = $this->departmentDetailService->getDepartmentStudents(
            $departmentId, 
            $termYearId, 
            $studentStatus, 
            $search, 
            $page, 
            $perPage,
            $genderFilter
        );

        return response()->json([
            'students' => $students,
            // 'statistics' => $statistics,
            'filters' => [
                'term_year_id' => $termYearId,
                'student_status' => $studentStatus,
                'search' => $search,
                'gender_filter' => $genderFilter
            ]
        ]);
    }

}
