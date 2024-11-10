ДЗ нетология Задание 2.
В файле docker compose.yml описывается 3 сервиса: redis,library(основное приложение) и counter(доп приложение - счетчик).
Все образы для запуска через docker compose up опубликованны на docker hub:
- antonchik/library - образ главного приложения
- antonchik/counter - образ счетчика
- redis - бд
Ссылка Docker Hub: https://hub.docker.com/repositories/antonchik

Передачу количества просмотров между приложениями реализовал через модуль axios и get/post запросы по внутренней сети docker compose. 

Счетчик отображается в веб интерфесе главного приложения по маршруту /api/books/:id в блоке desc(после нескольких слэшей).

На гит хабе код главного приложения и файл docker-compose.yml
