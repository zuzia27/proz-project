# System Ewidencji Sprzętu Medycznego

Aplikacja klient–serwer do zarządzania sprzętem medycznym w placówce zdrowia.  
Frontend w **React + Tailwind CSS**, backend w **Spring Boot + H2** (baza plikowa).

---

##  Funkcje

- Przeglądanie listy sprzętu (filtry, sortowanie)
- Dodawanie nowego sprzętu (formularz modalny)
- Zmiana statusu urządzenia z poziomu tabeli
- Kolorowanie terminów przeglądów (zbliża się, po terminie)
- Automatyczna normalizacja statusów (po stronie backendu)
- Trwałe zapisywanie danych w bazie H2 (plikowej)

---

##  Architektura i technologie

| Warstwa | Technologia |
|----------|--------------|
| Frontend | React 18, Vite, Tailwind CSS, Axios |
| Backend  | Spring Boot 3, Spring Data JPA, H2 Database |
| Komunikacja | REST + JSON |
| Inne | Lombok, Gradle, CORS (dla localhost:3000) |

---

## Struktura projektu
├── backend/
│ └── sprzet/
│ ├── src/main/java/pl/proz/sprzet/...
│ └── src/main/resources/application.properties
└── frontend/
├── src/
│ ├── api/api.js
│ ├── components/
│ │ ├── Dashboard.jsx
│ │ ├── EquipmentTable.jsx
│ │ ├── EquipmentForm.jsx
│ │ └── StatusBadge.jsx
│ └── utils/statusLogic.js
└── .env


---

## Uruchomienie aplikacji

### Wymagania

- **Java 17+** (zalecane 21)
- **Node.js 18+ i npm**
- Przeglądarka (Chrome / Edge / Firefox)

---

### Uruchomienie backendu (Spring Boot)

```bash
cd backend/sprzet
# Windows:
gradlew.bat bootRun
# Linux / macOS:
./gradlew bootRun

Aplikacja backendowa uruchomi się na:
 http://localhost:8080

 ### Uruchomienie frontendu (React + Vite)
 cd frontend
npm install
npm run dev

Frontend uruchomi się na:
 http://localhost:3000


Konfiguracja
## Zmienne środowiskowe

W katalogu frontend utwórz plik .env:

VITE_API_URL=http://localhost:8080/api

Dostęp do H2 Console

Adres: http://localhost:8080/h2-console

JDBC URL: jdbc:h2:file:./data/sprzetdb

Login: sa

Hasło: (puste)

Dane są zapisywane w pliku:
backend/sprzet/data/sprzetdb.mv.db


🧩 REST API
{
  "id": 1,
  "name": "Mikroskop X200",
  "model": "X200-PRO",
  "type": "Mikroskop",
  "serialNumber": "SN-001",
  "location": "Laboratorium A",
  "status": "SPRAWNY",
  "nextInspectionDate": "2025-12-10"
}

Dopuszczalne statusy: 
SPRAWNY
W_NAPRAWIE
WYMAGA_PRZEGLADU
WYCOFANY

Endpointy:
Metoda	Endpoint	Opis
GET	/api/sprzet	Lista wszystkich urządzeń
GET	/api/sprzet?status=SPRAWNY	Lista wg statusu
POST	/api/sprzet	Dodanie nowego sprzętu
PATCH	/api/sprzet/{id}/status	Zmiana statusu (z opcjonalną datą przeglądu)

