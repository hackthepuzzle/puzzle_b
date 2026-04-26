# ElectoGuide – Smart Election Process Assistant

## Project Title
ElectoGuide – Smart Election Process Assistant

## Chosen Vertical
Election Process Education

## Approach & Logic
ElectoGuide is a comprehensive web application designed to educate citizens about the election process. It provides personalized guides depending on the user's persona (first-time voter, student, etc.). A Gemini AI-powered chatbot provides conversational intelligence, guiding the user step-by-step. The backend manages authenticated requests, coordinates with Google APIs (Maps, Calendar) and saves data to Firebase.

## Architecture Diagram
```
[ Frontend (React/Vite) ] <--- API Calls ---> [ Backend (Node.js/Express) ] <---> [ Google Maps / Calendar APIs ]
         |                                           |
         v                                           v
[ Firebase Auth ]                            [ Google Gemini / Vertex AI ]
         |                                           |
         \-------------------------------------------/
                               |
                   [ Firebase Firestore ]
```

## Google Services Used
1.  **Google Maps API**: Integrates into the UI to show nearby polling stations and basic navigation.
2.  **Firebase Auth**: Secure, simple sign-in (email/password, OAuth).
3.  **Firebase Firestore**: Stores personalized user data, conversation state, completed milestones, etc.
4.  **Google Gemini AI**: Parses user intent within the interactive Chatbot, delivering contextual and multi-lingual election assistance.
5.  **Google Calendar API**: Generates event invitations and reminders for Election Days and Voter Registration Deadlines.

## Setup Instructions
1.  Clone this repository or use the directory.
2.  Run `npm install` inside `/frontend`, `/backend`, and `/functions`.
3.  Copy `.env.example` to `.env` in the `/backend` folder and populate your API credentials.
4.  Copy `.env.example` to `.env.local` in the `/frontend` folder, using `VITE_` prefix where required.
5.  Start backend: `cd backend && npm start`
6.  Start frontend: `cd frontend && npm run dev`

## API Setup (GCP steps)
1.  Go to Google Cloud Console.
2.  Create a fresh project "ElectoGuide".
3.  Enable Google Maps Javascript API, Google Calendar API, and Vertex AI/Gemini API.
4.  Generate an API key and OAuth Client ID.
5.  Set up Firebase project -> add Web App -> link it to the GCP project.
6.  Enable Firestore and Auth. Add the Firebase config blob to the frontend environment.

## How it Works
When a user logs in, they select their role (e.g., student, first-time voter). ElectoGuide generates a simple timeline of steps (Registration, Research, Voting Day). The user can talk to the intelligent chatbot (Gemini) right next to their timeline to ask specific questions like "How do I register in Florida?". The assistant pulls info and also can update the user's progress. They can open the Map to find a polling place and schedule a Calendar block to vote.

## Assumptions
- The user has a modern web browser.
- Polling station data is simulated or uses simple geocoding from Google Maps.
- Internet connection is active.

## Future Improvements
- Expand database to support global election rules natively.
- Integrate Google BigQuery to analyze anonymous conversational metrics to improve the chatbot's answers.
- Use Google Cloud Storage to offer downloadable PDF guides.
- Add robust WCAG 2.1 AA screen reader voice-over toggles in the platform.
