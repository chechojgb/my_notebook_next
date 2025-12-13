// src/data/mockKnowledge.js
import { Code, FileText, Cpu, Terminal, Database, Globe } from 'lucide-react';

// EXPORT como constante, NO como función
export const KNOWLEDGE_CATEGORIES = [
  { 
    id: 1, 
    name: 'React', 
    icon: <Code size={20} />, 
    count: 15, 
    color: 'bg-blue-100 text-blue-600',
    slug: 'react'
  },
  { 
    id: 2, 
    name: 'JavaScript', 
    icon: <FileText size={20} />, 
    count: 22, 
    color: 'bg-yellow-100 text-yellow-600',
    slug: 'javascript'
  },
  { 
    id: 3, 
    name: 'TypeScript', 
    icon: <Cpu size={20} />, 
    count: 12, 
    color: 'bg-blue-100 text-blue-600',
    slug: 'typescript'
  },
  { 
    id: 4, 
    name: 'Node.js', 
    icon: <Terminal size={20} />, 
    count: 8, 
    color: 'bg-green-100 text-green-600',
    slug: 'nodejs'
  },
  { 
    id: 5, 
    name: 'Bases de Datos', 
    icon: <Database size={20} />, 
    count: 10, 
    color: 'bg-purple-100 text-purple-600',
    slug: 'databases'
  },
  { 
    id: 6, 
    name: 'Next.js', 
    icon: <Globe size={20} />, 
    count: 7, 
    color: 'bg-gray-100 text-gray-600',
    slug: 'nextjs'
  },
];

