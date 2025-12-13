import React, { useMemo } from "react";
import { 
  BookMarked,
  Star,
  Hash,
} from 'lucide-react';

const RecentKnowledge = ({id, category, priority, date, favorite, title, excerpt, tags}) => {
    const stableTags = useMemo(() => tags,[tags])
    console.log(stableTags);
    

    const getPriorityBadge = (priority) => {
        const styles = {
        high: 'bg-red-100 text-red-800 border-red-200',
        medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        low: 'bg-green-100 text-green-800 border-green-200'
        };
        return styles[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    return(
        <div key={id} className="group p-5 border border-gray-200 hover:border-blue-300 rounded-xl transition-all cursor-pointer hover:shadow-md">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${category === 'React' ? 'bg-blue-100 text-blue-800' :
                    category === 'TypeScript' ? 'bg-blue-100 text-blue-800' :
                    category === 'Next.js' ? 'bg-gray-100 text-gray-800' :
                    'bg-purple-100 text-purple-800'}`}>
                    {category}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded border ${getPriorityBadge(priority)}`}>
                    {priority === 'high' ? 'Alta prioridad' : priority === 'medium' ? 'Media prioridad' : 'Baja prioridad'}
                    </span>
                    <span className="text-sm text-gray-500">{date}</span>
                    {favorite && (
                    <Star className="text-yellow-500" size={16} fill="currentColor" />
                    )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition">
                    {title}
                </h3>
                <p className="text-gray-600 mb-3 line-clamp-2">{excerpt}</p>
                </div>
                <BookMarked className="text-gray-400 group-hover:text-blue-500 transition mt-1" size={20} />
            </div>
            
            <div className="flex flex-wrap gap-2">
                {stableTags.map(tag => (
                <span key={tag} className="px-2.5 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg flex items-center gap-1">
                    <Hash size={10} />
                    {tag}
                </span>
                ))}
            </div>
        </div>
    );
}

export default React.memo(RecentKnowledge); 