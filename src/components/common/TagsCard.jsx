import React from "react";
import { 
  Hash,
} from 'lucide-react';

const TagsCard = ({id, name, count}) => {
    const mostCount = () => {
        if(count >= 40) return "bg-yellow-100"
        if(count <= 40 && count >= 25) return "bg-purple-100"
        if(count <= 10) return "bg-gray-100"
        return "bg-blue-100"
        
    }
    return(
        <div key={id}className="group relative">
            <button className={`px-3 py-2 ${mostCount()} hover:bg-blue-100 text-gray-700 hover:text-blue-700 rounded-lg transition flex items-center gap-1.5`}>
                <Hash size={14} />
                <span className="font-medium">{name}</span>
                <span className="text-xs text-gray-500">({count})</span>
            </button>
        </div>
    );
}

export default React.memo(TagsCard);