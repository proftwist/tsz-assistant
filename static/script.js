document.addEventListener('DOMContentLoaded', function() {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const loadingIndicator = document.getElementById('loading-indicator');

    // Функция для добавления сообщения в чат с анимацией
    function addMessageToChat(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user' : 'llm');
        messageDiv.classList.add('fade-in');
        
        const sender = isUser ? 'Вы' : 'ИИ';
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        
        chatBox.appendChild(messageDiv);
        
        // Прокрутка к новому сообщению
        smoothScrollToBottom();
        
        return messageDiv;
    }

    // Плавная прокрутка вниз
    function smoothScrollToBottom() {
        setTimeout(() => {
            chatBox.scrollTo({
                top: chatBox.scrollHeight,
                behavior: 'smooth'
            });
        }, 100);
    }

    // Показать индикатор загрузки
    function showLoading() {
        loadingIndicator.style.display = 'block';
        smoothScrollToBottom();
    }

    // Скрыть индикатор загрузки
    function hideLoading() {
        loadingIndicator.style.display = 'none';
    }

    // Анимация при отправке сообщения
    function animateSendMessage() {
        const button = chatForm.querySelector('button');
        button.classList.add('sending');
        
        setTimeout(() => {
            button.classList.remove('sending');
        }, 300);
    }

    // Обработчик отправки формы
    chatForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const userMessage = userInput.value.trim();
        
        if (!userMessage) return;
        
        // Добавляем сообщение пользователя
        addMessageToChat(userMessage, true);
        
        // Очищаем поле ввода
        userInput.value = '';
        
        // Анимация отправки
        animateSendMessage();
        
        // Показываем индикатор загрузки
        showLoading();
        
        try {
            // Отправляем запрос к бэкенду
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({message: userMessage})
            });
            
            const data = await response.json();
            
            // Скрываем индикатор загрузки
            hideLoading();
            
            // Добавляем ответ от ИИ с анимацией
            addMessageToChat(data.reply, false);
            
        } catch (error) {
            // Скрываем индикатор загрузки
            hideLoading();
            
            // Показываем сообщение об ошибке
            addMessageToChat('Произошла ошибка при получении ответа. Пожалуйста, попробуйте еще раз.', false);
            console.error('Error:', error);
        }
    });

    // Добавляем обработчик события для кнопки очистки истории
    const clearHistoryBtn = document.getElementById('clear-history-btn');
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', function() {
            // Показываем запрос на подтверждение
            if (confirm('Вы уверены, что хотите очистить историю сообщений?')) {
                // Очищаем историю сообщений в браузере
                chatBox.innerHTML = '';
                
                // Также очищаем историю в localStorage, если она там хранится
                try {
                    localStorage.removeItem('chatHistory');
                } catch (e) {
                    console.log('Не удалось очистить историю из localStorage:', e);
                }
            }
        });
    }

    // Поддержка отправки по Enter
    userInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            chatForm.dispatchEvent(new Event('submit'));
        }
    });

    // Инициализация прокрутки к последнему сообщению
    if (chatBox.children.length > 0) {
        setTimeout(() => {
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 100);
    }

    // Анимация при наведении на сообщения
    chatBox.addEventListener('mouseover', function(e) {
        if (e.target.classList.contains('message')) {
            e.target.style.transform = 'translateY(-2px)';
        }
    });

    chatBox.addEventListener('mouseout', function(e) {
        if (e.target.classList.contains('message')) {
            e.target.style.transform = 'translateY(0)';
        }
    });
});

// Дополнительные анимации при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const messages = document.querySelectorAll('.message');
    
    // Анимация для существующих сообщений
    messages.forEach((message, index) => {
        // Добавляем небольшую задержку для каждой анимации
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translateY(10px)';
            message.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                message.style.opacity = '1';
                message.style.transform = 'translateY(0)';
            }, 50);
        }, index * 100);
    });
});