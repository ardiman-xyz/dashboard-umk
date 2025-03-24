<?php

use App\Http\Controllers\AcademicDataController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get("/location", [LocationController::class, 'index'])->name("location.index");

    Route::prefix("dashboard/students")->group(function () {
        Route::get("/", [StudentController::class, "index"])->name("student.index");
    });

    Route::prefix("academic")->name("academic.")->group(function () {
        Route::get("/", [AcademicDataController::class, "index"])->name("index");
        Route::get("students", [AcademicDataController::class, "student"])->name("student.index");
    });

});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
