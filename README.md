# Проект Mesto: бэкенд
Представляет собой API со следующими возможностями:

* Регистрация пользователя: SERVER_NAME/api/signup
* Логин пользователя: SERVER_NAME/api/signin
* Logout пользователя: SERVER_NAME/api/signout
* Получить всех пользователей: SERVER_NAME/api/users (метод GET)
* Получить данные текущего пользователя: SERVER_NAME/api/users/me (метод GET)
* Получить данные пользователя по id: SERVER_NAME/api/users/userID (метод GET)
* Обновить данные текущего пользователя: SERVER_NAME/api/users/me (метод PATCH)
* Обновить аватара текущего пользователя: SERVER_NAME/api/users/me/avatar (метод PATCH)
* Добавление карточки: SERVER_NAME/api/cards (метод POST)
* Получение карточек: SERVER_NAME/api/cards (метод GET)
* Удаление карточки: SERVER_NAME/api/cards/cardID (метод DELETE)
* Поставить лайк карточке: SERVER_NAME/api/cards/cardID/likes (метод PUT)
* Удалить лайк у карточки: SERVER_NAME/api/cards/cardID/likes (метод DELETE)



## Директории

`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и карточки   
`/models` — папка с файлами описания схем пользователя и карточки  
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


