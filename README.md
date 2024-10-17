
# Amplify - Job Optimization Platform

Amplify connects eligible job seekers with referral opportunities through machine learning assessments, streamlining the path to employment for qualified candidates.

The platform is hosted at: [Amplify](https://amplify-4.onrender.com)
& Flask server is hosted at [here](https://amplify-5.onrender.com) ( first run flask server )

![image](https://github.com/user-attachments/assets/1894d6fd-7e28-42bb-80be-430038b2769e)

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
- [Contributing](#contributing)
- [License](#license)
  
## Overview

Amplify is an innovative platform designed to fill a crucial gap in the job market by offering a dedicated referral system for qualified candidates. Unlike traditional job platforms, Amplify focuses on connecting eligible job seekers with referral opportunities. Using advanced machine learning models and tailored assessments, Amplify evaluates users' skills and qualifications. Upon successfully passing these assessments, candidates receive referrals from industry professionals, offering a direct and trusted pathway to employment. 

## Features

### For Job Seekers

1. **Resume Upload & Analysis**: Upload your resume, our machine learning algorithms will analyze to match the best carreer paths.
2. **Mock Test**: Take a mock test designed to evaluate your readiness for job roles. Your test score impacts your ability to apply for specific jobs.
3. **Job Recommendations**: Receive personalized job recommendations based on your resume and test results.
4. **Referral System**: Unlock referral options after completing the mock test.
5. **Skill Gap Analysis**: Get personalized skill recommendations on your resume with help of **Gemini**.

### For Recruiters

1. **Job Posting Management**: Post new job openings, edit existing ones, and track applications.
2. **Mock Test Questions**: Add custom mock test questions or use **Gemini** to Generate that will help you better assess the candidates.

## How It Works

### Machine Learning-based Resume Analysis

Amplify leverages **NLP** to analyze resumes, extracting key information such as skills, experience, and education. The ML model matches these attributes against job requirements from our database to suggest the most relevant job postings to the candidate.

### Mock Test Functionality

The platform provides job seekers with a mock test that evaluates their aptitude and readiness for job roles. Based on the test results:
- Candidates can access job referrals and apply for specific roles.
- Recruiters can assess a candidate's suitability for their job openings.
- **Suspicious Activity Alerts**: Automated alerts are sent to the admins if any unusual behavior (e.g., excessive tab switches or multiple fullscreen exits) is detected.
  
## Tech Stack

Amplify is built with the following technologies:

- **Frontend**: React.js, Tailwind CSS, ShadCN 
- **Backend**: Express.js, Node.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JSON Web Tokens (JWT), Google OAuth for recruiters
- **Machine Learning**: Custom ML model for resume parsing and analysis
- **Hosting**: Render

## Installation and Setup

Setting up Amplify is quick and straightforward:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/sharathdoes/amplify.git
   cd amplify
   ```

2. **Navigate to the Backend Folder**
   ```bash
   cd backend
   ```

3. **Build the Project**
   ```bash
   npm run build
   ```

4. **Start the Application**
   ```bash
   npm start
   ```

Once the backend server is running, you can access the platform in your browser. 

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


