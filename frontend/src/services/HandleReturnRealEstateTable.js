import axios from 'axios';

export async function handleReturnRealEstateTable(userMessage) {
  let userInputToken = userMessage.toLowerCase().split(/\s+/);
  let searchLocation;
  if (userInputToken.length > 1) {
    userInputToken = userInputToken.slice(1, userInputToken.length);
    searchLocation = userInputToken.join(' ');
  } else {
    searchLocation = "san jose";
  }
  let propertiesData = [];
  const API_KEY = process.env.VUE_APP_REAL_ESTATE_KEY;
  const BASE_URL = 'https://zillow-com1.p.rapidapi.com/propertyExtendedSearch';
  try {
    const response = await axios.get(BASE_URL, {
      params: { location: searchLocation },
      headers: {
        'X-RapidAPI-Key': API_KEY,
        'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com',
      },
    });
    propertiesData = response.data.props;
  } catch (error) {
    console.error('Error fetching property data:', error);
  }
  let tableTemplate = `
  <div style="font-weight: 900; font-size: 30px"> Listing of 5 Properties in ${searchLocation} </div>
  <table>
    <thead>
      <tr>
        <th>Image</th>
        <th>Type</th>
        <th>Address</th>
        <th>Price</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody id="tableBody" class="table-body">`;
  propertiesData.slice(0, 5).map((item) => {
    tableTemplate += `
      <tr>
        <td><img style="width: 50px; aspect-ratio: 1;" src=${item.imgSrc} alt="propertyImage"></td>
        <td>${item.propertyType}</td>
        <td>${item.address}</td>
        <td>${item.price}$</td>
        <td>${item.listingStatus}</td>
      </tr>`;
  });
  tableTemplate += `</tbody></table>`;
  return tableTemplate;
}
