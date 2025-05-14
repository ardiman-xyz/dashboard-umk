<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class TermService
{
    /**
     * Mendapatkan term/semester saat ini
     *
     * @param string|null $termYearId ID semester (opsional)
     * @return array Informasi semester saat ini
     */
    public function getCurrentTerm($termYearId = null)
    {
        // Jika termYearId adalah 'all' atau tidak ada, kembalikan semua tahun dan semester
        if ($termYearId === 'all' || $termYearId === null) {
            return [
                'id' => 'all',
                'name' => 'Semua Tahun & Semester'
            ];
        }
        
        // Jika ID semester diberikan, coba dapatkan dari database
        $term = DB::table('mstr_term_year')
            ->where('Term_Year_Id', $termYearId)
            ->first();
                
        if ($term) {
            return [
                'id' => $term->Term_Year_Id,
                'name' => $term->Term_Year_Name ?? $this->formatTermName($term->Term_Year_Id)
            ];
        }
        
        // Jika tidak ada ID semester atau tidak ditemukan, cari semester aktif
        $currentTerm = DB::table('mstr_term_year')
            ->where('Start_Date', '<=', now())
            ->where('End_Date', '>=', now())
            ->first();
            
        // Jika tidak ada semester aktif, ambil semester terakhir
        if (!$currentTerm) {
            $currentTerm = DB::table('mstr_term_year')
                ->orderBy('Term_Year_Id', 'desc')
                ->first();
        }
        
        if ($currentTerm) {
            return [
                'id' => $currentTerm->Term_Year_Id,
                'name' => $currentTerm->Term_Year_Name ?? $this->formatTermName($currentTerm->Term_Year_Id)
            ];
        }
        
        // Default jika tidak ada data
        return [
            'id' => '20242',
            'name' => 'Genap 2024/2025'
        ];
    }
    
    /**
     * Mendapatkan daftar semester yang tersedia untuk dropdown
     *
     * @return array Daftar semester
     */
    public function getAvailableTerms()
    {
        return Cache::remember('available-terms', 3600, function () {
            $terms = DB::table('mstr_term_year')
                ->orderBy('Term_Year_Id', 'desc')
                ->take(20) // Ambil 20 semester terakhir
                ->get(['Term_Year_Id', 'Term_Year_Name']);
                
            return $terms->map(function ($term) {
                return [
                    'id' => $term->Term_Year_Id,
                    'name' => $term->Term_Year_Name ?? $this->formatTermName($term->Term_Year_Id)
                ];
            })->toArray();
        });
    }
    
    /**
     * Format nama semester dari ID
     *
     * @param string $termYearId ID semester
     * @return string Nama semester yang diformat
     */
    private function formatTermName($termYearId)
    {
        if (strlen($termYearId) < 5) {
            return $termYearId;
        }
        
        $year = (int)substr($termYearId, 0, 4);
        $term = (int)substr($termYearId, 4, 1);
        
        $termName = '';
        
        switch ($term) {
            case 1:
                $termName = "Ganjil";
                break;
            case 2:
                $termName = "Genap";
                break;
            case 3:
                $termName = "Pendek";
                break;
            default:
                $termName = "Term " . $term;
        }
        
        return $termName . ' ' . $year . '/' . ($year + 1);
    }
}