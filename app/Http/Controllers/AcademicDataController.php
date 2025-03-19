<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AcademicDataController extends Controller
{
    public function index()
    {
        return Inertia::render("academic/index");
    }
}
