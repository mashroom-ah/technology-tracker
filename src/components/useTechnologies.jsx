import { useMemo } from 'react';
import useLocalStorage from './useLocalStorage';

const initialTechnologies = [
  {
    id: 1,
    title: 'React Components',
    description: 'Изучение базовых компонентов',
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  {
    id: 2,
    title: 'JSX Syntax',
    description: 'Освоение синтаксиса JSX',
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  {
    id: 3,
    title: 'State Management',
    description: 'Работа с состоянием компонентов',
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  {
    id: 4,
    title: 'Props and Components',
    description: 'Передача данных между компонентами',
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  {
    id: 5,
    title: 'Event Handling',
    description: 'Обработка событий в React',
    status: 'not-started',
    notes: '',
    category: 'frontend'
  },
  {
    id: 6,
    title: 'Node.js Basics',
    description: 'Основы серверного JavaScript',
    status: 'not-started',
    notes: '',
    category: 'backend'
  },
  {
    id: 7,
    title: 'Express.js',
    description: 'Создание веб-серверов',
    status: 'not-started',
    notes: '',
    category: 'backend'
  },
  {
    id: 8,
    title: 'Database Concepts',
    description: 'Основы работы с базами данных',
    status: 'not-started',
    notes: '',
    category: 'backend'
  }
];

function useTechnologies() {
  const [technologies, setTechnologies] = useLocalStorage('technologies', initialTechnologies);

  // Progress пересчитывается при каждом изменении technologies
  const progress = useMemo(() => {
    if (technologies.length === 0) return 0;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    return Math.round((completed / technologies.length) * 100);
  }, [technologies]);

  const updateStatus = (techId, newStatus) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, status: newStatus } : tech
      )
    );
  };

  const updateNotes = (techId, newNotes) => {
    setTechnologies(prev =>
      prev.map(tech =>
        tech.id === techId ? { ...tech, notes: newNotes } : tech
      )
    );
  };

  const updateAllStatuses = (newStatus) => {
    setTechnologies(prev =>
      prev.map(tech => ({ ...tech, status: newStatus }))
    );
  };

  return {
    technologies,
    updateStatus,
    updateNotes,
    updateAllStatuses,
    progress
  };
}

export default useTechnologies;