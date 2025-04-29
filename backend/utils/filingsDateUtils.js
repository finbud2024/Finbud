export const getPeriodDateFilings = (filingDate) => {
    const currFilingDate = new Date(filingDate)
    const year = currFilingDate.getFullYear()
    const month = currFilingDate.getMonth() + 1

    let quarter = ""
    if (month <= 3) quarter = "Q1"
    else if (month <= 6) quarter = "Q2"
    else if (month <= 9) quarter = "Q3"
    else quarter = "Q4"
    return `${quarter} ${year}`
}