import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Ошибка чтения из localStorage ключа "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        setStoredValue(prev => {
            const valueToStore =
                value instanceof Function
                    ? value(prev)
                    : value;

            window.localStorage.setItem(key, JSON.stringify(valueToStore));
            return valueToStore;
        });
    };

    return [storedValue, setValue];
}

export default useLocalStorage;