import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import useTechnologiesApi from './hooks/useTechnologiesApi';
import ProgressHeader from './components/ProgressHeader';
import TechnologyCard from './components/TechnologyCard';
import TechnologyModal from './components/TechnologyModal';
import QuickActions from './components/QuickActions';
import TechnologyFilter from './components/TechnologyFilter';
import Navigation from './components/Navigation';
import TechnologyDetail from './components/pages/TechnologyDetail';
import Statistics from './components/pages/Statistics';
import Settings from './components/pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import TechnologySearch from './components/TechnologySearch';
import RoadmapImporter from './components/RoadmapImporter';
import Login from './components/pages/Login';
import SemesterSwitcher from './components/SemesterSwitcher';

function App() {
  const { 
    technologies, 
    loading, 
    error, 
    refetch,
    updateStatus, 
    updateNotes, 
    updateAllStatuses,
    addTechnology 
  } = useTechnologiesApi();
  
  // 🔥 Авторизация инициализируется напрямую из localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('isLoggedIn') === 'true'
  );

  const [username, setUsername] = useState(
    () => localStorage.getItem('username') || ''
  );

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTech, setSelectedTech] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [importing, setImporting] = useState(false);

  const handleLogin = (user) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', user);
    setIsLoggedIn(true);
    setUsername(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    setUsername('');
  };

  const handleTechClick = (technology) => {
    setSelectedTech(technology);
    setIsModalOpen(true);
  };

  const handleMarkAllCompleted = () => {
    updateAllStatuses('completed');
  };

  const handleResetAll = () => {
    updateAllStatuses('not-started');
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleImportRoadmap = async (techData) => {
    setImporting(true);
    try {
      if (Array.isArray(techData)) {
        techData.forEach(tech => {
          addTechnology(tech);
        });
        alert(`Успешно импортировано ${techData.length} технологий из API!`);
      }
    } catch (error) {
      alert(`Ошибка импорта: ${error.message}`);
    } finally {
      setImporting(false);
    }
  };

  const filteredTechnologies = technologies
    .filter(tech => activeFilter === 'all' || tech.status === activeFilter)
    .filter(tech =>
      tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <Router>
      <div className="App">
        <Navigation 
          isLoggedIn={isLoggedIn} 
          username={username} 
          onLogout={handleLogout} 
        />
        
        <Routes>
          {/* Главная страница */}
          <Route path="/" element={
            <div className="main-content">
              {isLoggedIn ? (
                <>
                  <ProgressHeader technologies={technologies} />
                  
                  <SemesterSwitcher />

                  <QuickActions
                    onMarkAllCompleted={handleMarkAllCompleted}
                    onResetAll={handleResetAll}
                    technologies={technologies}
                  />

                  <RoadmapImporter 
                    onImport={handleImportRoadmap}
                    importing={importing}
                  />

                  <TechnologyFilter
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                  />

                  <TechnologySearch 
                    onSearch={handleSearch}
                    loading={loading}
                  />

                  {loading && (
                    <div className="loading-state">
                      <div className="spinner"></div>
                      <p>Загрузка технологий...</p>
                    </div>
                  )}

                  {error && (
                    <div className="error-state">
                      <h3>Ошибка загрузки</h3>
                      <p>{error}</p>
                      <button onClick={refetch} className="btn btn-primary">
                        Попробовать снова
                      </button>
                    </div>
                  )}

                  {!loading && !error && (
                    <>
                      <div className="search-results-info">
                        <span>Найдено технологий: {filteredTechnologies.length}</span>
                        {searchQuery && (
                          <button 
                            onClick={() => setSearchQuery('')}
                            className="btn btn-secondary small"
                          >
                            Очистить поиск
                          </button>
                        )}
                      </div>

                      <div className="technologies-grid">
                        {filteredTechnologies.map(technology => (
                          <TechnologyCard
                            key={technology.id}
                            technology={technology}
                            onClick={() => handleTechClick(technology)}
                          />
                        ))}
                      </div>

                      {filteredTechnologies.length === 0 && (
                        <div className="empty-state">
                          <p>Технологии не найдены.</p>
                          <button 
                            onClick={() => {
                              setSearchQuery('');
                              setActiveFilter('all');
                            }} 
                            className="btn btn-primary"
                          >
                            Показать все технологии
                          </button>
                        </div>
                      )}
                    </>
                  )}

                  {selectedTech && (
                    <TechnologyModal
                      isOpen={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                      technology={selectedTech}
                      onStatusChange={updateStatus}
                      onNotesChange={updateNotes}
                    />
                  )}
                </>
              ) : (
                <>
                  <div className="welcome-section">
                    <h1>🚀 Добро пожаловать в Трекер технологий!</h1>
                    <p>Ваш персональный помощник в изучении современных технологий и фреймворков</p>
                    
                    <div className="welcome-actions">
                      <p>Для доступа к технологиям необходимо войти в систему</p>
                      <a href="/login" className="btn btn-primary large">
                        🔐 Войти в систему
                      </a>
                    </div>
                  </div>

                  <div className="guest-promo">
                    <h3>Начните свой путь в разработке!</h3>
                    <p>Войдите чтобы получить доступ ко всем функциям:</p>
                    <ul>
                      <li>✅ Загрузка технологий из GitHub API</li>
                      <li>✅ Поиск с подсказками</li>
                      <li>✅ Импорт дорожных карт</li>
                      <li>✅ Отслеживание прогресса</li>
                      <li>✅ Персональные заметки</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          } />
          
          {/* Страница всех технологий */}
          <Route 
            path="/technologies" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <div className="main-content">
                  <div className="page-header">
                    <h1>📚 Все технологии</h1>
                    <a href="/" className="btn btn-secondary">
                      ← На главную
                    </a>
                  </div>

                  <div className="filters-section">
                    <TechnologyFilter
                      activeFilter={activeFilter}
                      onFilterChange={setActiveFilter}
                    />
                    
                    <TechnologySearch 
                      onSearch={handleSearch}
                      loading={loading}
                    />
                  </div>

                  {loading && (
                    <div className="loading-state">
                      <div className="spinner"></div>
                      <p>Загрузка технологий...</p>
                    </div>
                  )}

                  {error && (
                    <div className="error-state">
                      <h3>Ошибка загрузки</h3>
                      <p>{error}</p>
                      <button onClick={refetch} className="btn btn-primary">
                        Попробовать снова
                      </button>
                    </div>
                  )}

                  {!loading && !error && (
                    <>
                      <div className="search-results-info">
                        <span>Найдено технологий: {filteredTechnologies.length}</span>
                        {searchQuery && (
                          <button 
                            onClick={() => setSearchQuery('')}
                            className="btn btn-secondary small"
                          >
                            Очистить поиск
                          </button>
                        )}
                      </div>

                      <div className="technologies-grid">
                        {filteredTechnologies.map(technology => (
                          <TechnologyCard
                            key={technology.id}
                            technology={technology}
                            onClick={() => handleTechClick(technology)}
                          />
                        ))}
                      </div>

                      {filteredTechnologies.length === 0 && (
                        <div className="empty-state">
                          {searchQuery || activeFilter !== 'all' ? (
                            <>
                              <p>Технологии по запросу не найдены.</p>
                              <button 
                                onClick={() => {
                                  setSearchQuery('');
                                  setActiveFilter('all');
                                }} 
                                className="btn btn-primary"
                              >
                                Показать все
                              </button>
                            </>
                          ) : (
                            <>
                              <p>Технологий ещё нет в базе.</p>
                              <p>Скоро здесь появится больше данных!</p>
                            </>
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {selectedTech && (
                    <TechnologyModal
                      isOpen={isModalOpen}
                      onClose={() => setIsModalOpen(false)}
                      technology={selectedTech}
                      onStatusChange={updateStatus}
                      onNotesChange={updateNotes}
                    />
                  )}
                </div>
              </ProtectedRoute>
            } 
          />
          
          {/* Детальная страница */}
          <Route 
            path="/technology/:techId" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <TechnologyDetail 
                  updateStatus={updateStatus}
                  updateNotes={updateNotes}
                />
              </ProtectedRoute>
            } 
          />
          
          {/* Статистика */}
          <Route 
            path="/statistics" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Statistics />
              </ProtectedRoute>
            } 
          />
          
          {/* Настройки */}
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Settings />
              </ProtectedRoute>
            } 
          />
          
          {/* Страница входа */}
          <Route 
            path="/login" 
            element={<Login onLogin={handleLogin} />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
