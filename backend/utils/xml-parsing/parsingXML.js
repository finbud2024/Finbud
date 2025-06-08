import axios from "axios"
import xml2js from "xml2js"

const SEC_HEADERS = {
    "User-Agent": "Anh Tran anhtrannd2004@gmail.com"
}
const parseXMLFile = async(docURL) => {
    try {
        const response = await axios.get(docURL, {
            headers: {
                ...SEC_HEADERS,
                'Accept': 'application/xml' 
            }
        })
        const xmlData = response.data
       
        const start = xmlData.indexOf("<ownershipDocument>");
  const end = xmlData.indexOf("</ownershipDocument>") + "</ownershipDocument>".length;

  if (start === -1 || end === -1) {
    console.warn("No XML ownershipDocument found in:", docURL);
    return null;
  }

  const xml = xmlData.slice(start, end);

  const parser = new xml2js.Parser();
  const parsed = await parser.parseStringPromise(xml);
  return parsed
    } catch (error){
        console.log("Parsing error", error)
    }
}
export default parseXMLFile;