import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useTechnologiesApi from '../../hooks/useTechnologiesApi';
import './TechnologyDetail.css';

function TechnologyDetail({ updateStatus, updateNotes }) {
  const { techId } = useParams();
  const navigate = useNavigate();
  const { technologies } = useTechnologiesApi();
  const [technology, setTechnology] = useState(null);
  const [currentNotes, setCurrentNotes] = useState('');
  const [currentStatus, setCurrentStatus] = useState('not-started');

  useEffect(() => {
    const tech = technologies.find(t => t.id === parseInt(techId));
    if (tech) {
      setTechnology(tech);
      setCurrentNotes(tech.notes || '');
      setCurrentStatus(tech.status);
    }
  }, [techId, technologies]);

  const handleStatusChange = (newStatus) => {
    if (technology) {
      setCurrentStatus(newStatus);
      updateStatus(technology.id, newStatus);
      setTechnology({ ...technology, status: newStatus });
    }
  };

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setCurrentNotes(newNotes);
    if (technology) {
      updateNotes(technology.id, newNotes);
    }
  };

  if (!technology) {
    return (
      <div className="page">
        <div className="technology-detail-page">
          <div className="page-header">
            <button onClick={() => navigate('/technologies')} className="btn btn-secondary">
              ← Назад к списку
            </button>
            <h1>Технология не найдена</h1>
          </div>
          <div className="error-message">
            <p>Технология с ID {techId} не существует.</p>
            <Link to="/technologies" className="btn btn-primary">
              Вернуться к списку
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="technology-detail-page">
        <div className="page-header">
          <button onClick={() => navigate('/technologies')} className="btn btn-secondary">
            ← Назад к списку
          </button>
          <h1>{technology.title}</h1>
        </div>

        <div className="technology-detail-content">
          <div className="tech-description">
            <h3>Описание</h3>
            <p>{technology.description}</p>
          </div>

          <div className="status-section">
            <h3>Статус изучения:</h3>
            <div className="status-buttons">
              <button 
                className={`status-btn ${currentStatus === 'not-started' ? 'active' : ''}`}
                onClick={() => handleStatusChange('not-started')}
              >
                Не начато
              </button>
              <button 
                className={`status-btn ${currentStatus === 'in-progress' ? 'active' : ''}`}
                onClick={() => handleStatusChange('in-progress')}
              >
                В процессе
              </button>
              <button 
                className={`status-btn ${currentStatus === 'completed' ? 'active' : ''}`}
                onClick={() => handleStatusChange('completed')}
              >
                Изучено
              </button>
            </div>
          </div>

          <div className="notes-section">
            <h3>Мои заметки:</h3>
            <textarea
              value={currentNotes}
              onChange={handleNotesChange}
              placeholder="Записывайте важные моменты..."
              rows="6"
              className="notes-textarea"
            />
            <div className="notes-hint">
              {currentNotes.length > 0 ? `Заметка сохранена (${currentNotes.length} символов)` : 'Добавьте заметку'}
            </div>
          </div>

          <div className="tech-meta">
            <div className="meta-item">
              <strong>Категория:</strong>
              <span className={`category-tag category-${technology.category}`}>
                {technology.category === 'frontend' ? 'Фронтенд' : 
                 technology.category === 'backend' ? 'Бэкенд' : 'Другое'}
              </span>
            </div>
            <div className="meta-item">
              <strong>ID технологии:</strong>
              <span>#{technology.id}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechnologyDetail;