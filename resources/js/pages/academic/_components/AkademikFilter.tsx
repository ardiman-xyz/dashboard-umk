import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Filter, Settings2 } from 'lucide-react';

export function AkademikFilter() {
    return (
        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <Select defaultValue="mahasiswa">
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Pilih Data" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="mahasiswa">Mahasiswa</SelectItem>
                        <SelectItem value="dosen">Dosen</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Select defaultValue="2024-2025">
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Tahun Akademik" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="all">Semua Tahun</SelectItem>
                        <SelectItem value="2024-2025">2024/2025</SelectItem>
                        <SelectItem value="2023-2024">2023/2024</SelectItem>
                        <SelectItem value="2022-2023">2022/2023</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            {/* Semester */}
            <Select defaultValue="genap">
                <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="all">Semua Semester</SelectItem>
                        <SelectItem value="ganjil">Ganjil</SelectItem>
                        <SelectItem value="genap">Genap</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Button variant="outline" size="icon" className="shrink-0">
                <Settings2 className="h-4 w-4" />
            </Button>

            <Button variant="outline" className="flex shrink-0 items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
            </Button>
        </div>
    );
}
