import { 
  FileText, 
  Folder, 
  Star,
  TrendingUp,
} from 'lucide-react';

export const STATS = [
    { 
        label: 'Total notas', 
        value: '86', 
        icon: <FileText size={20} />, 
        change: '+12%', 
        color: 'bg-blue-50 border-blue-200' 
    },
    { 
        label: 'Categorías activas', 
        value: '8', 
        icon: <Folder size={20} />, 
        change: '+2', 
        color: 'bg-green-50 border-green-200' 
    },
    { 
        label: 'Notas favoritas', 
        value: '24', 
        icon: <Star size={20} />, 
        change: '+5', 
        color: 'bg-yellow-50 border-yellow-200' 
    },
    { 
        label: 'Actividad semanal', 
        value: '18/día', 
        icon: <TrendingUp size={20} />, 
        change: '+8%', 
        color: 'bg-purple-50 border-purple-200' 
    },
];