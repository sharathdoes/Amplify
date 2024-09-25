
# Amplify - Job Optimization Platform

Amplify is an innovative platform designed to bridge the gap between job seekers and recruiters using machine learning models, mock assessments, and optimized job matching. The platform tailors job opportunities to the users' unique skill sets, providing them with personalized career guidance and growth opportunities.

The platform is hosted at: [Amplify](https://amplify-4.onrender.com/#)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
  - [For Job Seekers](#for-job-seekers)
  - [For Recruiters](#for-recruiters)
- [How It Works](#how-it-works)
  - [Machine Learning-based Resume Analysis](#machine-learning-based-resume-analysis)
  - [Mock Test Functionality](#mock-test-functionality)
- [Tech Stack](#tech-stack)
- [Installation and Setup](#installation-and-setup)
- [API Documentation](#api-documentation)
- [Contributing](#contributing)
- [License](#license)
  
## Overview

Amplify provides a seamless experience for job seekers to discover and apply for jobs tailored to their skills. Recruiters can manage job postings and match qualified candidates using our machine learning-powered system. The platform ensures that job seekers improve their chances by taking mock tests and optimizing their resumes for better visibility to recruiters.

## Features

### For Job Seekers

1. **Resume Upload & Analysis**: Upload your resume, and our machine learning algorithms will analyze and suggest improvements to match the best job opportunities.
2. **Mock Test**: Take a mock test designed to evaluate your readiness for job roles. Your test score impacts your ability to apply for specific jobs.
3. **Job Recommendations**: Receive personalized job recommendations based on your resume and test results.
4. **Referral System**: Unlock referral options after completing the mock test.
5. **Track Applications**: Keep track of all job applications and get real-time feedback.

### For Recruiters

1. **Job Posting Management**: Post new job openings, edit existing ones, and track applications.
2. **Candidate Matching**: Use our ML-powered system to filter the best candidates from hundreds of applications based on resumes and mock test results.
3. **Mock Test Questions**: Add custom mock test questions that will help you better assess the candidates.
4. **Sign in via Google**: Seamless authentication for recruiters using their Google accounts.
5. **Feedback Mechanism**: Provide feedback on the candidates for future improvements.

## How It Works

### Machine Learning-based Resume Analysis

Amplify leverages machine learning to analyze resumes, extracting key information such as skills, experience, and education. The ML model matches these attributes against job requirements from our database to suggest the most relevant job postings to the candidate.

### Mock Test Functionality

The platform provides job seekers with a mock test that evaluates their aptitude and readiness for job roles. Based on the test results:
- Candidates can access job referrals and apply for specific roles.
- Recruiters can assess a candidate's suitability for their job openings.
  
## Tech Stack

Amplify is built with the following technologies:

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT), Google OAuth for recruiters
- **Machine Learning**: Custom ML model for resume parsing and analysis
- **Hosting**: Render

## Installation and Setup

To run Amplify locally, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Git](https://git-scm.com/)

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/amplify.git
   cd amplify
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**

   Create a `.env` file in the root of the project and set the following variables:

   ```
   MONGO_URI=your_mongo_db_connection_string
   JWT_SECRET=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_oauth_client_id
   GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
   ```

4. **Run the Application**
   ```bash
   npm start
   ```

   The server will run on `http://localhost:3000`.

5. **Access the Frontend**
   Visit `http://localhost:3000` to see Amplify in action!

## API Documentation

Amplify exposes a REST API for managing users, jobs, and other key features.

### Authentication

- **POST** `/api/auth/signup`: Sign up a new user (job seeker).
- **POST** `/api/auth/login`: Login an existing user (job seeker).
- **POST** `/api/auth/google`: Login a recruiter via Google OAuth.

### Job Seeker Routes

- **GET** `/api/jobs`: Fetch available jobs for the job seeker.
- **POST** `/api/resume/upload`: Upload and analyze the job seeker's resume.
- **POST** `/api/mocktest/submit`: Submit mock test results.

### Recruiter Routes

- **POST** `/api/jobs`: Create a new job posting.
- **PUT** `/api/jobs/:id`: Update an existing job posting.
- **GET** `/api/applicants`: View candidates who have applied for a job.

_For a complete list of API endpoints, refer to the [API Documentation](docs/API.md)._

## Contributing

We welcome contributions from the community to improve Amplify. If you have any suggestions or would like to report a bug, feel free to open an issue or submit a pull request.

### How to Contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch-name`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch-name`).
6. Open a Pull Request.

Please ensure that your contributions adhere to our [Code of Conduct](CODE_OF_CONDUCT.md).

## License

Amplify is released under the [MIT License](LICENSE).

---

This README should give others a clear understanding of what your platform offers and how they can get involved or use it! Feel free to adjust any sections to better fit your project.
