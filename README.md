# Проект Mesto: бэкенд
Представляет собой API со следующими возможностями:

* Регистрация пользователя: POST /signup
* Логин пользователя: POST /signin
* Logout пользователя: POST /signout
* Получить всех пользователей: GET /users
* Получить данные текущего пользователя: GET /users/me
* Получить данные пользователя по id: GET /users/userID
* Обновить данные текущего пользователя: PATCH /users/me
* Обновить аватара текущего пользователя: PATCH /users/me/avatar
* Добавление карточки: POST /cards
* Получение карточек: GET /cards
* Удаление карточки: DELETE /cards/cardID
* Поставить лайк карточке: PUT /cards/cardID/likes
* Удалить лайк у карточки: DELETE /cards/cardID/likes



## Директории

`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и карточки   
`/models` — папка с файлами описания схем пользователя и карточки
`/middlewares` — авторизация и логгер

## Как запустить проект локально

* Должна быть установлена MongoDB, название базы - mestodb, MONGODB_URI = 'mongodb://localhost:27017/mestodb'
* Клонируйте проект, разверните его в локальную папку и перейдите в нее
* Убедитесь, что Node.js и NPM установлены
* Установите зависимости:
```shell
npm install
```
* Запуск сервера в dev-режиме с hot-reload:
```shell
npm run dev
```
* Запуск сервера в режиме production:
```shell
npm run start
```
Спасибо за внимание!

## Live demo

API URL: https://mesto.schapov.dev/api


