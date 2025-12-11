# ToDo List App

## Opis projektu
Aplikacja internetowa służąca do zarządzania listami zadań. Umożliwia użytkownikom zakładanie kont, logowanie się oraz tworzenie, edytowanie i usuwanie własnych list zadań. Aplikacja wykorzystuje bazę danych MongoDB do przechowywania informacji.

## Funkcjonalności
- **System uwierzytelniania**: Rejestracja i logowanie użytkowników przy użyciu bezpiecznego hashowania haseł (Argon2).
- **Zarządzanie sesją**: Wykorzystanie ciasteczek (cookies) do utrzymania sesji zalogowanego użytkownika.
- **CRUD dla list zadań**:
  - Wyświetlanie listy zadań.
  - Dodawanie nowych zadań.
  - Edycja istniejących zadań.
  - Usuwanie zadań.
- **Ochrona tras**: Dostęp do zarządzania zadaniami tylko dla zalogowanych użytkowników.

## Instrukcja instalacji i uruchomienia

### Wymagania wstępne
- Node.js
- Docker Desktop 

### Krok 1: Uruchomienie bazy danych (MongoDB)
  - informacje znajdują się w pliku docker.txt

### Krok 2: Instalacja i uruchomienie aplikacji
1. Otwórz terminal w głównym katalogu projektu.
2. Zainstaluj zależności projektu:
   ```bash
   npm install
   ```
3. Uruchom aplikację:
   ```bash
   npm start
   ```
4. Aplikacja będzie dostępna pod adresem: [http://localhost:3000](http://localhost:3000)

## Lista endpointów

### Uwierzytelnianie (Auth)
| Metoda | Ścieżka     | Opis                    |
| ------ | ----------- | ----------------------- |
| `GET`  | `/`         | Formularz logowania     |
| `POST` | `/`         | Logowanie użytkownika   |
| `GET`  | `/register` | Formularz rejestracji   |
| `POST` | `/register` | Rejestracja użytkownika |
| `GET`  | `/logout`   | Wylogowanie             |

### Listy Zadań (ToDoLists) - wymagane logowanie
| Metoda | Ścieżka                 | Opis                               |
| ------ | ----------------------- | ---------------------------------- |
| `GET`  | `/ToDoLists`            | Wyświetlenie wszystkich list zadań |
| `GET`  | `/ToDoLists/add`        | Formularz dodawania nowej listy    |
| `POST` | `/ToDoLists/add`        | Dodanie nowej listy                |
| `GET`  | `/ToDoLists/edit/:id`   | Formularz edycji listy             |
| `POST` | `/ToDoLists/edit/:id`   | Zapisanie zmian w liście           |
| `POST` | `/ToDoLists/delete/:id` | Usunięcie listy                    |

## Technologie
- **Backend**: Node.js, Express.js
- **Baza danych**: MongoDB 
- **Frontend (Szablony)**: EJS 
- **Bezpieczeństwo**: Argon2
- **Inne**: Cookie-parser

## Autorzy
- Przemysław Grabecki 4E

## Licencja
Projekt objęty licencją MIT. Szczegóły w pliku [LICENCE.md](./LICENCE.md).

