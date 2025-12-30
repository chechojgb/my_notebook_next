'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Plus,
  BookOpen,
  Edit,
  Bell,
  ChevronRight,
  Zap,
  Star,
  TrendingUp,
  Layers
} from 'lucide-react';

// Datos mock
import { KNOWLEDGE_CATEGORIES } from '@/data/mockKnowledge';
import { RECENT_NOTES } from '@/data/mosckRecentNotes';
import { STUDY_REMINDERS } from '@/data/mockStudyReminders';
import { POPULAR_TAGS } from '@/data/mockPopularTags';

// Componentes
import StatCard from '@/components/common/StatCard';
import CategoryCard from '@/components/common/CategoryCard';
import ReminderItem from '@/components/common/ReminderItem';
import TagsCard from '@/components/common/TagsCard';
import ButtonTags from '@/components/common/ButtonTags';
import ButtonAdd from '@/components/common/ButtonAdd';
import ShortCut from '@/components/common/ShortCut';
import RecentKnowledge from '@/components/welcome/RecentKnowledge';

const buttonTagsText = [
  { text: "Nueva nota", children: <Plus size={20} /> },
  { text: "Nueva categoría", children: <BookOpen size={20} /> },
  { text: "Agregar tags", children: <Layers size={20} /> },
  { text: "Recordatorio", children: <Bell size={20} /> }
];

const starts = [
  { text: "favorites", icon: <Star size={20} /> },
  { text: "Tendency", icon: <TrendingUp size={20} /> },
  { text: "without reading", icon: <BookOpen size={20} /> },
  { text: "tutorials", icon: <BookOpen size={20} /> }
];

interface DashboardClientProps {
  stats: any[];
}

export default function DashboardClient({ stats }: DashboardClientProps) {
  const [quickNote, setQuickNote] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSaveNote = () => {
    if (quickNote.trim()) {
      console.log('Nota guardada:', quickNote);
      setQuickNote('');
    }
  };

  return (
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 rounded-lg">
                <BookOpen className="text-blue-600" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mi Knowledge Base</h1>
                <p className="text-gray-600 mt-1">Organiza y accede a todo tu conocimiento técnico</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar conceptos, código, notas..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <ButtonAdd text="Nueva" color="purple">
                <Plus size={20} />
              </ButtonAdd>
            </div>
          </div>
  
          {/* Acciones rápidas */}
          <div className="flex flex-wrap gap-3 mb-6">
            {buttonTagsText.map((item, index) => (
                <ButtonTags key={index} text={item.text}>
                    {item.children}
                </ButtonTags>
            ))}
          </div>
        </header>
  
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <StatCard 
              key={stat.id}  // ✅ AÑADIR ESTO
              id={stat.id}
              color={stat.color}
              icon={stat.icon}
              change={stat.change}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal - 2/3 */}
          <div className="lg:col-span-2 space-y-6">
            {/* Nota rápida */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Edit className="text-blue-600" />
                  Captura rápida de conocimiento
                </h2>
                <Zap className="text-gray-400" size={20} />
              </div>
              
              <textarea
                value={quickNote}
                onChange={(e) => setQuickNote(e.target.value)}
                placeholder="¿Qué concepto, patrón o código has aprendido hoy? Escribe aquí para guardarlo rápidamente..."
                rows="5"
                className="w-full p-4 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
              />
              
              <div className="flex flex-wrap justify-between items-center mt-4">
                <div className="flex gap-2 mb-3 md:mb-0">
                  <span className="text-sm text-gray-500 font-medium mr-2">Tags sugeridos:</span>
                  {['#concepto', '#código', '#patrón', '#syntax', '#ejemplo'].map(tag => (
                    <button 
                      key={tag}
                      onClick={() => setQuickNote(prev => `${prev} ${tag} `)}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={handleSaveNote}
                  disabled={!quickNote.trim()}
                  className={`px-5 py-2.5 rounded-lg font-medium transition ${quickNote.trim() 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  Guardar conocimiento
                </button>
              </div>
            </div>
  
            {/* Notas recientes */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="text-blue-600" />
                  Conocimiento reciente
                </h2>
                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition">
                  Ver todo <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="space-y-4">
                {RECENT_NOTES.map(note => (
                  <RecentKnowledge 
                    key={note.id}
                    {...note}
                  />
                ))}
              </div>
            </div>
          </div>
  
          {/* Columna lateral - 1/3 */}
          <div className="space-y-6">
            {/* Categorías */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="text-blue-600" />
                  Áreas de conocimiento
                </h2>
                <span className="text-sm text-gray-500">
                  {KNOWLEDGE_CATEGORIES.length} categorías
                </span>
              </div>
              
              <div className="space-y-3">
                {KNOWLEDGE_CATEGORIES.map(category => (
                  <CategoryCard 
                    key={category.id}
                    {...category}
                  />
                ))}
              </div>
              
              <button className="w-full mt-4 px-4 py-3 border border-dashed border-gray-300 hover:border-blue-400 rounded-lg text-gray-600 hover:text-blue-600 transition flex items-center justify-center gap-2 font-medium">
                <Plus size={20} />
                Crear nueva área
              </button>
            </div>
  
            {/* Recordatorios de estudio */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="text-blue-600" />
                  Próximo a estudiar
                </h2>
                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                  <Plus className="text-gray-500" size={20} />
                </button>
              </div>
              
              <div className="space-y-3">
                {STUDY_REMINDERS.map(reminder => (
                  <ReminderItem 
                    key={reminder.id}
                    {...reminder}
                  />
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition flex items-center justify-center gap-1">
                    Ver todos los objetivos de estudio
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
  
            {/* Tags populares */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Layers className="text-blue-600" />
                  Tags populares
                </h2>
                <Layers className="text-gray-400" size={20} />
              </div>
              
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.map(tag => (
                  <TagsCard 
                    key={tag.name || tag.id}
                    {...tag}
                  />
                ))} 
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <button className="text-gray-600 hover:text-gray-800 font-medium text-sm transition flex items-center justify-center gap-1">
                    Explorar todos los tags
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
  
            {/* Acceso rápido */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6">
              <div className="text-white mb-4">
                <h3 className="text-xl font-bold mb-2">Acceso rápido</h3>
                <p className="text-blue-100 text-sm">
                  Accede rápidamente a lo más importante
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {starts.map((start, index) => (
                  <ShortCut key={index} text={start.text}>{start.icon}</ShortCut>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
}
