import React from "react";

const StatCard = ({color, icon, change, value, label, id}) => {
    const IconBgClass = () =>{
        if (icon.type.name === 'FileText') return "bg-blue-100 text-blue-600"
        if (icon.type.name === 'Folder') return "bg-green-100 text-green-600"
        if (icon.type.name === 'Start') return "bg-yellow-100 text-yellow-600"
        return "bg-purple-100 text-purple-600"
    }

    return (
        <div key={id} className={`${color} border rounded-xl p-5 hover:shadow-md transition-shadow`} >
            <div className="flex items-center justify-between mb-3">
                <div className={`p-2.5 rounded-lg ${IconBgClass}`}>
                    {icon}
                </div>
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                    {change}
                </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
            <div className="text-sm text-gray-600">{label}</div>

        </div>
    );

};

export default StatCard