import { useNavigate } from 'react-router-dom';
import useTechnologiesApi from '../../hooks/useTechnologiesApi';
import ProgressBar from '../ProgressBar';
import './Statistics.css';

function Statistics() {
  const navigate = useNavigate();
  const { technologies, progress, loading, error } = useTechnologiesApi();

  if (loading) {
    return (
      <div className="page">
        <div className="statistics-page">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Загрузка статистики...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="statistics-page">
          <div className="error-state">
            <h3>Ошибка загрузки</h3>
            <p>{error}</p>
            <button onClick={() => navigate('/')} className="btn btn-primary">
              На главную
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = {
    total: technologies.length,
    completed: technologies.filter(t => t.status === 'completed').length,
    inProgress: technologies.filter(t => t.status === 'in-progress').length,
    notStarted: technologies.filter(t => t.status === 'not-started').length
  };

  const categoryStats = {
    frontend: technologies.filter(t => t.category === 'frontend'),
    backend: technologies.filter(t => t.category === 'backend'),
    other: technologies.filter(t => !['frontend', 'backend'].includes(t.category))
  };

  const getCategoryProgress = (categoryTechs) => {
    if (categoryTechs.length === 0) return 0;
    const completed = categoryTechs.filter(t => t.status === 'completed').length;
    return Math.round((completed / categoryTechs.length) * 100);
  };

  // Получаем последние изученные технологии
  const recentCompleted = technologies
    .filter(tech => tech.status === 'completed')
    .slice(0, 5);

  return (
    <div className="page">
      <div className="statistics-page">
        <div className="page-header">
          <h1>📊 Статистика прогресса</h1>
          <button onClick={() => navigate('/')} className="btn btn-secondary">
            ← На главную
          </button>
        </div>

        {/* Общая статистика */}
        <div className="stats-overview">
          <div className="main-progress">
            <h2>Общий прогресс изучения</h2>
            <ProgressBar
              progress={progress}
              label={`${stats.completed} из ${stats.total} технологий изучено`}
              color="#4CAF50"
              animated={true}
              height={25}
            />
          </div>

          <div className="stats-grid">
            <div className="stat-card total">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Всего технологий</span>
            </div>
            <div className="stat-card completed">
              <span className="stat-number">{stats.completed}</span>
              <span className="stat-label">Изучено</span>
            </div>
            <div className="stat-card in-progress">
              <span className="stat-number">{stats.inProgress}</span>
              <span className="stat-label">В процессе</span>
            </div>
            <div className="stat-card not-started">
              <span className="stat-number">{stats.notStarted}</span>
              <span className="stat-label">Не начато</span>
            </div>
          </div>
        </div>

        {/* Прогресс по категориям */}
        <div className="category-stats">
          <h2>Прогресс по категориям</h2>
          <div className="category-cards">
            <div className="category-card frontend">
              <h3>🎨 Фронтенд</h3>
              <div className="category-info">
                <span className="category-count">
                  {categoryStats.frontend.filter(t => t.status === 'completed').length} / {categoryStats.frontend.length}
                </span>
              </div>
              <ProgressBar
                progress={getCategoryProgress(categoryStats.frontend)}
                label={`${getCategoryProgress(categoryStats.frontend)}% изучено`}
                color="#2196F3"
                animated={true}
              />
              <div className="category-details">
                <div className="detail-item">
                  <span className="detail-label">Изучено:</span>
                  <span className="detail-value">
                    {categoryStats.frontend.filter(t => t.status === 'completed').length}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">В процессе:</span>
                  <span className="detail-value">
                    {categoryStats.frontend.filter(t => t.status === 'in-progress').length}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Не начато:</span>
                  <span className="detail-value">
                    {categoryStats.frontend.filter(t => t.status === 'not-started').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="category-card backend">
              <h3>⚙️ Бэкенд</h3>
              <div className="category-info">
                <span className="category-count">
                  {categoryStats.backend.filter(t => t.status === 'completed').length} / {categoryStats.backend.length}
                </span>
              </div>
              <ProgressBar
                progress={getCategoryProgress(categoryStats.backend)}
                label={`${getCategoryProgress(categoryStats.backend)}% изучено`}
                color="#FF9800"
                animated={true}
              />
              <div className="category-details">
                <div className="detail-item">
                  <span className="detail-label">Изучено:</span>
                  <span className="detail-value">
                    {categoryStats.backend.filter(t => t.status === 'completed').length}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">В процессе:</span>
                  <span className="detail-value">
                    {categoryStats.backend.filter(t => t.status === 'in-progress').length}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Не начато:</span>
                  <span className="detail-value">
                    {categoryStats.backend.filter(t => t.status === 'not-started').length}
                  </span>
                </div>
              </div>
            </div>

            <div className="category-card other">
              <h3>🔧 Другие</h3>
              <div className="category-info">
                <span className="category-count">
                  {categoryStats.other.filter(t => t.status === 'completed').length} / {categoryStats.other.length}
                </span>
              </div>
              <ProgressBar
                progress={getCategoryProgress(categoryStats.other)}
                label={`${getCategoryProgress(categoryStats.other)}% изучено`}
                color="#9C27B0"
                animated={true}
              />
              <div className="category-details">
                <div className="detail-item">
                  <span className="detail-label">Изучено:</span>
                  <span className="detail-value">
                    {categoryStats.other.filter(t => t.status === 'completed').length}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">В процессе:</span>
                  <span className="detail-value">
                    {categoryStats.other.filter(t => t.status === 'in-progress').length}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Не начато:</span>
                  <span className="detail-value">
                    {categoryStats.other.filter(t => t.status === 'not-started').length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Последние достижения */}
        <div className="recent-activity">
          <h2>🎯 Последние достижения</h2>
          {recentCompleted.length > 0 ? (
            <div className="activity-list">
              {recentCompleted.map(tech => (
                <div key={tech.id} className="activity-item">
                  <div className="activity-tech">
                    <span className="tech-name">{tech.title}</span>
                    <span className="tech-category">{tech.category}</span>
                  </div>
                  <span className="activity-status completed">✅ Изучено</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-activity">
              <p>Пока нет завершенных технологий. Продолжайте изучать!</p>
              <button 
                onClick={() => navigate('/')}
                className="btn btn-primary"
              >
                Перейти к изучению
              </button>
            </div>
          )}
        </div>

        {/* Дополнительная статистика */}
        <div className="additional-stats">
          <h2>📈 Дополнительная статистика</h2>
          <div className="additional-grid">
            <div className="additional-card">
              <h4>📅 Активность</h4>
              <div className="additional-content">
                <p>Технологий в процессе: <strong>{stats.inProgress}</strong></p>
                <p>Средний прогресс: <strong>{progress}%</strong></p>
              </div>
            </div>
            <div className="additional-card">
              <h4>🎯 Цели</h4>
              <div className="additional-content">
                <p>Осталось изучить: <strong>{stats.total - stats.completed}</strong></p>
                <p>Темп изучения: <strong>{stats.completed > 0 ? 'Хороший' : 'Начните сейчас!'}</strong></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;