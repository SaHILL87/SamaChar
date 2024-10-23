from pymongo import MongoClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json
from bson import ObjectId

# Step 1: Setup MongoDB Connection
client = MongoClient('mongodb+srv://Sahil:Hello@cluster0.14o0z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
db = client['Cluster0']  # Replace with your database name
collection = db['articles']  # Replace with your collection name

# Step 2: Fetch articles by Object IDs passed from the frontend
def fetch_articles_by_ids(object_ids):
    object_ids = [ObjectId(id) for id in object_ids]  # Convert string IDs to ObjectId
    query = {'_id': {'$in': object_ids}}
    articles = list(collection.find(query, {'_id': 1, 'Headline': 1}))
    return articles

# Example list of object IDs passed from frontend
input_object_ids = ['670cf877bdd0ba59576fe780', '670cf877bdd0ba59576fe6b2']  # Replace with actual IDs

input_articles = fetch_articles_by_ids(input_object_ids)

# Step 3: Fetch all articles from the collection
all_articles = list(collection.find({}, {'_id': 1, 'Headline': 1}))

# Combine input articles and all articles
input_headlines = [article['Headline'] for article in input_articles]
all_headlines = [article['Headline'] for article in all_articles]
combined_headlines = input_headlines + all_headlines

# Step 4: Vectorize the headlines using TF-IDF
vectorizer = TfidfVectorizer(stop_words='english')
tfidf_matrix = vectorizer.fit_transform(combined_headlines)

# Step 5: Calculate cosine similarity
cosine_sim = cosine_similarity(tfidf_matrix)

# Step 6: Function to get top N similar articles by their object ID
def get_top_similar_articles(index, cosine_sim_matrix, top_n=20):
    similarity_scores = list(enumerate(cosine_sim_matrix[index]))
    similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
    top_articles = [i[0] for i in similarity_scores[1:top_n+1]]  # Get top N similar articles, excluding itself
    return top_articles

# Step 7: Map object IDs to similar articles
similar_articles = {}
for i, input_article in enumerate(input_articles):
    similar_indices = get_top_similar_articles(i, cosine_sim, top_n=20)
    similar_articles[str(input_article['_id'])] = [str(all_articles[idx]['_id']) for idx in similar_indices if idx >= len(input_articles)]

# Step 8: Return object IDs of similar articles
print(json.dumps(similar_articles, indent=4))