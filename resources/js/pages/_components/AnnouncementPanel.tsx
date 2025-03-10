import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import React from 'react';

interface Announcement {
    id: number;
    title: string;
    content: string;
    priority: 'high' | 'medium' | 'low';
    date: string;
}

interface AnnouncementPanelProps {
    announcements: Announcement[];
}

export const AnnouncementPanel: React.FC<AnnouncementPanelProps> = ({ announcements }) => {
    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'high':
                return <AlertCircle className="h-4 w-4 text-red-500" />;
            case 'medium':
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
            default:
                return <Info className="h-4 w-4 text-blue-500" />;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Pengumuman Terbaru</CardTitle>
                <CardDescription>Informasi penting terkini dari universitas</CardDescription>
            </CardHeader>
            <CardContent className="max-h-80 overflow-y-auto">
                <div className="space-y-4">
                    {announcements.map((announcement) => (
                        <div key={announcement.id} className="border-b pb-3 last:border-0">
                            <div className="flex items-start gap-2">
                                {getPriorityIcon(announcement.priority)}
                                <div>
                                    <h4 className="text-sm font-medium">{announcement.title}</h4>
                                    <p className="mb-1 text-xs text-gray-500">{announcement.date}</p>
                                    <p className="text-sm">{announcement.content}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter>
                <Button variant="outline" size="sm" className="w-full">
                    Lihat Semua Pengumuman
                </Button>
            </CardFooter>
        </Card>
    );
};
