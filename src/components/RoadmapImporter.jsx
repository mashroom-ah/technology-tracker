import { useState } from 'react';
import Modal from './Modal';
import './RoadmapImporter.css';

function RoadmapImporter({ onImport, importing = false }) {
  const [showImportModal, setShowImportModal] = useState(false);
  const [apiUrl, setApiUrl] = useState('');

  const handleApiImport = async () => {
    if (!apiUrl.trim()) {
      alert('Пожалуйста, введите URL API');
      return;
    }

    try {
      console.log('Загружаем данные из API:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Получены данные API:', data);
      
      // Преобразуем данные API в формат нашего приложения
      let technologies = [];
      
      if (apiUrl.includes('github.com')) {
        // GitHub API format
        technologies = data.items.map((repo, index) => ({
          title: repo.name,
          description: repo.description || 'Описание отсутствует',
          category: index % 2 === 0 ? 'frontend' : 'backend',
          status: 'not-started',
          notes: `⭐ Звезд: ${repo.stargazers_count} | 🌐 URL: ${repo.html_url}`
        }));
      } else if (apiUrl.includes('jsonplaceholder.typicode.com')) {
        // JSONPlaceholder users
        technologies = data.map(user => ({
          title: `Пользователь: ${user.name}`,
          description: `Email: ${user.email} | Город: ${user.address.city}`,
          category: 'other',
          status: 'not-started',
          notes: `Телефон: ${user.phone} | Компания: ${user.company?.name || 'N/A'}`
        }));
      } else if (apiUrl.includes('fakestoreapi.com')) {
        // Fake Store API
        technologies = data.map(product => ({
          title: product.title,
          description: product.description,
          category: 'other',
          status: 'not-started',
          notes: `Цена: $${product.price} | Категория: ${product.category}`
        }));
      } else {
        // Общий случай - пытаемся найти массив технологий
        if (data.technologies && Array.isArray(data.technologies)) {
          technologies = data.technologies;
        } else if (Array.isArray(data)) {
          technologies = data.slice(0, 10).map(item => ({
            title: item.name || item.title || 'Без названия',
            description: item.description || 'Описание отсутствует',
            category: 'other',
            status: 'not-started',
            notes: ''
          }));
        } else {
          throw new Error('Неизвестный формат данных API');
        }
      }
      
      if (technologies.length === 0) {
        throw new Error('Не найдено технологий для импорта');
      }
      
      console.log('Преобразованные технологии:', technologies);
      onImport(technologies);
      setShowImportModal(false);
      setApiUrl('');
      
    } catch (error) {
      console.error('Ошибка импорта:', error);
      alert(`Ошибка импорта: ${error.message}`);
    }
  };

  // Предустановленные API URLs для быстрого доступа
  const presetApis = [
    {
      name: 'GitHub React Repositories',
      url: 'https://api.github.com/search/repositories?q=react&sort=stars&per_page=5'
    },
    {
      name: 'JSONPlaceholder Users',
      url: 'https://jsonplaceholder.typicode.com/users'
    },
    {
      name: 'Fake Store Products',
      url: 'https://fakestoreapi.com/products?limit=5'
    }
  ];

  const handlePresetApi = (url) => {
    setApiUrl(url);
  };

  return (
    <div className="roadmap-importer">
      <h3>🗺️ Импорт дорожных карт из API</h3>
      
      <div className="import-actions">
        <button
          onClick={() => setShowImportModal(true)}
          className="btn btn-primary"
        >
          📥 Импорт из API
        </button>
      </div>

      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Импорт из API"
      >
        <div className="import-modal-content">
          <p>Введите URL API для загрузки дорожной карты:</p>
          
          <input
            type="text"
            placeholder="https://api.github.com/search/repositories?q=react"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            className="url-input"
          />
          
          <div className="preset-apis">
            <p><strong>Быстрый доступ к тестовым API:</strong></p>
            <div className="preset-buttons">
              {presetApis.map((api, index) => (
                <button
                  key={index}
                  onClick={() => handlePresetApi(api.url)}
                  className="btn btn-outline small"
                >
                  {api.name}
                </button>
              ))}
            </div>
          </div>

          <div className="import-hint">
            <p><strong>Поддерживаемые API форматы:</strong></p>
            <ul>
              <li>GitHub API (репозитории)</li>
              <li>JSONPlaceholder (пользователи)</li>
              <li>Fake Store API (товары)</li>
              <li>Любой API возвращающий JSON массив</li>
            </ul>
          </div>

          <div className="modal-actions">
            <button
              onClick={handleApiImport}
              disabled={importing || !apiUrl.trim()}
              className="btn btn-primary"
            >
              {importing ? '⏳ Импорт...' : '📥 Импортировать'}
            </button>
            
            <button
              onClick={() => setShowImportModal(false)}
              className="btn btn-secondary"
            >
              Отмена
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default RoadmapImporter;