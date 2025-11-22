import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useTechnologiesApi from '../../hooks/useTechnologiesApi';
import './Settings.css';

function Settings() {
  const navigate = useNavigate();
  const { technologies, updateAllStatuses } = useTechnologiesApi();
  const [exportData, setExportData] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      totalTechnologies: technologies.length,
      technologies: technologies
    };
    const dataStr = JSON.stringify(data, null, 2);
    setExportData(dataStr);

    // Создаем downloadable файл
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `technologies-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Данные успешно экспортированы и скачаны!');
  };

  const handleImport = () => {
    if (!exportData) {
      alert('Введите данные для импорта');
      return;
    }

    try {
      const data = JSON.parse(exportData);
      if (data.technologies && Array.isArray(data.technologies)) {
        localStorage.setItem('technologies', JSON.stringify(data.technologies));
        alert('Данные успешно импортированы!');
        window.location.reload();
      } else {
        alert('Неверный формат данных');
      }
    } catch (error) {
      alert('Ошибка при импорте данных: ' + error.message);
    }
  };

  const handleResetAll = () => {
    updateAllStatuses('not-started');
    // Просто перезагружаем страницу через полсекунды
    window.location.hash = 'no-redirect';
    setTimeout(() => {
      window.location.reload();
    }, 500);
    alert('Все статусы сброшены! Страница будет перезагружена.');
  };

  const handleMarkAllCompleted = () => {
    updateAllStatuses('completed');
    // Просто перезагружаем страницу через полсекунды
    window.location.hash = 'no-redirect';
    setTimeout(() => {
      window.location.reload();
    }, 500);
    alert('Все технологии отмечены как изученные! Страница будет перезагружена.');
  };

  const handleClearData = async () => {
    if (window.confirm('ВНИМАНИЕ! Вы уверены, что хотите удалить все данные и загрузить заново из API? Все импортированные технологии и прогресс будут потеряны!')) {
      setIsResetting(true);
      try {
        // 1. Полностью очищаем ВСЕ данные из localStorage
        localStorage.removeItem('technologies');
        localStorage.removeItem('technologiesDataLoaded');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');

        console.log('LocalStorage очищен. Проверяем:', {
          technologies: localStorage.getItem('technologies'),
          dataLoaded: localStorage.getItem('technologiesDataLoaded'),
          isLoggedIn: localStorage.getItem('isLoggedIn')
        });

        alert('Все данные удалены! Перезагружаем страницу...');

        // 2. Принудительная перезагрузка страницы
        setTimeout(() => {
          window.location.href = '/'; // Полная перезагрузка
        }, 1000);

      } catch (error) {
        alert('Ошибка при удалении данных: ' + error.message);
        setIsResetting(false);
      }
    }
  };

  const handleReloadFromApi = () => {
    if (window.confirm('Загрузить свежие данные из API? Текущий прогресс будет потерян.')) {
      setIsResetting(true);

      // Очищаем данные и загружаем заново
      localStorage.removeItem('technologies');
      localStorage.removeItem('technologiesDataLoaded');

      alert('Данные перезагружены из API! Страница будет обновлена...');

      // Просто обновляем страницу
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  };

  // Статистика для отображения
  const stats = {
    total: technologies.length,
    completed: technologies.filter(t => t.status === 'completed').length,
    inProgress: technologies.filter(t => t.status === 'in-progress').length,
    notStarted: technologies.filter(t => t.status === 'not-started').length
  };

  return (
    <div className="page">
      <div className="settings-page">
        <div className="page-header">
          <h1>⚙️ Настройки приложения</h1>
          <button onClick={() => navigate('/')} className="btn btn-secondary">
            ← На главную
          </button>
        </div>

        <div className="settings-sections">
          {/* Текущая статистика */}
          <div className="settings-section">
            <h2>📊 Текущее состояние</h2>
            <div className="current-stats">
              <div className="stat-item">
                <span className="stat-label">Всего технологий:</span>
                <span className="stat-value">{stats.total}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Изучено:</span>
                <span className="stat-value completed">{stats.completed}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">В процессе:</span>
                <span className="stat-value in-progress">{stats.inProgress}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Не начато:</span>
                <span className="stat-value not-started">{stats.notStarted}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Общий прогресс:</span>
                <span className="stat-value progress">
                  {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>

          {/* Управление статусами */}
          <div className="settings-section">
            <h2>🔄 Управление статусами</h2>

            <div className="setting-item">
              <h3>Отметить все как изученные</h3>
              <p>Установить статус "Изучено" для всех технологий</p>
              <button onClick={handleMarkAllCompleted} className="btn btn-primary">
                ✅ Отметить все как выполненные
              </button>
            </div>

            <div className="setting-item">
              <h3>Сбросить все статусы</h3>
              <p>Вернуть все технологии в статус "Не начато"</p>
              <button onClick={handleResetAll} className="btn btn-warning">
                🔄 Сбросить все статусы
              </button>
            </div>
          </div>

          {/* Управление данными */}
          <div className="settings-section">
            <h2>📁 Управление данными</h2>

            <div className="setting-item">
              <h3>Экспорт данных</h3>
              <p>Скачайте резервную копию всех ваших технологий в JSON формате</p>
              <button onClick={handleExport} className="btn btn-primary">
                📤 Экспорт данных
              </button>
            </div>

            <div className="setting-item">
              <h3>Импорт данных</h3>
              <p>Восстановите данные из JSON файла (заменит текущие данные)</p>
              <textarea
                value={exportData}
                onChange={(e) => setExportData(e.target.value)}
                placeholder="Вставьте JSON данные здесь или экспортируйте текущие данные..."
                rows="6"
                className="import-textarea"
              />
              <button onClick={handleImport} className="btn btn-secondary">
                📥 Импорт данных
              </button>
            </div>

            <div className="setting-item">
              <h3>Перезагрузить из API</h3>
              <p>Загрузить свежие данные из GitHub API (текущий прогресс будет потерян)</p>
              <button
                onClick={handleReloadFromApi}
                disabled={isResetting}
                className="btn btn-outline"
              >
                {isResetting ? '⏳ Загрузка...' : '🔄 Загрузить из API'}
              </button>
            </div>
          </div>

          {/* Опасные операции */}
          <div className="settings-section danger-zone">
            <h2>🚨 Опасная зона</h2>

            <div className="setting-item">
              <h3>Полное удаление данных</h3>
              <p>Удалить все данные и загрузить заново из API. Все импортированные технологии и прогресс будут потеряны!</p>
              <button
                onClick={handleClearData}
                disabled={isResetting}
                className="btn btn-danger"
              >
                {isResetting ? '⏳ Удаление...' : '🗑️ Удалить все данные и перезагрузить'}
              </button>
            </div>
          </div>

          {/* Информация о приложении */}
          <div className="settings-section">
            <h2>ℹ️ Информация о приложении</h2>
            <div className="app-info">
              <div className="info-item">
                <strong>Версия:</strong> 1.0.0
              </div>
              <div className="info-item">
                <strong>Тип данных:</strong> {technologies.length > 0 ? 'API + Локальные' : 'Загрузка...'}
              </div>
              <div className="info-item">
                <strong>Последнее обновление:</strong> {new Date().toLocaleDateString('ru-RU')}
              </div>
              <div className="info-item">
                <strong>Источник данных:</strong> GitHub API + LocalStorage
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;