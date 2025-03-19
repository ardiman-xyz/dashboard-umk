import { Link } from '@inertiajs/react';
import { ChevronRight, TrendingUp } from 'lucide-react';
import React from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    changeText?: string;
    changeType?: 'increase' | 'decrease' | 'neutral';
    className?: string;
    defaultUrl?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, changeText, changeType = 'neutral', className = '', defaultUrl }) => {
    const getChangeColor = () => {
        switch (changeType) {
            case 'increase':
                return 'text-green-600';
            case 'decrease':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    const getChangeIcon = () => {
        if (changeType === 'increase') {
            return <TrendingUp className="mr-1 h-3 w-3" />;
        } else if (changeType === 'decrease') {
            return <TrendingUp className="mr-1 h-3 w-3 rotate-180" />;
        }
        return null;
    };

    if (defaultUrl) {
        return (
            <Link href={defaultUrl} className="block">
                <div className="group relative rounded-lg bg-white p-4 shadow transition-shadow hover:shadow-md">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-sm text-gray-500">{title}</p>
                            <p className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">{icon}</div>
                    </div>
                    {changeText && (
                        <div className={`mt-2 flex items-center text-xs ${getChangeColor()}`}>
                            <span>{changeText}</span>
                        </div>
                    )}

                    <div className="absolute right-2 bottom-4 opacity-0 transition-opacity group-hover:opacity-100">
                        <ChevronRight className="h-5 w-5 text-green-500" />
                    </div>
                </div>
            </Link>
        );
    }
    return (
        <div className="rounded-lg bg-white p-4 shadow">
            <div className="flex justify-between">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">{icon}</div>
            </div>
            {changeText && (
                <div className={`mt-2 flex items-center text-xs ${getChangeColor()}`}>
                    <span>{changeText}</span>
                </div>
            )}
        </div>
    );
};
