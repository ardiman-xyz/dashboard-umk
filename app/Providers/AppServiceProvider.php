<?php

namespace App\Providers;

use App\Services\AverageGpaService;
use App\Services\FacultyDistributionService;
use App\Services\GpaTrendService;
use App\Services\GradeDistributionService;
use App\Services\LecturerRatioService;
use App\Services\LecturerService;
use App\Services\StudentService;
use App\Services\TermService;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(StudentService::class, function ($app) {
            return new StudentService();
        });

        $this->app->singleton(AverageGpaService::class, function ($app) {
            return new AverageGpaService();
        });

        $this->app->singleton(TermService::class, function ($app) {
            return new TermService();
        });

        $this->app->singleton(FacultyDistributionService::class, function ($app) {
            return new FacultyDistributionService();
        });

        $this->app->singleton(GpaTrendService::class, function ($app) {
            return new GpaTrendService();
        });

        $this->app->singleton(GradeDistributionService::class, function ($app) {
            return new GradeDistributionService();
        });

        $this->app->singleton(LecturerRatioService::class, function ($app) {
            return new LecturerRatioService();
        });

        $this->app->singleton(LecturerService::class, function ($app) {
            return new LecturerService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
