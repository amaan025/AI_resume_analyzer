import React from 'react';

type ScoreBadgeProps = {
    score: number;
};

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
    let bgClass = 'bg-badge-red';
    let textClass = 'text-red-600';
    let label = 'Needs Work';

    if (score > 70) {
        bgClass = 'bg-badge-green';
        textClass = 'text-green-600';
        label = 'Strong';
    } else if (score > 49) {
        bgClass = 'bg-badge-yellow';
        textClass = 'text-yellow-600';
        label = 'Good Start';
    }

    return (
        <div className={`inline-flex items-center rounded-full px-2 py-0.5 ${bgClass}`}>
            <p className={`text-xs font-medium ${textClass}`}>{label}</p>
        </div>
    );
};

export default ScoreBadge;
