<?php

namespace App\Providers;

use App\Services\AverageGpaService;
use App\Services\FacultyDistributionService;
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
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
