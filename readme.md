# System wewnętrznego zarządzania obiektem hotelowym

[![Greenkeeper badge](https://badges.greenkeeper.io/Xtry333/HotelManager.svg)](https://greenkeeper.io/)

Szczegółowo opisany został w pracy inżynierskiej tego samego autora pod tytułem "Projekt i implementacja systemu wewnętrznego zarządzania obiektem hotelowym".

# Uruchamianie
Uruchomienie systemu odbywa się poprzez platformę _node.js_ w wersji _13.8.0_
System posiada dwa podsystemy. Pierwszym z nich jest serwer, znajdujący się w katalogu `server/`. Drugi to klient w katalogu `client-react/`
* Uruchomienie serwera deweloperskiego odbywa się poleceniem:
```bash
$ cd server/
$ npm install
$ npm run dev
```
* Podobnie z częścią front-endową:
```bash
$ cd client-react/
$ npm install
$ npm run dev
```

Serwer łączy się z bazą danych mysql, dane do połączenia przechowywane są w pliku `.env`
Jeśli plik nie istnieje naley utworzyć go w wyżej wymienionej lokacji naley go utworzyć i wypełnić danymi:
```bash
DB_NAME=nazwa_bazy_danych
DB_USERNAME=login
DB_PASSWORD=hasło
```
Projekt bazy danych znajduje się w pliku `hotelmanager.sql`
