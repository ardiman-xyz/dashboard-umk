import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface DepartmentInfo {
    Department_Id: string;
    Department_Name: string;
    Department_Acronym: string;
    Faculty_Name: string;
    Faculty_Acronym: string;
    Faculty_Id: string;
}

interface DepartmentHeaderProps {
    departmentInfo: DepartmentInfo;
    pageTitle: string;
    pageDescription: string;
    onBack: () => void;
}

export default function DepartmentHeader({ departmentInfo, pageTitle, pageDescription, onBack }: DepartmentHeaderProps) {
    return (
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold md:text-3xl">{pageTitle}</h1>
                    <Badge variant="secondary" className="text-sm">
                        {departmentInfo.Department_Acronym}
                    </Badge>
                    <Badge variant="outline" className="text-sm">
                        {departmentInfo.Faculty_Acronym}
                    </Badge>
                </div>
                <p className="text-muted-foreground mt-1 text-sm">{pageDescription}</p>
            </div>
        </div>
    );
}
