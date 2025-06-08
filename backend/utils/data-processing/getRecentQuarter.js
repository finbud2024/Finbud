export const getRecentQuarter = () => {
    const today = new Date()
    let year = today.getFullYear()
    let quarter = Math.ceil((today.getMonth() + 1) / 3)
    const recentQuarters = []
    for (let i = 0; i < 4; i++){
        recentQuarters.push(`${year}Q${quarter}`)
        quarter -= 1
        if (quarter == 0){
            quarter = 4
            year -= 1
        }
    }
    return recentQuarters
}