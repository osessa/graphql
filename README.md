# Reboot01 Student Dashboard

A modern student dashboard built using HTML, CSS, and JavaScript.

The application authenticates users through the Reboot01 API, retrieves student data using GraphQL, and displays personalized statistics including XP progress, audit information, project results, and profile details.

---

## Live Demo

**Website:** https://osessa.github.io/graphql/

---

## Features

### Authentication

* Secure login using Reboot01 credentials
* JWT token authentication
* Protected dashboard pages
* Automatic logout when token is invalid or expired
* Logout functionality

### Dashboard

* Total XP display
* Current Level display
* Audit Ratio statistics
* Total Audit Up and Total Audit Down
* XP Progress Over Time (SVG Chart)
* Project Results (SVG Donut Chart)

### Profile

* Full Name
* Username
* User ID
* Email Address
* Member Since Date

---

## Technologies Used

* HTML
* CSS
* JavaScript
* GraphQL
* SVG
* JWT Authentication

---

## Project Structure

```text
project/
│
├── images/
│   ├── Logo.png
│   └── background.png
│
├── js/
│   ├── auth.js
│   ├── login.js
│   ├── dashboard.js
│   ├── profile.js
│   └── charts.js
│
├── styles/
│   ├── login.css
│   └── profile.css
│
├── index.html
├── profile.html
└── README.md
```

---

## Authentication Flow

```text
User Login
     │
     ▼
Reboot01 API Authentication
     │
     ▼
JWT Token Stored in Local Storage
     │
     ▼
Dashboard Access Granted
```

If the token becomes invalid or expires:

```text
Invalid Token
     │
     ▼
Token Removed
     │
     ▼
Redirect To Login Page
```

---

## GraphQL Data Retrieved

The dashboard retrieves:

* User Information
* XP Transactions
* Audit Transactions
* Level Information
* Project Progress

Example query:

```graphql
{
  user {
    id
    login
    firstName
    lastName
    email
    createdAt
  }
}
```

---

## Security Features

* JWT-based authentication
* Protected routes
* Token validation
* Automatic logout on invalid session
* Input validation
* HTTPS communication with API
* No password storage

---

## Installation

Clone the repository:

```bash
git clone https://github.com/osessa/graphql.git
```

Open the project folder and start a local server.

Example using VS Code Live Server:

```bash
Right Click -> Open with Live Server
```

---

## Author

**Osama Essa**
GitHub: @osessa
Gitea: @osessa

Developed as part of the Reboot01 GraphQL project.
