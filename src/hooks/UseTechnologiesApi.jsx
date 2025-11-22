import { useState, useEffect, useMemo } from 'react';
import useLocalStorage from './useLocalStorage';

function useTechnologiesApi() {
  const [technologies, setTechnologies] = useLocalStorage('technologies', []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTechnologies = async () => {
    try {
      // Проверяем, были ли данные уже загружены
      const isDataLoaded = localStorage.getItem('technologiesDataLoaded') === 'true';

      // Загружаем только если нет данных И флаг не установлен
      if (technologies.length === 0 && !isDataLoaded) {
        setLoading(true);
        setError(null);

        console.log('Загрузка данных из API...');
        const response = await fetch('https://api.github.com/search/repositories?q=topic:javascript+topic:react&sort=stars&per_page=10');

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        console.log('Данные получены из API:', data);

        const formattedTechnologies = data.items.map((repo, index) => ({
          id: repo.id,
          title: repo.name,
          description: repo.description || 'Описание отсутствует',
          status: 'not-started',
          notes: '',
          category: index % 2 === 0 ? 'frontend' : 'backend',
          stars: repo.stargazers_count,
          url: repo.html_url,
          language: repo.language || 'JavaScript'
        }));

        console.log('Форматированные технологии:', formattedTechnologies);
        setTechnologies(formattedTechnologies);

        // Устанавливаем флаг, что данные загружены
        localStorage.setItem('technologiesDataLoaded', 'true');
      } else {
        // Данные уже есть в localStorage, просто выключаем загрузку
        setLoading(false);
      }

    } catch (err) {
      console.error('Ошибка загрузки из API:', err);
      setError('Не удалось загрузить технологии из API: ' + err.message);
      setLoading(false);
    }
  };

  // Функции для работы с данными
  const updateStatus = (techId, newStatus) => {
    console.log('Обновление статуса:', techId, newStatus);
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

  const addTechnology = (techData) => {
    const newTech = {
      id: techData.id || crypto.randomUUID(),
      ...techData,
      createdAt: new Date().toISOString()
    };
    setTechnologies(prev => [...prev, newTech]);
    return newTech;
  };

  const updateAllStatuses = (newStatus) => {
    console.log('Сброс всех статусов на:', newStatus, 'Технологий:', technologies.length);
    setTechnologies(prev =>
      prev.map(tech => ({
        ...tech,
        status: newStatus
      }))
    );
  };

  // Прогресс рассчитывается на лету
  const progress = useMemo(() => {
    if (technologies.length === 0) return 0;
    const completed = technologies.filter(tech => tech.status === 'completed').length;
    return Math.round((completed / technologies.length) * 100);
  }, [technologies]);

  useEffect(() => {
    fetchTechnologies();
  }, []);

  return {
    technologies,
    loading,
    error,
    refetch: fetchTechnologies,
    updateStatus,
    updateNotes,
    addTechnology,
    updateAllStatuses,
    progress
  };
}

export default useTechnologiesApi;