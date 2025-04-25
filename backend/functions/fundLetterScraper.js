import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import fs from 'fs';

async function main() {
  const options = new chrome.Options().addArguments('--headless'); // Remove '--headless' to see the browser
  const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();

  try {
    const url = 'https://finchat.io/fund-letters/';
    console.log(`🌐 Navigating to ${url}`);
    await driver.get(url);

    // Wait for dropdown to be clickable and open it
    const dropdownTrigger = await driver.wait(
      until.elementLocated(By.css('[class*="mantine-Select"]')),
      10000
    );
    console.log("📂 Dropdown found, clicking...");
    await dropdownTrigger.click();
    await driver.sleep(4000);

    // Capture dropdown options
    const optionElements = await driver.wait(
      until.elementsLocated(By.css('[data-combobox-option="true"]')),
      10000
    );

    const optionTexts = [];
    for (let el of optionElements) {
      const text = (await el.getAttribute('textContent')).trim();
      if (text) optionTexts.push(text);
    }

    console.log("📋 Available options:", optionTexts);

    // Object to store grouped data
    const groupedData = {};

    for (let label of optionTexts) {
      console.log(`➡️ Selecting: ${label}`);

      try {
        // Reopen the dropdown for each selection
        const dropdownTrigger = await driver.wait(
          until.elementLocated(By.css('[class*="mantine-Select"]')),
          10000
        );
        await dropdownTrigger.click();
        await driver.sleep(2000);

        const option = await driver.wait(
          until.elementLocated(By.xpath(`//div[@data-combobox-option="true" and @value="${label}"]`)),
          10000
        );
        console.log(`✅ Option found: ${await option.getText()}`);
        await option.click();
      } catch (e) {
        console.error(`❌ Failed to click option '${label}': ${e}`);
        continue;
      }

      await driver.sleep(4000); // Wait for data to load

      try {
        const nextDataElement = await driver.findElement(By.id('__NEXT_DATA__'));
        const jsonData = await nextDataElement.getAttribute('textContent');
        const parsedData = JSON.parse(jsonData);

        const letters = parsedData?.props?.pageProps?.letters || [];

        if (letters.length === 0) {
          console.log(`📭 No letters found for ${label}.`);
        } else {
          console.log(`📄 Letters for ${label}:`);
          letters.forEach((letter) => {
            const year = letter.year;
            const quarter = letter.quarter;

            // Initialize year and quarter in groupedData if not present
            if (!groupedData[year]) {
              groupedData[year] = {};
            }
            if (!groupedData[year][quarter]) {
              groupedData[year][quarter] = [];
            }

            // Create a unique entry for the letter
            const letterEntry = `${letter.title} (${letter.quarter} ${letter.year}) - ${letter.link}`;

            // Add the letter only if it doesn't already exist
            if (!groupedData[year][quarter].includes(letterEntry)) {
              groupedData[year][quarter].push(letterEntry);
            }
          });
        }
      } catch (e) {
        console.error(`❌ Failed to extract JSON data for '${label}': ${e}`);
      }
    }

    // Save grouped data to a JSON file
    const outputFilePath = 'fundLetterData.json';
    fs.writeFileSync(outputFilePath, JSON.stringify(groupedData, null, 2), 'utf-8');
    console.log(`\n✅ Grouped data saved to '${outputFilePath}'.`);
  } catch (e) {
    console.error(`❌ An error occurred: ${e}`);
  } finally {
    await driver.quit();
    console.log("🚪 Browser closed.");
  }
}

// Run the script
main().catch((err) => {
  console.error("❌ Unhandled error:", err);
});