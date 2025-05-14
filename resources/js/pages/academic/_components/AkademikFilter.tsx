import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { router, usePage } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

// Tipe data untuk term
interface TermInfo {
    id: string;
    name: string;
}

// Tipe data untuk filters
interface FilterProps {
    currentTerm: TermInfo;
    availableTerms: TermInfo[];
}

// Tipe data untuk page props
interface PageProps extends InertiaPageProps {
    filters: FilterProps;
    [key: string]: any;
}

export function AkademikFilter() {
    const { filters } = usePage<PageProps>().props;

    const [termId, setTermId] = useState(filters.currentTerm?.id || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (filters.currentTerm) {
            setTermId(filters.currentTerm.id);
        }
    }, [filters.currentTerm]);

    const handleTermChange = (value: string) => {
        setTermId(value);
    };

    const applyFilters = () => {
        setIsSubmitting(true);

        router.visit(route(route().current() || 'academic.index'), {
            data: {
                term_year_id: termId || 'all',
            },
            preserveState: true,
            onSuccess: () => {
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            },
        });
    };

    if (!filters.availableTerms || filters.availableTerms.length === 0) {
        return (
            <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
                <Select disabled>
                    <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue placeholder="Tidak ada data" />
                    </SelectTrigger>
                </Select>
                <Button variant="outline" className="shrink-0" disabled>
                    Filter
                </Button>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <Select value={termId} onValueChange={handleTermChange}>
                <SelectTrigger className="w-full sm:w-[220px]">
                    <SelectValue placeholder="Semua Tahun & Semester" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectItem value="all">Semua Tahun & Semester</SelectItem>
                        {filters.availableTerms.map((term) => (
                            <SelectItem key={term.id} value={term.id}>
                                {term.name}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>

            <Button className="flex shrink-0 cursor-pointer items-center gap-2" onClick={applyFilters} disabled={isSubmitting}>
                <Search className="h-4 w-4" />
                <span>{isSubmitting ? 'Loading...' : 'Filter'}</span>
            </Button>
        </div>
    );
}
