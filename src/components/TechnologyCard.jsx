import './TechnologyCard.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import CompletedIcon from '../assets/completed-icon.svg';
import InProgressIcon from '../assets/in-progress-icon.svg';
import NotStartedIcon from '../assets/not-started-icon.svg';

function TechnologyCard({ technology, onClick }) {
  const { title, description, status, category, id } = technology;
  const [isHovered, setIsHovered] = useState(false);
  const [isTeacherPhoto, setIsTeacherPhoto] = useState(false);

  const getStatusConfig = () => {
    switch(status) {
      case 'completed': 
        return { 
          icon: CompletedIcon, 
          text: 'Изучено'
        };
      case 'in-progress': 
        return { 
          icon: InProgressIcon, 
          text: 'В процессе'
        };
      case 'not-started': 
      default: 
        return { 
          icon: NotStartedIcon, 
          text: 'Не начато'
        };
    }
  };

  const handlePhotoMouseOver = () => {
    setIsHovered(true);
  };

  const handlePhotoMouseOut = () => {
    setIsHovered(false);
  };

  const handlePhotoClick = (e) => {
    e.stopPropagation(); // Останавливаем всплытие события
    setIsTeacherPhoto(!isTeacherPhoto);
  };

  const handlePhotoDoubleClick = (e) => {
    e.stopPropagation(); // Останавливаем всплытие события
    alert("Не налегай, у меня не так много любимых преподавателей");
  };

  const statusConfig = getStatusConfig();

  const photoStyle = {
    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
    transition: 'transform 0.3s ease'
  };

  return (
    <div className={`technology-card ${status}`} onClick={onClick}>
      <div className="tech-category">{category}</div>
      <div className="tech-info">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      
      {/* Блок с фотографией - отдельные обработчики */}
      <div className="tech-photo">
        {isTeacherPhoto ? (
          <img 
            src="/teacher-photo.jpg" 
            alt="Любимый преподаватель"
            className="tech-image"
            style={photoStyle}
            onClick={handlePhotoClick}
            onDoubleClick={handlePhotoDoubleClick}
            onMouseOver={handlePhotoMouseOver}
            onMouseOut={handlePhotoMouseOut}
            onError={(e) => {
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='12' fill='%23999'%3EПреподаватель%3C/text%3E%3C/svg%3E";
            }}
          />
        ) : (
          <img 
            src="/student-photo.jpg" 
            alt="Студент"
            className="tech-image"
            style={photoStyle}
            onClick={handlePhotoClick}
            onDoubleClick={handlePhotoDoubleClick}
            onMouseOver={handlePhotoMouseOver}
            onMouseOut={handlePhotoMouseOut}
            onError={(e) => {
              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' fill='%23e3f2fd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='12' fill='%231976d2'%3EСтудент%3C/text%3E%3C/svg%3E";
            }}
          />
        )}
        <div className="photo-hint">
          Кликните для смены фото • Двойной клик для сообщения
        </div>
      </div>

      <div className="tech-status">
        <img 
          src={statusConfig.icon} 
          alt={`${statusConfig.text} иконка`}
          className="status-icon"
        />
        <span className="status-text">{statusConfig.text}</span>
      </div>
      <div className="card-actions">
        <span className="click-hint">Нажмите на карточку для редактирования</span>
        <Link 
          to={`/technology/${id}`} 
          className="detail-link"
          onClick={(e) => e.stopPropagation()}
        >
          Подробнее →
        </Link>
      </div>
    </div>
  );
}

export default TechnologyCard;