import { useState } from 'react';
import Modal from './Modal';
import './QuickActions.css';

function QuickActions({ onMarkAllCompleted, onResetAll, technologies }) {
  const [showExportModal, setShowExportModal] = useState(false);

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      technologies: technologies
    };
    const dataStr = JSON.stringify(data, null, 2);
    console.log('Данные для экспорта:', dataStr);
    setShowExportModal(true);
  };

  return (
    <div className="quick-actions">
      <h3>Быстрые действия</h3>
      <div className="actions-buttons">
        <button onClick={onMarkAllCompleted} className="action-btn completed-btn">
          ✅ Отметить все как выполненные
        </button>
        <button onClick={onResetAll} className="action-btn reset-btn">
          🔄 Сбросить все статусы
        </button>
        <button onClick={handleExport} className="action-btn export-btn">
          📤 Экспорт данных
        </button>
      </div>

      {/* Универсальное модальное окно */}
      <Modal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Экспорт данных"
      >
        <p>Данные успешно подготовлены для экспорта!</p>
        <p>Проверьте консоль разработчика для просмотра данных.</p>
        <button onClick={() => setShowExportModal(false)} className="action-btn">
          Закрыть
        </button>
      </Modal>
    </div>
  );
}

export default QuickActions;