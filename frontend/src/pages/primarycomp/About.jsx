import React from 'react';
import { FaGithub } from 'react-icons/fa';
import Footer from './Footer'
const About = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg text-center mt-[-10%]">
        <h1 className="text-2xl font-bold mb-4">About Amplify</h1>
        <p className="text-gray-700 mb-6">
        Amplify is a platform designed to enhance job opportunities for both job seekers and recruiters, by analyzing resumes with NLP to match them with relevant roles. Job seekers can apply for jobs and unlock referral options based on their mock test scores. Recruiters can manage job postings, including test questions and scoring, with Google sign-in. Amplify also provides resume analysis to improve job seeker profiles. 
      </p>  <p href="https://github.com/sharath7693" className="text-gray-500 ">sharath7693</p>
      </div>
      <Footer />

    </div>
  );
};

export default About;
