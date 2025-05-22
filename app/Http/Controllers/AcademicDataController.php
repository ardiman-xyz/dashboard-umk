<?php

namespace App\Http\Controllers;

use App\Services\AverageGpaService;
use App\Services\FacultyDistributionService;
use App\Services\GpaTrendService;
use App\Services\GradeDistributionService;
use App\Services\LecturerRatioService;
use App\Services\LecturerService;
use App\Services\StudentService;
use App\Services\TermService;
use Illuminate\Http\Request;
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

    public function __construct(
        StudentService $studentService, 
        AverageGpaService $averageGpaService,
        TermService $termService,
        FacultyDistributionService $facultyDistributionService,
        GpaTrendService $gpaTrendService,
        GradeDistributionService $gradeDistributionService,
        LecturerRatioService $lecturerRatioService,
        LecturerService $lecturerService
    ) {
        $this->studentService = $studentService;
        $this->averageGpaService = $averageGpaService;
        $this->termService = $termService;
        $this->facultyDistributionService = $facultyDistributionService;
        $this->gpaTrendService = $gpaTrendService;
        $this->gradeDistributionService = $gradeDistributionService;
        $this->lecturerRatioService = $lecturerRatioService;
        $this->lecturerService = $lecturerService;
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
        $availableTerms = $this->termService->getAvailableTerms();

        return Inertia::render("academic/student/index", [
            'facultyDistribution' => $facultyDistribution,
            'genderDistribution' => $genderDistribution,
            'studentStatus' => $studentStatus,
            'ageDistribution' => $ageDistribution,
            'regionDistribution' => $regionDistribution,
            'religionDistribution' => $religionDistribution,
            'filters' => [
                'currentTerm' => $currentTerm,
                'availableTerms' => $availableTerms
            ]
        ]);
    }
}
