<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class LecturerService
{
    /**
     * Mendapatkan jumlah dosen berdasarkan peran (role)
     * 
     * @param string|null $termYearId ID term/semester (opsional)
     * @return array Data jumlah dosen
     */
    public function getLecturerCount($termYearId = null)
    {
        $cacheKey = 'lecturer-count' . ($termYearId && $termYearId !== 'all' ? '-' . $termYearId : '-all');
        
        return Cache::remember($cacheKey, 3600, function () use ($termYearId) {
            try {
                // Dapatkan role IDs untuk role yang namanya mengandung kata 'Dosen'
                $dosenRoleIds = DB::table('_role')
                    ->where('name', 'like', '%Dosen%')
                    ->pluck('id')
                    ->toArray();
                
                // Log role IDs untuk debugging
                // Jika tidak ada role dosen yang ditemukan, kembalikan hasil default
                if (empty($dosenRoleIds)) {
                    Log::warning("Tidak ada role dosen yang ditemukan di database");
                    return [
                        'total' => '0',
                        'trend' => null,
                        'additional_info' => 'Data dosen tidak ditemukan'
                    ];
                }
                
                // Query untuk menghitung user dengan role dosen
                $userCount = DB::table('_user as u')
                    ->join('_role_user as ru', 'u.id', '=', 'ru.user_id')
                    ->whereIn('ru.role_id', $dosenRoleIds)
                    ->distinct('u.id')
                    ->count('u.id');
                
                // Query untuk menghitung pegawai dengan role dosen
                $employeeCount = DB::table('emp_employee as e')
                    ->join('_user as u', 'e.Email_Corporate', '=', 'u.email')
                    ->join('_role_user as ru', 'u.id', '=', 'ru.user_id')
                    ->whereIn('ru.role_id', $dosenRoleIds)
                    ->distinct('e.Employee_Id')
                    ->count('e.Employee_Id');
                
                
                // Pilih count yang paling masuk akal (gunakan pegawai jika tersedia, jika tidak gunakan user)
                $totalCount = $employeeCount > 0 ? $employeeCount : $userCount;
                
                // Format output untuk UI
                return [
                    'total' => number_format($totalCount, 0, ',', '.'),
                    'trend' => null,
                    'additional_info' => $termYearId === 'all' ? 'Total seluruh dosen' : null
                ];
            } catch (\Exception $e) {
                // Return default value
                return [
                    'total' => '0',
                    'trend' => null,
                    'additional_info' => 'Terjadi kesalahan saat mengambil data: ' . $e->getMessage()
                ];
            }
        });
    }
}