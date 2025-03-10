import { TrendingUp } from 'lucide-react';
import React from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    changeText?: string;
    changeType?: 'increase' | 'decrease' | 'neutral';
    className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, changeText, changeType = 'neutral', className = '' }) => {
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

    return (
        <div className={`rounded-lg bg-white p-4 shadow ${className}`}>
            <div className="flex justify-between">
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <p className="text-2xl font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">{icon}</div>
            </div>
            {changeText && (
                <div className={`mt-2 flex items-center text-xs ${getChangeColor()}`}>
                    {getChangeIcon()}
                    <span>{changeText}</span>
                </div>
            )}
        </div>
    );
};
