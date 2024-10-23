import logging
from dataclasses import dataclass
from typing import Set
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from threading import Lock
import asyncio
import time
import json
import re
import os
import random

@dataclass
class Location:
    state: str
    country: str = "India"
    
    @property
    def keywords(self) -> Set[str]:
        """Generate state-related keywords"""
        state_name = self.state.lower()
        
        # Include variations of state names
        keywords = {
            state_name,
            f"{state_name}, {self.country.lower()}",
        }
        
        # Add common variations and alternative names
        state_variations = {
            "tamil nadu": {"tamilnadu", "madras"},
            "kerala": {"keralam"},
            "maharashtra": {"maha"},
            "uttar pradesh": {"up", "u.p."},
            "madhya pradesh": {"mp", "m.p."},
            # Add more variations as needed
        }
        
        if state_name in state_variations:
            keywords.update(state_variations[state_name])
        
        # Add major cities for the state
        cities = self.get_major_cities(self.state)
        keywords.update(cities)
        
        return keywords
        
    @staticmethod
    def get_major_cities(state: str) -> Set[str]:
        """Return major cities for a given state"""
        major_cities = {
            "Maharashtra": {"mumbai", "pune", "nagpur", "nashik", "aurangabad", "thane"},
            "Tamil Nadu": {"chennai", "coimbatore", "madurai", "salem", "tirupur", "trichy"},
            "Karnataka": {"bengaluru", "bangalore", "mysuru", "mysore", "hubli", "mangaluru", "mangalore"},
            "Kerala": {"thiruvananthapuram", "kochi", "kozhikode", "thrissur", "kannur"},
            "Delhi": {"new delhi", "delhi"},
            "Gujarat": {"ahmedabad", "surat", "vadodara", "rajkot", "gandhinagar"},
            "Uttar Pradesh": {"lucknow", "kanpur", "varanasi", "agra", "prayagraj", "allahabad", "noida"},
            "West Bengal": {"kolkata", "howrah", "durgapur", "asansol", "siliguri"},
            "Telangana": {"hyderabad", "warangal", "nizamabad", "karimnagar"},
            "Rajasthan": {"jaipur", "jodhpur", "udaipur", "kota", "ajmer"},
            "Bihar": {"patna", "gaya", "bhagalpur", "muzaffarpur"},
            "Madhya Pradesh": {"bhopal", "indore", "jabalpur", "gwalior", "ujjain"},
            "Punjab": {"chandigarh", "ludhiana", "amritsar", "jalandhar", "patiala"},
            "Haryana": {"gurugram", "gurgaon", "faridabad", "panipat", "ambala"},
            "Odisha": {"bhubaneswar", "cuttack", "rourkela", "puri"},
            "Assam": {"guwahati", "silchar", "dibrugarh", "jorhat"},
        }
        return major_cities.get(state, set())

CNN_CONFIG = {
    "base_urls": [
        "https://www.cnn.com/india",
        "https://www.cnn.com/world/india",
        "https://www.cnn.com/search?q=india",
        "https://www.cnn.com/search?q=maharashtra",  # State-specific search
        "https://www.cnn.com/search?q=mumbai",       # City-specific search
        "https://www.cnn.com/asia",                  # Regional coverage
        "https://www.cnn.com/business/india-market", # Business coverage
    ],
    "article_selector": [
        # CNN Homepage and Section Selectors
        ".container__item",
        ".card",
        "[data-type='article']",
        ".list-item",
        ".card.container_lead-plus-headlines__item",
        ".search-result",
        "article",
        ".media",
        # Additional article containers
        ".cn-list-hierarchical-xs-article",
        ".cd__wrapper",
        ".collection-article",
        ".outbrain-container",
        ".cn-carousel-medium-strip",
        ".cn-list-hierarchical-small-horizontal",
        ".zn__containers--standard",
        # More generic selectors
        "[data-analytics='card']",
        "[data-content-type='article']",
        ".story",
        ".news-package",
        ".container_vertical",
        ".container_lead",
        # Region-specific containers
        "[data-section='asia']",
        "[data-section='india']",
        ".regional-news-section"
    ],
    "title_selector": [
        # Article titles
        ".container__headline",
        ".container__title",
        "h3.card-title",
        ".headline",
        ".title",
        "h1.pg-headline",
        ".Article__title",
        ".Article__subtitle",
        # Additional heading selectors
        "h1[data-analytics='headline']",
        ".media__title",
        ".cd__headline",
        ".cd__headline-text",
        ".cn-title",
        ".PageHead__title",
        ".BasicArticle__title",
        ".Article__subtitle",
        # Generic headings with article context
        "article h1",
        "article h2",
        "article h3",
        ".article-title",
        ".story-title",
        ".headline__text",
        # Search result titles
        ".search-result__title",
        ".search-results__item-headline"
    ],
    "link_selector": [
        # Article links
        "a[data-link-type='article']",
        "a.container__link",
        "a.card-link",
        "a[href*='/2024/']",
        "a[href*='/2023/']",
        "a[href*='/india/']",
        "a[href*='/asia/']",
        # Geography-specific links
        "a[href*='/maharashtra']",
        "a[href*='/mumbai']",
        "a[href*='/delhi']",
        "a[href*='/bangalore']",
        # Content type specific
        "a[href*='/article/']",
        "a[href*='/news/']",
        "a[href*='/world/']",
        "a[href*='/business/']",
        # Link patterns
        "a[href*='india-news']",
        "a[href*='south-asia']",
        "a[href*='asia-pacific']",
        # Generic article links with exclusions
        "a:not([href*='video']):not([href*='gallery']):not([href*='live-news'])",
        # Additional link containers
        ".cd__content a",
        ".media__content a",
        ".container__link-bank a"
    ],
    "content_selector": [
        # Main content
        ".article__content",
        ".zn-body__paragraph",
        ".article-content",
        "[data-zn-id='body-text']",
        ".body-text",
        ".article__main",
        ".article__content-container",
        # Additional content containers
        ".BasicArticle__body",
        ".BasicArticle__main",
        ".Article__body",
        ".Article__content",
        ".story__content",
        ".zn__containers",
        ".zn-body__read-all",
        # Paragraph and text elements
        ".paragraph",
        ".content__text",
        ".story-body__text",
        ".article__text",
        # Generic content
        "article p",
        ".article-body p",
        ".story-body p",
        ".main-content p",
        # Specific content sections
        ".content-container",
        ".article__container",
        ".story__container",
        # Related content
        ".related-content__text",
        ".supplemental-content"
    ]
}

class LocationBasedCNNScraper:
    def __init__(self, location: Location, max_articles=10, max_concurrent=5):
        self.location = location
        self.max_articles = max_articles
        self.max_concurrent = max_concurrent
        self.processed_links = set()
        self.articles_lock = Lock()
        self.articles = []
        self.driver = None
        self.wait = None
        
        # Initialize logging
        logging.basicConfig(level=logging.INFO, 
                          format='%(asctime)s - %(levelname)s - %(message)s')
        
        self._initialize_driver()

    def _initialize_driver(self):
        """Initialize the Chrome driver with proper error handling"""
        try:
            chrome_options = Options()
            chrome_options.add_argument("--headless")
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--window-size=1920,1080")
            chrome_options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
            
            logging.info(f"Initializing Chrome driver for {self.location.state}, {self.location.country}")
            self.driver = webdriver.Chrome(options=chrome_options)
            self.wait = WebDriverWait(self.driver, 10)
        except Exception as e:
            logging.error(f"Error initializing Chrome driver: {str(e)}")
            raise

    async def collect_article_links(self, url: str) -> list:
        """Collect article links from a given URL"""
        links = []
        try:
            logging.info(f"Collecting links from {url}")
            self.driver.get(url)
            
            # Scroll to load more content
            for _ in range(3):
                self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
                await asyncio.sleep(1)
            
            for selector in CNN_CONFIG["article_selector"]:
                try:
                    articles = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    if articles:
                        for article in articles:
                            for link_selector in CNN_CONFIG["link_selector"]:
                                try:
                                    link_element = article.find_element(By.CSS_SELECTOR, link_selector)
                                    link = link_element.get_attribute("href")
                                    if link and link not in self.processed_links:
                                        links.append(link)
                                        self.processed_links.add(link)
                                except:
                                    continue
                except:
                    continue
                    
        except Exception as e:
            logging.error(f"Error collecting links from {url}: {str(e)}")
            
        return links

    async def process_article(self, url: str):
        """Process a single article"""
        try:
            logging.info(f"Processing article: {url}")
            self.driver.get(url)
            await asyncio.sleep(2)

            # Get title
            title = ""
            for selector in CNN_CONFIG["title_selector"]:
                try:
                    title_element = self.driver.find_element(By.CSS_SELECTOR, selector)
                    title = title_element.text
                    if title:
                        break
                except:
                    continue

            # Get content
            content = ""
            for selector in CNN_CONFIG["content_selector"]:
                try:
                    paragraphs = self.driver.find_elements(By.CSS_SELECTOR, selector)
                    if paragraphs:
                        content = " ".join(p.text for p in paragraphs if p.text)
                        if content:
                            break
                except:
                    continue

            if title and content and self.is_location_relevant(f"{title} {content}"):
                article = {
                    "title": self.clean_text(title),
                    "content": self.clean_text(content),
                    "url": url,
                    "location": {
                        "state": self.location.state,
                        "country": self.location.country
                    },
                    "scraped_at": time.strftime("%Y-%m-%d %H:%M:%S")
                }
                
                with self.articles_lock:
                    self.articles.append(article)
                    logging.info(f"Added article: {title[:50]}...")

        except Exception as e:
            logging.error(f"Error processing article {url}: {str(e)}")

    def is_location_relevant(self, text: str) -> bool:
        """Check if the text contains location-relevant keywords"""
        if not text:
            return False
        
        text_lower = text.lower()
        return any(keyword in text_lower for keyword in self.location.keywords)

    def clean_text(self, text: str) -> str:
        """Clean and normalize text"""
        if not text:
            return ""
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'[^\w\s.,!?-]', '', text)
        return text.strip()

    async def scrape_articles(self):
        """Main scraping method"""
        for url in CNN_CONFIG["base_urls"]:
            links = await self.collect_article_links(url)
            for link in links[:self.max_articles]:
                await self.process_article(link)
                await asyncio.sleep(random.uniform(1, 2))
        
        return self.articles

    async def save_to_file(self):
        """Save results to JSON file"""
        timestamp = time.strftime("%Y%m%d_%H%M%S")
        filename = f"cnn_articles_{self.location.state.lower()}_{timestamp}.json"
        
        os.makedirs('output', exist_ok=True)
        filepath = os.path.join('output', filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump({
                'metadata': {
                    'location': {
                        'state': self.location.state,
                        'country': self.location.country
                    },
                    'total_articles': len(self.articles),
                    'scrape_timestamp': timestamp
                },
                'articles': self.articles
            }, f, indent=2, ensure_ascii=False)
            
        logging.info(f"Saved {len(self.articles)} articles to {filepath}")
        return filepath

    def close(self):
        """Clean up resources"""
        if self.driver:
            try:
                self.driver.quit()
            except Exception as e:
                logging.error(f"Error closing driver: {str(e)}")

async def main():
    scraper = None
    try:
        # Initialize with an Indian state
        location = Location(
            state="Maharashtra",
            country="India"
        )
        
        # Create and run scraper
        scraper = LocationBasedCNNScraper(
            location=location,
            max_articles=5,
            max_concurrent=3
        )
        
        # Run scraping
        articles = await scraper.scrape_articles()
        
        # Save results
        output_file = await scraper.save_to_file()
        
        # Print summary
        logging.info(f"\nScraping Summary:")
        logging.info(f"State: {location.state}, Country: {location.country}")
        logging.info(f"Total articles scraped: {len(articles)}")
        logging.info(f"Output saved to: {output_file}")
        
    except Exception as e:
        logging.error(f"Error during scraping: {str(e)}")
        raise
    finally:
        if scraper:
            scraper.close()

if __name__ == "__main__":
    asyncio.run(main())