import { useState } from 'react';
import './SemesterSwitcher.css';

function SemesterSwitcher() {
    const [isSecondSemester, setIsSecondSemester] = useState(false);

    const firstSemesterThemes = [
        "Введение в веб-разработку и системы контроля версий",
        "Введение в HTML и CSS",
        "CSS-фреймворки: Bootstrap, Tailwind, Bulma",
        "Элементы адаптивной вёрстки и адаптивности",
        "React.js: основы, компоненты, события, состояние/эффекты",
        "React.js: роутинг, формы/валидация, данные из API, архитектурные паттерны",
        "Vue.js: реактивность, шаблоны/директивы, компоненты, v-model, данные, переходы/анимации, слайдеры, деплой/CI",
        "Профессия фронтенд разработчика: требования, условия труда и взаимодействия в проектах"
    ];

    const secondSemesterThemes = [
        "Базовое бэкенд-приложение",
        "HTTP-запросы",
        "JSON и работа с ним",
        "HTTP-ответы",
        "Проектирование API",
        "Роутинг и его настройка",
        "NoSQL базы данных",
        "Обеспечение авторизации и доступа пользователей",
        "Работа сторонних сервисов уведомления и авторизации",
        "Основы ReactJS",
        "Работа с компонентами динамической DOM",
        "Использование хуков в React",
        "Основы микросервисной архитектуры",
        "Разработка классических модулей веб-приложений"
    ];

    const handleSwitchSemester = () => {
        setIsSecondSemester(!isSecondSemester);
    };

    const currentThemes = isSecondSemester ? secondSemesterThemes : firstSemesterThemes;

    return (
        <div className="semester-switcher">
            <h3>Темы практик {isSecondSemester ? 'второго' : 'первого'} семестра</h3>
            <button onClick={handleSwitchSemester} className="btn btn-primary">
                {isSecondSemester ? 'Посмотреть практики первого семестра' : 'Посмотреть практики второго семестра'}
            </button>

            <div className="themes-table">
                <table>
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Тема практики</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentThemes.map((theme, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{theme}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SemesterSwitcher;