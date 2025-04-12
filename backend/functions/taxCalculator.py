import requests
from bs4 import BeautifulSoup
import json

# Scrape the main tax calculator page (SmartAsset)
url = 'https://smartasset.com/taxes/income-taxes'
response = requests.get(url)

if response.status_code == 200:
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find the tax calculator links for each state
    tax_calculators_list = soup.find('ul', class_='related_link_list')
    links = tax_calculators_list.find_all('a')

    # Create a dictionary to hold the tax calculators by state
    state_tax_calculators = {}
    for link in links:
        state_name = link.text.strip()
        state_url = 'https://smartasset.com' + link.get('href')
        state_tax_calculators[state_name] = state_url

    # Save the scraped data as a JSON file
    with open('state_tax_calculators.json', 'w') as json_file:
        json.dump(state_tax_calculators, json_file, indent=4)
    
    print("Scraping complete. Tax calculators saved.")
else:
    print("Failed to retrieve the page.")
