#!/bin/bash

# Скрипт для очистки истории сообщений в базе данных SQLite
# Путь к базе данных
DB_PATH="./instance/site.db"

# Выполняем SQL-запрос для удаления всех записей из таблицы chat_history
sqlite3 "$DB_PATH" "DELETE FROM chat_history;"

# Выводим сообщение об успешной очистке
echo "История сообщений очищена"