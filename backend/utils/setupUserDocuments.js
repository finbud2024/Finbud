import UserHolding from "../../database-schema/finance/UserHolding.js";
import Portfolio from "../../database-schema/finance/Portfolio.js";

export const setupUserDocuments = async (userId) => {
    try {

      const existingHolding = await UserHolding.findOne({ userId });
      if (!existingHolding) {
        console.log(`Creating new UserHolding document for user ${userId}`);
        const newHolding = new UserHolding({
          userId,
          stocks: []
        });
        await newHolding.save();
      }
  
     
      const existingPortfolio = await Portfolio.findOne({ userId });
      if (!existingPortfolio) {
        console.log(`Creating new Portfolio document for user ${userId}`);
        const currentDate = new Date();
        const newPortfolio = new Portfolio({
          userId,
          portfolio: [
            {
              date: currentDate,
              totalValue: 1000 
            }
          ]
        });
        await newPortfolio.save();
      }
  
      return true;
    } catch (error) {
        console.error('Error setting up user documents:', error);
        return false;
      }
    };