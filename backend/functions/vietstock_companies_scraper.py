import time
import random
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from pymongo import MongoClient

# --- CONFIGURATION ---
MONGO_URI = "mongodb+srv://finbud123:finbud123@cluster0.8mbj0ln.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
DB_NAME = "vietstock"
COLLECTION_NAME = "companies"
VIETSTOCK_USERNAME = "finbud.app@gmail.com"
VIETSTOCK_PASSWORD = "finbud123"

# --- SETUP ---
client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

homepage_url = "https://finance.vietstock.vn/"
companies_url = "https://finance.vietstock.vn/doanh-nghiep-a-z?page=1"

options = uc.ChromeOptions()
options.add_argument("--disable-blink-features=AutomationControlled")
options.add_argument("--disable-infobars")
options.add_argument("--start-maximized")
options.add_argument("--disable-extensions")
options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36")

print("Starting browser...")
driver = uc.Chrome(options=options)
print("Browser started")

wait = WebDriverWait(driver, 30)

def login_vietstock_modal(driver, wait):
    driver.get(homepage_url)
    print("Navigated to homepage")
    input("Please log in manually in the browser window, then press Enter here to continue...")

    # Now continue with the rest of your script (navigate to A-Z, crawl, etc.)
    driver.get(companies_url)
    time.sleep(3)

    inserted_count = 0
    page_num = 1
    while True:
        print(f"Scraping page {page_num}")
        # Simulate scrolling
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight/2);")
        time.sleep(2)
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)

        # Wait for and get the table
        table = wait.until(
            EC.presence_of_element_located(
                (By.CSS_SELECTOR, "table.table.table-striped.table-bordered.table-hover.table-middle.pos-relative.m-b")
            )
        )
        html = table.get_attribute('outerHTML')
        soup = BeautifulSoup(html, "html.parser")
        headers = [th.text.strip() for th in soup.find_all("th")]
        tbody = soup.find("tbody")
        if not tbody:
            print(f"Warning: No table data found on page {page_num}")
        else:
            for row in tbody.find_all("tr"):
                cols = [td.text.strip() for td in row.find_all("td")]
                if len(cols) == len(headers):
                    doc = dict(zip(headers, cols))
                    ma_ck = doc.get('Mã CK▲') or doc.get('Mã CK')
                    if ma_ck:
                        doc['Mã CK'] = ma_ck
                        collection.update_one({'Mã CK': doc['Mã CK']}, {'$set': doc}, upsert=True)
                        inserted_count += 1
                        print(f"Processed company: {ma_ck}")
            print(f"Successfully processed companies from page {page_num}")

        # Try to click the next button
        try:
            next_btn = driver.find_element(By.ID, "btn-page-next")
            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", next_btn)
            time.sleep(1)
            try:
                next_btn.click()
            except Exception:
                # Try JS click if normal click fails
                driver.execute_script("arguments[0].click();", next_btn)
            time.sleep(random.uniform(3, 5))  # Wait for next page to load
            page_num += 1
        except Exception as e:
            print("No more next button or error clicking next:", e)
            break

    print(f"All data inserted into MongoDB! Total companies processed: {inserted_count}")

try:
    # --- LOGIN ---
    login_vietstock_modal(driver, wait)

except Exception as e:
    print(f"Error occurred: {e}")

finally:
    driver.quit()
    print("Browser closed") 