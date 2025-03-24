<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class AverageGpaService
{
    /**
     * Mendapatkan data rata-rata IPK mahasiswa (dummy)
     * 
     * @return array Data statistik IPK mahasiswa
     */
    public function getAverageGpa()
    {
        // Data dummy untuk rata-rata IPK
        return [
            'value' => '3.42',
            'trend' => [
                'value' => '0.1 dari semester lalu',
                'type' => 'up'
            ]
        ];
    }

    /**
     * Mendapatkan data rata-rata IPK mahasiswa dari database berdasarkan term/semester
     * 
     * @param string|null $termYearId ID tahun akademik dan semester saat ini (opsional)
     * @return array Data statistik IPK mahasiswa
     */
    public function getAverageGpaByTerm($termYearId = null)
    {
        return Cache::remember('average-gpa-term-' . $termYearId, 3600, function () use ($termYearId) {
            // Jika termYearId tidak diberikan, gunakan term/semester saat ini
            if (!$termYearId) {
                $currentTerm = $this->getCurrentTerm();
                $termYearId = $currentTerm ? $currentTerm->Term_Year_Id : '20212'; 
            }
            
            // Ambil term sebelumnya dari term saat ini
            $previousTermYearId = $this->getPreviousTerm($termYearId);
            
            // Ambil data IPK untuk term saat ini
            $currentTermData = DB::table('acd_student_krs')
                ->join('acd_student_khs', 'acd_student_krs.Krs_Id', '=', 'acd_student_khs.Krs_Id')
                ->where('acd_student_krs.Term_Year_Id', $termYearId)
                ->where('acd_student_khs.Is_For_Transkrip', '1')
                ->where('acd_student_krs.Is_Approved', '1')
                ->select(
                    'acd_student_khs.Weight_Value',
                    'acd_student_krs.Sks'
                )
                ->get();
            
            // Hitung IPK term saat ini
            $totalWeightedGpa = 0;
            $totalSks = 0;
            
            foreach ($currentTermData as $item) {
                $totalWeightedGpa += ($item->Weight_Value * $item->Sks);
                $totalSks += $item->Sks;
            }
            
            $avgGpa = $totalSks > 0 ? $totalWeightedGpa / $totalSks : 0;
            
            // Ambil data IPK untuk term sebelumnya
            $previousTermData = DB::table('acd_student_krs')
                ->join('acd_student_khs', 'acd_student_krs.Krs_Id', '=', 'acd_student_khs.Krs_Id')
                ->where('acd_student_krs.Term_Year_Id', $previousTermYearId)
                ->where('acd_student_khs.Is_For_Transkrip', '1')
                ->where('acd_student_krs.Is_Approved', '1')
                ->select(
                    'acd_student_khs.Weight_Value',
                    'acd_student_krs.Sks'
                )
                ->get();
            
            // Hitung IPK term sebelumnya
            $prevTotalWeightedGpa = 0;
            $prevTotalSks = 0;
            
            foreach ($previousTermData as $item) {
                $prevTotalWeightedGpa += ($item->Weight_Value * $item->Sks);
                $prevTotalSks += $item->Sks;
            }
            
            $prevAvgGpa = $prevTotalSks > 0 ? $prevTotalWeightedGpa / $prevTotalSks : 0;
            
            // Jika tidak ada data yang ditemukan, gunakan nilai default
            if ($avgGpa == 0) $avgGpa = 3.42;
            if ($prevAvgGpa == 0) $prevAvgGpa = 3.32;
            
            // Hitung perubahan IPK
            $change = $avgGpa - $prevAvgGpa;
            $trendType = 'neutral';
            
            if ($change > 0) {
                $trendType = 'up';
            } elseif ($change < 0) {
                $trendType = 'down';
                $change = abs($change); // Jadikan positif untuk tampilan
            }
            
            // Dapatkan informasi term (semester) untuk label
            $termInfo = $this->getTermInfo($termYearId);
            $prevTermInfo = $this->getTermInfo($previousTermYearId);
            
            return [
                'value' => number_format($avgGpa, 2),
                'trend' => [
                    'value' => number_format($change, 2) . ' dari ' . ($prevTermInfo ? $prevTermInfo : 'semester lalu'),
                    'type' => $trendType
                ],
                'term_info' => $termInfo
            ];
        });
    }
    
    /**
     * Mendapatkan term/semester aktif saat ini
     * 
     * @return object|null Term/semester saat ini
     */
    private function getCurrentTerm()
    {
        // Cari term dengan tanggal mulai dan selesai yang mencakup tanggal hari ini
        $currentTerm = DB::table('mstr_term_year')
            ->where('Start_Date', '<=', now())
            ->where('End_Date', '>=', now())
            ->first();
        
        // Jika tidak ada term aktif, ambil term terakhir
        if (!$currentTerm) {
            $currentTerm = DB::table('mstr_term_year')
                ->orderBy('Term_Year_Id', 'desc')
                ->first();
        }
        
        return $currentTerm;
    }
    
    /**
     * Mendapatkan term/semester sebelumnya berdasarkan term saat ini
     * 
     * @param string $currentTermYearId ID term tahun akademik saat ini
     * @return string ID term tahun akademik sebelumnya
     */
    private function getPreviousTerm($currentTermYearId)
    {
        // Format ID term biasanya [TAHUN][SEMESTER]
        // Contoh: 20212 (tahun 2021, semester 2/genap)
        
        if (strlen($currentTermYearId) < 5) {
            return '20211'; // Default jika format tidak sesuai
        }
        
        $year = (int)substr($currentTermYearId, 0, 4);
        $term = (int)substr($currentTermYearId, 4, 1);
        
        // Jika semester 1, kembali ke semester 2 tahun sebelumnya
        if ($term == 1) {
            return ($year - 1) . '2';
        } 
        // Jika semester 2, kembali ke semester 1 tahun yang sama
        else if ($term == 2) {
            return $year . '1';
        }
        // Jika semester 3 (pendek), kembali ke semester 2 tahun yang sama
        else {
            return $year . '2';
        }
    }
    
    /**
     * Mendapatkan informasi term/semester dalam format teks
     * 
     * @param string $termYearId ID term tahun akademik
     * @return string Informasi term dalam format teks
     */
    private function getTermInfo($termYearId)
    {
        // Coba dapatkan dari database
        $termInfo = DB::table('mstr_term_year')
            ->where('Term_Year_Id', $termYearId)
            ->first();
            
        if ($termInfo && !empty($termInfo->Term_Year_Name)) {
            return $termInfo->Term_Year_Name;
        }
        
        // Jika tidak ada di database, buat format berdasarkan ID
        if (strlen($termYearId) < 5) {
            return '';
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
                $termName = "";
        }
        
        return $termName . ' ' . $year . '/' . ($year + 1);
    }
}