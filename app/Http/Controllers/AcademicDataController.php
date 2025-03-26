<?php

namespace App\Http\Controllers;

use App\Services\AverageGpaService;
use App\Services\FacultyDistributionService;
use App\Services\GpaTrendService;
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

    public function __construct(
        StudentService $studentService, 
        AverageGpaService $averageGpaService,
        TermService $termService,
        FacultyDistributionService $facultyDistributionService,
        GpaTrendService $gpaTrendService
    ) {
        $this->studentService = $studentService;
        $this->averageGpaService = $averageGpaService;
        $this->termService = $termService;
        $this->facultyDistributionService = $facultyDistributionService;
        $this->gpaTrendService = $gpaTrendService;
    }

    public function index(Request $request)
    {
        // Ambil term_year_id dari request
        $termYearId = $request->input('term_year_id');
        
        $currentTerm = $this->termService->getCurrentTerm($termYearId);
        $availableTerms = $this->termService->getAvailableTerms();
        
        $avgGpa = $this->averageGpaService->getAverageGpaByTerm($currentTerm['id']);

           // Ambil data distribusi fakultas
        $facultyDistribution = $this->facultyDistributionService->getFacultyDistributionSummary($currentTerm['id']);

        $gpaTrend = $this->gpaTrendService->getGpaTrendSummary(10, $currentTerm['id']);

        
        $stats = [
            'activeStudents' => $this->studentService->getActiveStudentsCount(),
            'avgGpa' => $avgGpa,
            'graduationRate' => [
                'value' => '82%',
                'trend' => [
                    'value' => '5% dari tahun lalu',
                    'type' => 'up'
                ]
            ],
            'facultyRatio' => [
                'value' => '1:15',
                'trend' => [
                    'value' => 'Ideal menurut standar BAN-PT',
                    'type' => 'neutral'
                ]
            ],
            'problemStudents' => [
                'total' => '346',
                'trend' => [
                    'value' => '2.8% dari total mahasiswa',
                    'type' => 'down'
                ]
                ],
            'facultyDistribution' => $facultyDistribution,
            'gpaTrend' => $gpaTrend
        ];


        return Inertia::render("academic/index", [
            'stats' => $stats,
            'filters' => [
                'currentTerm' => $currentTerm,
                'availableTerms' => $availableTerms
            ]
        ]);
    }

    public function student()
    {
        return Inertia::render("academic/student/index");
    }
}
