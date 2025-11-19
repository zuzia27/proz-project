# System Ewidencji Sprzętu Medycznego

Aplikacja klient–serwer do zarządzania sprzętem medycznym w placówce zdrowia.  
Frontend w **React + Tailwind CSS**, backend w **Spring Boot + H2**.

---

##  Funkcje

- Przeglądanie listy sprzętu z filtrowaniem
- Sortowanie po nazwie lub dacie przeglądu
- Dodawanie nowego sprzętu 
- Zmiana statusu urządzenia (ręczna oraz autmatyczna)
- Generowanie raportów PDF
- Dashboard ze statystykami 

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

```
├── backend/
│   └── sprzet/
│       ├── src/main/java/pl/proz/sprzet/
│       │   ├── controller/      # REST API endpoints
│       │   ├── service/         # Logika biznesowa
│       │   ├── repository/      # Dostęp do bazy
│       │   ├── model/           # Encje
│       │   └── report/          # Generowanie PDF
│       └── src/main/resources/
│           └── application.properties
│
└── frontend/
    ├── src/
    │   ├── api/api.js           # Komunikacja z backendem
    │   ├── components/          # Komponenty React
    │   │   ├── Dashboard.jsx
    │   │   ├── EquipmentTable.jsx
    │   │   ├── EquipmentForm.jsx
    │   │   └── StatusBadge.jsx
    │   └── utils/statusLogic.js # Pomocnicze funkcje
    └── .env
```


---

## Uruchomienie aplikacji

### Wymagania

- **Java 17+**
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
```

Aplikacja backendowa uruchomi się na: `http://localhost:8080`

---

### Uruchomienie frontendu (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

Frontend uruchomi się na: `http://localhost:3000`

---

## Konfiguracja
### Zmienne środowiskowe

W katalogu `frontend` utwórz plik `.env`:

```
VITE_API_URL=http://localhost:8080/api
```

---

### Dostęp do H2 Console

- **Adres:** `http://localhost:8080/h2-console`
- **JDBC URL:** `jdbc:h2:file:./data/sprzetdb`
- **Login:** `sa`
- **Hasło:** (puste)

Dane zapisywane w: `backend/sprzet/data/sprzetdb.mv.db`

---

## REST API

### Przykładowy obiekt Sprzet:
```json
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
```

**Dopuszczalne statusy:** `SPRAWNY`, `W_NAPRAWIE`, `WYMAGA_PRZEGLADU`, `WYCOFANY`

---

### Endpointy:

| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | `/api/sprzet` | Lista wszystkich urządzeń |
| GET | `/api/sprzet?status=SPRAWNY` | Lista wg statusu |
| POST | `/api/sprzet` | Dodanie nowego sprzętu |
| PATCH | `/api/sprzet/{id}/status` | Zmiana statusu (z opcjonalną datą przeglądu) |
| GET | `/api/raport` | Generowanie raportu PDF |
| GET | `/api/raport?status=SPRAWNY` | Raport PDF dla wybranego statusu |
