import axios from "axios";

// Create an axios instance with default config
const axiosInstance = axios.create({
  baseURL: process.env.VUE_APP_DEPLOY_URL,
  timeout: 10000, // 10 seconds timeout
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Function to fetch all investors from the database
export const getInvestors = async () => {
  try {
    const response = await axiosInstance.get('/api/investors');
    return response.data;
  } catch (error) {
    console.error("Error fetching investors:", error);
    throw error;
  }
};

/**
 * Fetch all investor data (holdings and market values) for a specific quarter
 */
export const fetchInvestorData = async (investorId, quarter) => {
  try {
    console.log('Fetching investor data:', `/api/investors/data/${investorId}/${quarter}`);
    const response = await axiosInstance.get(`/api/investors/data/${investorId}/${quarter}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching investor data:", error);
    throw error;
  }
};

/**
 * Fetch distinct quarters for a given investorId
 * @param {string} investorId - The ID of the investor
 * @returns {Promise<Array>} - List of distinct quarters
 */
export const getDistinctQuarters = async (investorId) => {
  try {
    const response = await axiosInstance.get(`/api/investors/data/${investorId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching distinct quarters:", error);
    throw error;
  }
};

// Fetch list of companies (companyName & cusip) based on investorId
export const fetchCompanies = async (investorId) => {
  try {
    console.log('Fetching companies:', `/api/investors/portfolio/${investorId}`);
    const response = await axiosInstance.get(`/api/investors/portfolio/${investorId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
};

// Fetch portfolio data (ownership history) by investorId and cusip
export const fetchOwnershipHistory = async (investorId, cusip) => {
  try {
    const response = await axiosInstance.get(`/api/investors/portfolio/${investorId}/${cusip}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ownership history:", error);
    throw error;
  }
};
