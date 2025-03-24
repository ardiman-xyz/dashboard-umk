<?php

namespace App\Providers;

use App\Services\AverageGpaService;
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
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
