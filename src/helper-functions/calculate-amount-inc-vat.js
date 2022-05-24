/**
 * Calculates amout including VAT based on amount excluding VAT & VAT rate.
 * If number first two decimals is not zero, it rounds up to nearest integer.
 *
 * @param {number} amountExVat - The amount excluding VAT.
 * @param {number} vatRate - The VAT rate to add.
 * @returns {number} - The calculated amount including VAT.
 */
export const calculateAmountIncVat = (amountExVat, vatRate) => {
  const amountInclVat = amountExVat * (vatRate + 1)
  return parseInt(Math.ceil(amountInclVat.toFixed(2)))
}
