from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import BartTokenizer, BartForConditionalGeneration, RobertaTokenizer, RobertaForSequenceClassification
import torch
import re
from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from bson import ObjectId
from deep_translator import GoogleTranslator
from scrape import Location, LocationBasedCNNScraper
import asyncio

app = Flask(__name__)
CORS(app)
# Load models and tokenizers
bart_tokenizer = BartTokenizer.from_pretrained('facebook/bart-large-cnn')
bart_model = BartForConditionalGeneration.from_pretrained('facebook/bart-large-cnn')

roberta_tokenizer = RobertaTokenizer.from_pretrained('cardiffnlp/twitter-roberta-base-sentiment')
roberta_model = RobertaForSequenceClassification.from_pretrained('cardiffnlp/twitter-roberta-base-sentiment')

client = MongoClient('mongodb+srv://Sahil:Hello@cluster0.14o0z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
db = client['Cluster0']  # Replace with your database name
collection = db['articles']
# Initialize Google Translator


def clean_text(text):
    # Remove URLs
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    
    # Remove email addresses
    text = re.sub(r'\S+@\S+', '', text)
    
    # Remove phone numbers
    text = re.sub(r'\+?[0-9][0-9\-\s]{7,}[0-9]', '', text)
    
    # Remove special characters and numbers
    text = re.sub(r'[^a-zA-Z\s]', '', text)
    
    # Remove extra whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    
    # Convert to lowercase
    text = text.lower()
    
    return text

def summarize_text(text, max_length=100, min_length=60, length_penalty=1.0):
    inputs = bart_tokenizer.encode("summarize: " + text, return_tensors="pt", max_length=1024, truncation=True)
    summary_ids = bart_model.generate(
        inputs, 
        max_length=max_length, 
        min_length=min_length, 
        length_penalty=length_penalty, 
        num_beams=4, 
        early_stopping=True
    )
    summary = bart_tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return summary

def analyze_sentiment(text):
    inputs = roberta_tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    with torch.no_grad():
        outputs = roberta_model(**inputs)
        logits = outputs.logits
    probabilities = torch.softmax(logits, dim=-1).cpu().numpy()
    predicted_label = torch.argmax(logits, dim=-1).item()
    sentiment_labels = ['Negative', 'Neutral', 'Positive']
    return sentiment_labels[predicted_label], probabilities.tolist()[0]
def translate_to_hindi(text):
    translator = GoogleTranslator(source='en', target='hi')
    return translator.translate(text)
def fetch_articles_by_ids(object_ids):
    object_ids = [ObjectId(id) for id in object_ids]
    query = {'_id': {'$in': object_ids}}
    articles = list(collection.find(query, {'_id': 1, 'Headline': 1}))
    return articles

def get_top_similar_articles(index, cosine_sim_matrix, top_n=20):
    similarity_scores = list(enumerate(cosine_sim_matrix[index]))
    similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
    top_articles = [i[0] for i in similarity_scores[1:top_n+1]]
    return top_articles

@app.route('/summarize_and_sentiment', methods=['POST'])
def summarize_and_sentiment():
    data = request.json
    if 'text' not in data:
        return jsonify({"error": "No text provided"}), 400
    
    text = clean_text(data['text'])
    summary = summarize_text(text)
    sentiment, probabilities = analyze_sentiment(summary)
    
    return jsonify({
        "summary": summary,
        "sentiment": sentiment,
        "probabilities": {
            "Negative": probabilities[0],
            "Neutral": probabilities[1],
            "Positive": probabilities[2]
        }
    })

@app.route('/translate_to_hindi', methods=['POST'])
def translate():
    data = request.json
    if 'text' not in data:
        return jsonify({"error": "No text provided"}), 400
    
    text = clean_text(data['text'])
    try:
        translation = translate_to_hindi(text)
        return jsonify({
            "original_text": text,
            "hindi_translation": translation
        })
    except Exception as e:
        return jsonify({"error": f"Translation failed: {str(e)}"}), 500

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    if 'object_ids' not in data or not isinstance(data['object_ids'], list):
        return jsonify({"error": "Invalid input. Expected an array of object IDs."}), 400

    input_object_ids = data['object_ids']
    input_articles = fetch_articles_by_ids(input_object_ids)

    all_articles = list(collection.find({}, {'_id': 1, 'Headline': 1}))

    input_headlines = [article['Headline'] for article in input_articles]
    all_headlines = [article['Headline'] for article in all_articles]
    combined_headlines = input_headlines + all_headlines

    vectorizer = TfidfVectorizer(stop_words='english')
    tfidf_matrix = vectorizer.fit_transform(combined_headlines)

    cosine_sim = cosine_similarity(tfidf_matrix)

    similar_articles = {}
    for i, input_article in enumerate(input_articles):
        similar_indices = get_top_similar_articles(i, cosine_sim, top_n=20)
        similar_articles[str(input_article['_id'])] = [str(all_articles[idx]['_id']) for idx in similar_indices if idx >= len(input_articles)]

    return jsonify(similar_articles)


# Initialize a scraper instance
location = Location(state="Maharashtra", country="India")
scraper = LocationBasedCNNScraper(location=location, max_articles=5, max_concurrent=3)

@app.route('/scrape-articles', methods=['GET'])
def scrape_articles():
    """API endpoint to get the scraped articles."""
    try:
        # Run the scraper and get articles
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        articles = loop.run_until_complete(scraper.scrape_articles())
        return jsonify(articles), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True,port=5001)