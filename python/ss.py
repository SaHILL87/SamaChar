from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import BartTokenizer, BartForConditionalGeneration, RobertaTokenizer, RobertaForSequenceClassification
from googletrans import Translator
import torch
import re

app = Flask(__name__)
CORS(app)
# Load models and tokenizers
bart_tokenizer = BartTokenizer.from_pretrained('facebook/bart-large-cnn')
bart_model = BartForConditionalGeneration.from_pretrained('facebook/bart-large-cnn')

roberta_tokenizer = RobertaTokenizer.from_pretrained('cardiffnlp/twitter-roberta-base-sentiment')
roberta_model = RobertaForSequenceClassification.from_pretrained('cardiffnlp/twitter-roberta-base-sentiment')

# Initialize Google Translator
translator = Translator()

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

def summarize_text(text, max_length=60, min_length=40, length_penalty=2.0):
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
    # Use Google Translate to translate the text
    translation = translator.translate(text, src='en', dest='hi')
    return translation.text

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
    
    text = data['text']
    translation = translate_to_hindi(text)
    
    return jsonify({
        "original_text": text,
        "hindi_translation": translation
    })

if __name__ == '__main__':
    app.run(debug=True)