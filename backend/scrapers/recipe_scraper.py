# from urllib.request import urlopen
import requests
from recipe_scrapers import scrape_html

def scrape_recipe(url):
    try:
        # Fetch HTML content
        # html = urlopen(url).read().decode("utf-8")
        headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an error for HTTP issues

        # Initialize scraper
        scraper = scrape_html(response.text, org_url=url)

        # Extract recipe details
        return {
            'title': scraper.title(),
            'ingredients': scraper.ingredients(),
            'steps': scraper.instructions().split('\n')  # Split instructions into steps
        }
    except Exception as e:
        # Handle errors (e.g. unsupported websites, etc.)
        return {
            'error': f"Failed to scrape the recipe: {str(e)}"
        }