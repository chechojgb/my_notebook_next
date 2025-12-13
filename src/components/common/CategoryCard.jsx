import React from "react";
import { ChevronRight,} from 'lucide-react';

const CategoryCard = ({id, color, icon, name, count}) => {
    return(
        <div key={id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer group"
        >
            <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-lg ${color}`}>
                {icon}
                </div>
                <div>
                <div className="font-medium text-gray-900">{name}</div>
                <div className="text-sm text-gray-500">{count} notas</div>
                </div>
            </div>
            <ChevronRight className="text-gray-400 group-hover:text-blue-500 transition" size={20} />
        </div>
    );
}

export default CategoryCard;