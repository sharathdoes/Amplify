import React from 'react';
import { FaGithub as Github, FaLinkedin as Linkedin, FaEnvelope as Mail, FaInstagram as Instagram } from 'react-icons/fa';

// Import Google Fonts directly using a <style> tag
export default function Component() {
  return (
    <div className='bg-gray-50' >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200..800;1,200..800&family=Overpass:ital,wght@0,100..900;1,100..900&display=swap');

          .hero-section h1, .hero-section p {
            font-family: 'Karla', sans-serif;
          }
          .hero-section a {
            transition: color 0.3s ease;
          }
          .hero-section a:hover {
            color: black; /* Color on hover */
          }
          .hero-section svg {
            transition: color 0.3s ease;
          }
          .hero-section a:hover svg {
            color: black; /* Color of icons on hover */
          }
        `}
      </style>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'bg-gray-50', // Replace with your background color
          color: '#333', // Replace with your text color
          padding: '1rem',
          fontFamily: `'Karla', sans-serif`,
        }}
      >
        <main
          style={{
            maxWidth: '60rem',
            width: '100%',
            textAlign: 'center',
            marginTop: '2rem',
          }}
        >
          <h1
            style={{
              fontSize: '3rem', // Adjust size as needed
              fontWeight: '600',
              lineHeight: '1.2',
              marginBottom: '1rem',
              fontFamily: `'Karla', sans-serif`,
            }}
          >
            Why Amplify ?
          </h1>
          <p
            style={{
              fontSize: '1.28rem', // Adjust size as needed (80% of original size)
              maxWidth: '45rem',
              margin: '0 auto',
              color: '#666', // Replace with your text color
              fontFamily: `'Karla', sans-serif`,
            }}
          >
Amplify revolutionizes job searching by using NLP to analyze resumes and match job seekers with personalized opportunities. Unlike traditional job boards, Amplify tailors job listings based on the roles identified in the seeker’s resume.

What sets Amplify apart is its mock test feature. Job seekers must complete a test related to the job they are applying for, with their scores determining their eligibility to apply and unlock referral option from recruiters. 

For recruiters, Amplify simplifies job management with tools for posting, updating, and deleting job listings. The platform also offers resume skill gap analysis, helping Seekers make more effective changes.          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1.5rem',
              marginTop: '2rem',
            }}
          >
            <a
              href="https://github.com/sharathdoes/amplify"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#666', // Replace with your text color
              }}
            >
              <Github style={{ height: '2rem', width: '2rem' }} />
              <span style={{ position: 'absolute', width: '0', height: '0', overflow: 'hidden' }}>GitHub</span>
            </a>
            <a
              href="https://www.linkedin.com/in/sharath-chandra-gaddam-851a45263/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#666', // Replace with your text color
              }}
            >
              <Linkedin style={{ height: '2rem', width: '2rem' }} />
              <span style={{ position: 'absolute', width: '0', height: '0', overflow: 'hidden' }}>LinkedIn</span>
            </a>
            <a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=sharath7693@gmail.com&su=from%20amplify%20website"
              style={{
                color: '#666', // Replace with your text color
              }}
            >
              <Mail style={{ height: '2rem', width: '2rem' }} />
              <span style={{ position: 'absolute', width: '0', height: '0', overflow: 'hidden' }}>Email</span>
            </a>
            <a
              href="https://www.instagram.com/sharath_7693/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#666', // Replace with your text color
              }}
            >
              <Instagram style={{ height: '2rem', width: '2rem' }} />
              <span style={{ position: 'absolute', width: '0', height: '0', overflow: 'hidden' }}>Instagram</span>
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
