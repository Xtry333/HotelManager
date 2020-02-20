# System wewnętrznego zarządzania obiektem hotelowym
Szczegółowo opisany został w pracy inynierskiem tego samego autora pod tytułem "Projekt i implementacja systemu wewnętrznego zarządzania obiektem hotelowym".

# Uruchamianie
Uruchomienie systemu odbywa się poprzez platformę _node.js_ w wersji _13.8.0_
System posiada dwa podsystemy. Pierwszym z nich jest serwer, znajdujący się w katalogu `server/`. Drugi to klient w katalogu `client-react/`
* Uruchomienie serwera deweloperskiego odbywa się poleceniem:
```bash
$ cd server/
$ npm run dev
```
* Podobnie z częścią front-endową:
```bash
$ cd client-react/
$ npm run dev
```

Serwer łączy się z bazą danych mysql, dane do połączenia przechowywane są w pliku `server/js/credentials.ts`
Jeśli plik nie istnieje naley utworzyć go w wyżej wymienionej lokacji naley go utworzyć i wypełnić danymi:
```ts
export const username = 'login';
export const password = 'hasło';
export const database = 'nazwa_bazy_danych';
```
Projekt bazy danych znajduje się w pliku `hotelmanager.sql`
