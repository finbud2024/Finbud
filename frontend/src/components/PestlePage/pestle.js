// Mock pestle.js - không cần API keys
import { GoogleGenAI } from "@google/genai";

// Mock API key để tránh lỗi
const GEMINI_API_KEY = process.env.VUE_APP_GEMINI_API_KEY || "mock-gemini-key";
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// PESTLE categories
const PESTLE_CATEGORIES = ["Political", "Economic", "Social", "Technological", "Legal", "Environmental"];
export function getPESTLECategories() { return PESTLE_CATEGORIES.slice(); }

// Mock function to process the remaining PESTLE categories
export async function generateAndProcessRemainingPestleAnalysis(industry) {
    if (!industry) throw new Error("Bạn cần nhập ngành để phân tích.");
    
    console.log(`Mock PESTLE analysis for industry: ${industry}`);
    
    // Return mock data
    return {
        Economic: {
            summary: "Mock economic analysis for " + industry,
            sections: [
                {
                    heading: "Economic Growth",
                    key_points: [
                        {
                            highlight: "Growth Rate",
                            text: "Mock economic growth analysis for the industry."
                        }
                    ]
                }
            ]
        },
        Social: {
            summary: "Mock social analysis for " + industry,
            sections: [
                {
                    heading: "Social Trends",
                    key_points: [
                        {
                            highlight: "Consumer Behavior",
                            text: "Mock social trend analysis for the industry."
                        }
                    ]
                }
            ]
        },
        Technological: {
            summary: "Mock technological analysis for " + industry,
            sections: [
                {
                    heading: "Technology Impact",
                    key_points: [
                        {
                            highlight: "Digital Transformation",
                            text: "Mock technology impact analysis for the industry."
                        }
                    ]
                }
            ]
        },
        Legal: {
            summary: "Mock legal analysis for " + industry,
            sections: [
                {
                    heading: "Regulatory Environment",
                    key_points: [
                        {
                            highlight: "Compliance",
                            text: "Mock legal and regulatory analysis for the industry."
                        }
                    ]
                }
            ]
        },
        Environmental: {
            summary: "Mock environmental analysis for " + industry,
            sections: [
                {
                    heading: "Environmental Factors",
                    key_points: [
                        {
                            highlight: "Sustainability",
                            text: "Mock environmental impact analysis for the industry."
                        }
                    ]
                }
            ]
        }
    };
}

// Mock function to fetch and process a single PESTLE category
export async function fetchPestleCategoryData(industry, category) {
    try {
        if (!industry || !category) throw new Error("Cần cung cấp ngành và hạng mục.");
        
        console.log(`Mock PESTLE category data for ${industry} - ${category}`);
        
        // Return mock data
        return {
            summary: `Mock summary for ${category} analysis of ${industry}`,
            sections: [
                {
                    heading: `Mock ${category} Analysis`,
                    key_points: [
                        {
                            highlight: "Key Factor 1",
                            text: `Mock detailed analysis for ${category} factors in ${industry}. This provides comprehensive insights into the industry landscape.`
                        },
                        {
                            highlight: "Key Factor 2", 
                            text: `Mock additional analysis for ${category} considerations in ${industry}. This covers important strategic implications.`
                        }
                    ]
                }
            ]
        };
    } catch (error) {
        console.error(`Mock error processing ${category} for ${industry}: ${error.message}`);
        throw error;
    }
}
