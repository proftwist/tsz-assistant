from flask import Flask, render_template, request, jsonify
from models import db, ChatHistory, chat_with_llm

# Инициализация Flask-приложения и настройка подключения к базе данных SQLite
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///site.db"
db.init_app(app)

@app.route("/")
def home():
    """
    Обрабатывает GET-запросы к главной странице.
    
    Извлекает историю чата из базы данных, сортируя записи по времени создания,
    и передает их в шаблон index.html для отображения.
    
    Returns:
        Response: Отрендеренный шаблон index.html с историей чата.
    """
    chat_history = ChatHistory.query.order_by(ChatHistory.timestamp.asc()).all()
    return render_template("index.html", chat_history=chat_history)


@app.route("/chat", methods=["POST"])
def chat():
    """
    Обрабатывает POST-запросы к эндпоинту чата.
    
    Принимает JSON с сообщением пользователя, передает его в LLM для генерации ответа,
    сохраняет историю чата в базе данных и возвращает JSON с ответом LLM.
    
    Returns:
        Response: JSON-объект с ответом от LLM.
    """
    data = request.get_json()
    user_message = data.get("message", "")

    llm_reply = chat_with_llm(user_message)
    # Save to chat history
    new_entry = ChatHistory(user_message=user_message, llm_reply=llm_reply)
    db.session.add(new_entry)
    db.session.commit()
    return jsonify({"reply": llm_reply})


if __name__ == "__main__":
    """
    Точка входа для запуска приложения.
    
    Создает все таблицы в базе данных, если они еще не существуют,
    и запускает Flask-приложение в режиме отладки.
    """
    with app.app_context():
        db.create_all()
    app.run(debug=True)
