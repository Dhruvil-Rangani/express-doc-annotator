# Express Doc Annotator

<p align="center">
  <img src="[LINK_TO_A_GIF_OF_YOUR_APP_IN_ACTION]" alt="Express Doc Annotator Demo" width="800"/>
</p>

<p align="center">
  A full-stack web application designed to simulate a document processing pipeline, built with a modern tech stack mirroring the engineering environment at EvenUp. The application allows users to upload documents, tracks the processing status in real-time via API polling, and displays the final state, demonstrating a complete asynchronous workflow from frontend to backend.
</p>

<p align-center>
  <a href="[LINK_TO_YOUR_DEPLOYED_APP]">
    <img src="https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel" alt="Live Demo"/>
  </a>
</p>

## ✨ Features

* **Drag-and-Drop File Upload:** A sleek, modern interface for selecting files.
* **Real-time Progress Tracking:** The frontend polls the backend to provide users with live status updates (`PENDING`, `PROCESSING`, `SUCCESS`).
* **Asynchronous Job Processing:** The Django backend simulates a background worker task using `threading`, mimicking a real-world asynchronous architecture.
* **Dynamic UI:** The interface is built with React and updates dynamically based on server state managed by TanStack Query (`react-query`).
* **Component-Driven Design:** All UI components were developed in isolation and documented with Storybook.

## 💻 Tech Stack

This project was built with a specific, modern tech stack to demonstrate proficiency in technologies used in high-growth startups.

| Frontend                               | Backend                                    |
| -------------------------------------- | ------------------------------------------ |
| **Framework:** React 19 (w/ Vite)      | **Framework:** Python 3, Django            |
| **Language:** TypeScript               | **API:** Django REST Framework             |
| **Styling:** Tailwind CSS & shadcn/ui  | **Database:** PostgreSQL (Neon.tech Cloud) |
| **State Management:** TanStack Query   | **Async:** `threading` (Celery simulation) |
| **Testing:** Vitest, Playwright        | **CORS:** `django-cors-headers`            |
| **Tooling:** Storybook, `lucide-react` | **Env Vars:** `python-dotenv`              |
| **API Client:** Axios                  | **DB Driver:** `psycopg2-binary`           |

## 🧠 Architecture & Decisions

This project wasn't just about coding; it was about making deliberate engineering decisions.

1.  **Why this Stack?**
    The technology stack was explicitly chosen to align with the known stack at EvenUp. The combination of a **React/TypeScript frontend** and a **Python/Django backend** demonstrates a direct fit and reduces onboarding friction.

2.  **Frontend: `shadcn/ui` over a traditional library**
    Instead of using a pre-built library like MUI, I chose `shadcn/ui`. This aligns with the modern trend of owning your own components and building a custom design system with tools like Tailwind CSS, a practice EvenUp is moving towards. It shows an understanding of maintainable, scalable design systems.

3.  **State Management: `react-query` as the single source of truth**
    All server state, including the creation of jobs and the polling of their status, is handled exclusively by TanStack Query. This is a deliberate choice over mixing `useState` with `useEffect` for data fetching, as it provides robust caching, automatic refetching, and a clean separation of client vs. server state.

4.  **Backend: Simulating Async with `threading`**
    To demonstrate a complete asynchronous workflow without the heavy setup of Celery and Redis/RabbitMQ for a portfolio project, Python's built-in `threading` module was used. The API returns a response instantly while the "processing" happens in a background thread. This was a pragmatic choice to prove the architectural concept effectively.

5.  **Database: Cloud-hosted PostgreSQL**
    Using a serverless PostgreSQL instance from Neon.tech, rather than a local SQLite database, demonstrates experience with cloud services and makes the project more representative of a real-world production environment.

## 🛠️ Local Development Setup

To run this project locally, follow these steps:

#### Prerequisites

* Node.js (v18 or later)
* Python 3.8+
* A PostgreSQL database (local or cloud-hosted)

---

#### 1. Clone the Repository

```bash
git clone [LINK_TO_YOUR_GITHUB_REPO]
cd express-doc-annotator
```

#### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create and activate a Python virtual environment
python3 -m venv venv
source venv/bin/activate
# On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt 
# (Note: You may need to create a requirements.txt file first with `pip freeze > requirements.txt`)

# Create a .env file and add your database URL
# (See .env.example)
cp .env.example .env
# Now, edit .env with your PostgreSQL connection string

# Run database migrations
python manage.py migrate

# Start the Django server
python manage.py runserver
# The backend will be running at [http://127.0.0.1:8000](http://127.0.0.1:8000)
```
**`.env.example`**
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME
```

---

#### 3. Frontend Setup

```bash
# Open a new terminal window
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the React development server
npm run dev
# The frontend will be running at http://localhost:5173
```

## 👤 Contact

**Dhruvil Rangani**

* **Portfolio:** [dhruvilrangani.com](https://dhruvilrangani.com)
* **GitHub:** [@Dhruvil-Rangani](https://github.com/Dhruvil-Rangani)
* **LinkedIn:** [Linkedin](https://linkedin.com/in/dhruvilrangani007)
