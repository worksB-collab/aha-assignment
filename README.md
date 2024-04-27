# About This App

This is a Node.js web application includes features like sign-up, sign-in, password reset, and profile management. It
uses a Controller, Service, and DAO architecture to ensure scalability and maintainability, interfacing with Supabase as
the backend database.

## Application Structure

### Architecture Overview

The application is structured into three main layers:

- **Controller Layer**: Handles incoming HTTP requests, validates input, and returns appropriate responses. This layer
  acts as the interface between the user and the application's core functionalities.

- **Service Layer**: Contains the business logic of the application. It processes data received from the Controller,
  enforces business rules, and performs operations like authentication checks, token generation, and email verification.

- **DAO (Data Access Object) Layer**: Manages data persistence and retrieval. It communicates directly with Supabase to
  perform CRUD operations on the database.

### Directory Structure

The application's directory is organized as follows:

### Key Components

- **Controllers**: Define endpoints like `/signup`, `/signin`, and `/logout`, handling user interactions.

- **Services**: Implement the main logic.

- **DAOs**: Interact with the Supabase database to handle all data persistence.

- **Routes**: Centralize the routing logic, ensuring all auth endpoints are secured and accessible as intended.

- **Views**: Contain the HTML files for the user interface, providing forms and profiles that interact with the backend
  via API.

## Installation

1. **Clone the repository**

```bash
   git clone https://github.com/worksB-collab/aha-assignment.git
   cd aha-assignment
   npm install 
```

2. Create a Supabase database

3. Set up environment variables
   Create a .env file in the root directory with necessary credentials:

```
SERVER_URL='Your Server URL'                   # The URL where your server is hosted
GOOGLE_CLIENT_ID='Your Google Client ID'       # Client ID for Google OAuth
GOOGLE_CLIENT_SECRET='Your Google Client Secret' # Client Secret for Google OAuth
EMAIL_USERNAME='Your Email Username'           # Username for email service
EMAIL_PASSWORD='Your Email Password'           # Password for email service
JWT_SECRET='Your JWT Secret'                   # Secret key for signing JWTs
SUPABASE_URL='Your Supabase URL'               # Your Supabase project URL
SUPABASE_KEY='Your Supabase Anon Key'          # Your Supabase service role key
``` 

4. Start the server

```
node api/index.js
```

## Usage

### Running the Application

* Navigate to http://localhost:3000 to view the landing page with options to sign up or sign in.

### Functionalities

* Sign Up: Users can create an account using an email and password or through Google OAuth. The sign-up process includes
  email verification.
* Sign In: Users can log in using their credentials or Google account. Successful login redirects to the user dashboard.
* User Dashboard: After login, users can view system statistic information and update their profile, reset their
  password, and log out.