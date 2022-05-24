
/**
 * Finds correct account number corresponding to transactionType.
 *
 * @param {string} transactionType - Transaction type to find account number for
 * @param {string} transactionCategory - Transaction category to find account number for
 * @returns {number} Account number corresponing to the transactionType input
 */
export const setAccountNumber = (transactionType, transactionCategory) => {
  let accountNumber
  transactionType ? transactionType = transactionType.toLowerCase() : transactionType = undefined
  transactionCategory ? transactionCategory = transactionCategory.toLowerCase() : transactionCategory = undefined

  if (transactionType === 'leverantörsfaktura') {
    switch (transactionCategory) {
      case 'bensin':
        accountNumber = 5611
        break
      case 'material':
        accountNumber = 4010
        break
      case 'mobil':
        accountNumber = 6212
        break
      case 'internet':
        accountNumber = 6230
        break
      case 'försäkring':
        accountNumber = 6310
        break
      default:
        accountNumber = 6991
    }
  } else if (transactionType === 'kundfaktura') {
    accountNumber = 3010
  } else {
    accountNumber = 3010
  }
  return accountNumber
}
