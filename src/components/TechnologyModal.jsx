import './TechnologyModal.css';
import { useState, useEffect } from 'react';

function TechnologyModal({ isOpen, onClose, technology, onStatusChange, onNotesChange }) {
  const [currentNotes, setCurrentNotes] = useState(technology.notes);
  const [currentStatus, setCurrentStatus] = useState(technology.status);

  // Обновляем локальное состояние при изменении технологии
  useEffect(() => {
    setCurrentNotes(technology.notes);
    setCurrentStatus(technology.status);
  }, [technology]);

  if (!isOpen) {
    return null;
  }

  const handleBackgroundClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
    onStatusChange(technology.id, newStatus);
  };

  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setCurrentNotes(newNotes);
    onNotesChange(technology.id, newNotes);
  };

  return (
    <div className="modal-background" onClick={handleBackgroundClick}>
      <div className="modal-window">
        <div className="modal-header">
          <h2>{technology.title}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="tech-description">
            <p>{technology.description}</p>
          </div>

          <div className="status-section">
            <h4>Статус изучения:</h4>
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
            <h4>Мои заметки:</h4>
            <textarea
              value={currentNotes}
              onChange={handleNotesChange}
              placeholder="Записывайте важные моменты..."
              rows="4"
              className="notes-textarea"
            />
            <div className="notes-hint">
              {currentNotes.length > 0 ? `Заметка сохранена (${currentNotes.length} символов)` : 'Добавьте заметку'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TechnologyModal;