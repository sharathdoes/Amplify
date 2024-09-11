from flask import Flask, request, jsonify
import nltk
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from PyPDF2 import PdfReader
from flask_cors import CORS

# Initialize Flask
app = Flask(__name__)
CORS(app)  # Enable CORS

# Initialize NLTK tools
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words('english'))

# Sample role descriptions
roles = {
    'Backend Developer': 'Experience with backend technologies such as Java, Python, SpringBoot, and building RESTful APIs.',
    'Full-Stack Developer': 'Experience in both frontend and backend technologies, including MERN stack, and integration of frontend with backend services.',
    'Machine Learning AI Engineer': 'Experience with machine learning algorithms, data analysis, and implementing predictive models.',
    'Product Manager': 'Experience with managing development teams, understanding user needs, and leading product development initiatives.',
    'Django Developer': 'Experience with Django framework for building web applications and working with databases.',
    'DevOps Engineer': 'Experience with CI/CD pipelines, automation tools, and managing cloud infrastructure.',
    'HR Specialist': 'Experience in human resources management, recruitment, and employee relations.',
    'Cloud Engineer': 'Experience with cloud platforms such as AWS, Azure, or Google Cloud and deploying scalable applications.',
    'Tester/QA Engineer': 'Experience with software testing, quality assurance, and developing test cases.',
    'Java SpringBoot Developer': 'Experience with Java SpringBoot framework for building scalable backend services and applications.',
    'Data Scientist': 'Experience with data analysis, machine learning algorithms, and handling large datasets to extract insights.',
    'UI/UX Designer': 'Experience in user interface and experience design, wireframing, and prototyping for web and mobile applications.',
    'Security Engineer': 'Experience with cybersecurity protocols, network security, and ensuring secure software development practices.',
    'Mobile App Developer': 'Experience with mobile app development using technologies such as Swift, Kotlin, and Flutter for iOS and Android.',
    'Blockchain Developer': 'Experience with blockchain technologies, smart contracts, and decentralized applications.',
    'Game Developer': 'Experience with game development engines such as Unity or Unreal Engine, and knowledge of 3D modeling or animation.',
    'Frontend Developer': 'Experience with frontend technologies such as React, Angular, or Vue, and building responsive user interfaces.',
    'Artificial Intelligence Engineer': 'Experience with AI models, neural networks, and implementing intelligent systems for automation and optimization.',
}


# Preprocessing function
def preprocess_text(text):
    tokens = word_tokenize(text.lower())
    tokens = [lemmatizer.lemmatize(word) for word in tokens if word.isalpha() and word not in stop_words]
    return ' '.join(tokens)

# Extract text from PDF
def extract_text_from_pdf(file):
    pdf_reader = PdfReader(file)
    full_text = ""
    for page in pdf_reader.pages:
        full_text += page.extract_text()
    return full_text

# Endpoint to process the resume
@app.route('/analyze', methods=['POST'])
def analyze_resume():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Extract text from PDF
    resume_text = extract_text_from_pdf(file)

    # Create DataFrame for roles
    role_df = pd.DataFrame(list(roles.items()), columns=['Role', 'Description'])
    role_df['Processed'] = role_df['Description'].apply(preprocess_text)

    # Preprocess resume text
    processed_resume = preprocess_text(resume_text)

    # TF-IDF Vectorizer
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(role_df['Processed'].tolist() + [processed_resume])

    # Calculate similarity scores
    cosine_similarities = cosine_similarity(tfidf_matrix[-1], tfidf_matrix[:-1])
    role_df['Similarity'] = cosine_similarities.flatten()

    # Sort by similarity and get top 2 roles
    role_df_sorted = role_df.sort_values(by='Similarity', ascending=False).head(2)
    top_roles = role_df_sorted['Role'].tolist()

    return jsonify({
        'roles': top_roles,
        'extracted_text': resume_text
    })

if __name__ == '__main__':
    app.run(debug=True)
