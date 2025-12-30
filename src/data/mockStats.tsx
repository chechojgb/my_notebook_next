import { 
  FileText, 
  Folder, 
  Star,
  TrendingUp,
} from 'lucide-react';
import { NotesService } from '@/lib/notes.service';

export async function getStatsWithRealTotalNotes(userId: string | null){
  try{
    console.log("Obteniendo stats con datos reales");

    let totalNotesReal = 12;

    if (userId) {
      totalNotesReal = await NotesService.getTotalNotes(userId);
      console.log("Total notas del usuario:", totalNotesReal);
    }else{
      console.log("user not found");
    }
    return [
      { 
          label: 'Total notas', 
          value: totalNotesReal.toString(), 
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
  } catch (error){
    console.error("error obteniendo stats:", error);
    return STATS;
  }
}

export const STATS = [
    { 
        label: 'Total notas', 
        value: '13', 
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