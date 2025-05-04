import axios from "axios";

// Get all companies 
export const getAllCompanies = async () => {
    try {
        const response = await axios.get("/.netlify/functions/server/all-companies")
        return response.data
    } catch (err){
        console.log("error in getting companies from BE", err)
        throw new Error("Failed to fetch companies from the server.");
    }
}
// Search company 
export const searchCompanies = async (query) => {
  const response = await axios.get("/.netlify/functions/server/all-companies", {
    params: { query }
  })
  return response.data
}

// Get filings API  
export async function fetchCompanyFilings(ticker) {
    const response = await axios.get(`/.netlify/functions/server/company/${ticker}`)
    console.log("response api from fe", response.data)
    return response.data
}
  
// Get saved filings from MongoDB 
export async function getCompanyFilingsFromDB(ticker) {
    const response = await axios.get(`/.netlify/functions/server/filings/${ticker}`)
    return response.data
}

// Get earning calendar API
export async function getEarningCalendars(ticker) {
    try{
    const response = await axios.get(`/.netlify/functions/server/earnings-calendar/${ticker}`)
    console.log("earning calendar from fe", response.data)
    return response.data
    } catch (err) {
        console.log("error getting calendar fe", err)
    }
}

// Get earning transcripts
export async function getEarningTranscripts(ticker){
    const response = await axios.get(`/.netlify/functions/server/earnings-transcript/${ticker}`)
    console.log("earning transcripts from FE", response.data)
    return response.data
}

export async function getProcessForm4(ticker){
    try {
        const response = await axios.get(`/.netlify/functions/server/insider-transactions/${ticker}`)
        console.log("process form 4 in FE", response.data)
        return response.data
    }
    catch (error){
        console.log("Error processing form 4 in FE", error)
    }
}