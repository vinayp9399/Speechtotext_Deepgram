# VoiceScribe — Speech-to-Text Application

---

## Introduction

VoiceScribe is a full-stack web application that converts spoken audio into written text. Users can either upload a pre-recorded audio file or record audio directly in their browser. The audio is then sent to the Deepgram API, which processes it using an advanced AI model and returns an accurate transcription. The result is saved to a database and can be accessed at any time from the user's transcription history.

The application is built on the MERN stack (MongoDB, Express.js, React, Node.js) and is designed to be simple, fast, and accessible. It includes user authentication so that each user has a private, secure space to store and manage their transcriptions.

The goal of VoiceScribe is to demonstrate how modern web technologies and AI-powered APIs can be combined to solve a real-world problem — turning voice into structured, searchable text.

Live link- https://speechtotext-deepgram.vercel.app/

---

## Use Cases

**1. Students & Academics**
Students can record lectures, seminars, or study notes and instantly convert them to text. This makes it easier to review content, create summaries, and study efficiently without manually typing out notes.

**2. Journalists & Content Creators**
Journalists can record interviews and transcribe them within seconds instead of spending hours typing. Content creators can transcribe podcast episodes or video scripts for captions and blog posts.

**3. Medical Professionals**
Doctors and nurses can dictate patient notes, prescriptions, or observations verbally and have them transcribed automatically, reducing paperwork time and improving accuracy.

**4. Business Meetings**
Teams can record meetings and transcribe them for documentation, follow-ups, and sharing with team members who were absent.

**5. Accessibility**
People with hearing impairments can use transcriptions to follow along with audio content. People with typing difficulties can use voice as their primary input method.

**6. Legal & Compliance**
Legal professionals can transcribe hearings, depositions, and client consultations for records and documentation.

---

## Industry Value

Speech-to-text technology is one of the fastest-growing segments in artificial intelligence. According to industry research, the global speech and voice recognition market is projected to grow significantly over the coming years, driven by demand across healthcare, legal, education, and enterprise sectors.

**Why this matters:**

- **Productivity** — Humans speak approximately 3x faster than they type. Converting speech to text allows information to be captured much faster and more naturally.
- **Data Accessibility** — Audio is unstructured data. Transcribing it turns it into searchable, indexable, and analyzable text that can be stored, shared, and processed.
- **AI Integration** — Transcribed text can be fed into further AI pipelines for summarization, sentiment analysis, translation, and keyword extraction, making it a foundational step in many AI workflows.
- **Cost Reduction** — Automating transcription eliminates the need for manual transcription services, reducing costs significantly for businesses that deal with large volumes of audio.

VoiceScribe demonstrates how a developer can build a production-ready transcription tool by combining a modern web stack with an industry-grade speech API, making this kind of technology accessible without building the AI model from scratch.

---

## Technologies Used

### React.js
React is a JavaScript library for building user interfaces. It uses a component-based architecture where the UI is broken into reusable pieces. 

### Vite
Vite is a modern build tool and development server for frontend projects. 

### Tailwind CSS
Tailwind CSS is a utility-first CSS framework. Instead of writing custom CSS classes, you apply small, single-purpose utility classes directly in your HTML/JSX. This speeds up styling significantly and keeps the design consistent.

### Node.js
Node.js is a JavaScript runtime built on Chrome's V8 engine that allows JavaScript to run on the server. 

### Express.js
Express.js is a minimal and flexible web framework for Node.js. It provides a simple way to define routes, handle HTTP requests, apply middleware, and send responses. 

### MongoDB
MongoDB is a NoSQL document database that stores data in flexible, JSON-like documents called BSON. Unlike relational databases, MongoDB does not require a fixed schema, making it easy to store varied data structures. 

### Deepgram API
Deepgram is an AI-powered speech recognition platform. It uses deep learning models trained on large audio datasets to provide fast and accurate transcriptions. VoiceScribe uses Deepgram's `nova-2` model, which is Deepgram's most accurate general-purpose model. 

### Multer
Multer is a Node.js middleware for handling `multipart/form-data`, which is the format used for file uploads. It intercepts incoming file upload requests, validates the file type and size, and saves the file to a temporary location on the server.

### JSON Web Tokens (JWT)
JWT is an open standard for securely transmitting information between parties as a digitally signed token. When a user logs in, the server generates a JWT containing the user's ID and signs it with a secret key.

### bcryptjs
bcryptjs is a library for hashing passwords. It uses the bcrypt algorithm which is specifically designed to be slow and computationally expensive, making it resistant to brute-force attacks.

### Axios
Axios is a promise-based HTTP client for making API requests from the browser. It supports request/response interception, automatic JSON parsing, timeout configuration, and cleaner error handling than the native Fetch API.

---

## Tech Stack Rationale

### Why MERN?
The MERN stack uses JavaScript across both the frontend and backend. This means a single developer can work on the entire application without switching languages. The ecosystem is large, well-documented, and has strong community support.

### Why Deepgram over Google Speech-to-Text or OpenAI Whisper?
Deepgram was chosen for three reasons. First, it provides a generous free tier suitable for development and testing. Second, its Node.js SDK is straightforward to integrate with an Express backend. Third, the `nova-2` model offers high accuracy with fast response times compared to alternatives.

### Why MongoDB over SQL?
Transcription data is semi-structured — each transcription has core fields but also optional metadata like confidence scores, duration, and error messages that may or may not be present. MongoDB's flexible document model handles this naturally without requiring schema migrations. It also pairs well with Node.js since both work natively with JSON.

### Why JWT over Sessions?
JWT authentication is stateless — the server does not need to store session data. This makes the application easier to scale and deploy. The token is stored on the client and sent with each request, keeping the backend simple and free of session management overhead.

### Why Tailwind CSS?
Tailwind removes the need to write and maintain separate CSS files. Styles are applied directly in JSX using utility classes, keeping styling co-located with the component it belongs to. This speeds up development and makes the codebase easier to maintain.

---

## Application Flow

### User Registration & Login Flow

```
User fills Register form
        │
        ▼
POST /api/auth/register
        │
        ▼
Validate name, email, password
        │
        ▼
Hash password with bcryptjs
        │
        ▼
Save User to MongoDB
        │
        ▼
Generate JWT token
        │
        ▼
Return token to frontend
        │
        ▼
Store token in localStorage
        │
        ▼
Redirect to Home page
```

---

### Audio Upload & Transcription Flow

```
User selects file or records audio
              │
              ▼
Click "Transcribe Audio" button
              │
              ▼
POST /api/upload (with Bearer token)
              │
              ▼
auth middleware verifies JWT
              │
              ▼
Multer validates file type & size
              │
        ┌─────┴─────┐
     Invalid       Valid
        │             │
        ▼             ▼
   Return 400    Save pending record
   error         to MongoDB
                      │
                      ▼
              Send audio to Deepgram
                      │
                 ┌────┴────┐
              Failed     Success
                 │           │
                 ▼           ▼
           Save "failed"   Save transcript,
           status to DB    confidence, duration
                           to MongoDB
                                │
                                ▼
                        Return transcription
                        to frontend
                                │
                                ▼
                        Display result
                        on screen
```

---

### Transcription History Flow

```
User navigates to /history
          │
          ▼
GET /api/transcriptions (with Bearer token)
          │
          ▼
auth middleware verifies JWT
          │
          ▼
Query MongoDB for transcriptions
where userId = logged-in user
          │
          ▼
Return list sorted by newest first
          │
          ▼
Render each transcription as a card
showing filename, date, confidence,
duration, transcript text, status
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login, receive JWT | No |

### Upload
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/upload` | Upload audio, transcribe, save to DB | Yes |

### Transcriptions
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/transcriptions` | Get logged-in user's transcriptions | Yes |
| GET | `/api/transcriptions/:id` | Get a single transcription | Yes |
| DELETE | `/api/transcriptions/:id` | Delete a transcription | Yes |

Protected routes require the header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Conclusion

VoiceScribe demonstrates how a developer can build a complete, production-ready speech-to-text application by combining the MERN stack with a powerful AI API. The project covers a wide range of real-world development concepts — REST API design, file handling, third-party API integration, database modeling, user authentication, and modern frontend development with React and Tailwind CSS.

The application has practical value across many industries including education, healthcare, journalism, legal, and business. As speech recognition technology continues to improve, tools like VoiceScribe represent a growing category of applications that bridge human voice and machine-readable text.

