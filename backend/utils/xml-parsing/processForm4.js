const transactionMap = {
    'A': 'Grant/Award',
    'F': 'Tax/exercise payment',
    'G': 'Bona fide gift',
    'S': 'Sale',
    'M': 'Share Receipt (Held)',
}

export const processForm4 = async (parsedXMLText) => {
    const document = parsedXMLText.ownershipDocument
    const transactions = document.nonDerivativeTable?.[0].nonDerivativeTransaction || []
    const ownerDoc = document.reportingOwner?.[0]
    const ownerInfo = {
        name: ownerDoc.reportingOwnerId?.[0].rptOwnerName?.[0]
    }
    const parsedTransactions = transactions.map((tran, idx) => {
        return {
            code: tran.transactionCoding?.[0].transactionCode?.[0],
            shares: tran.transactionAmounts?.[0].transactionShares?.[0].value?.[0],
            price: tran.transactionAmounts?.[0].transactionPricePerShare?.[0].value?.[0],
            filingDate: tran.transactionDate?.[0].value?.[0]
        }
    })
    return {
        owner: ownerInfo,
        transactionsInfo: parsedTransactions
    }
}