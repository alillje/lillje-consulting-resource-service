import { calculateAmountIncVat } from '../helper-functions/calculate-amount-inc-vat.js'

describe('Calculates a price including VAT from a given VAT rate and a price excluding VAT', () => {
  test('0% VAT and positive integer', () => {
    expect(calculateAmountIncVat(100, 0)).toBe(100)
  })

  test('6% VAT and positive integer', () => {
    expect(calculateAmountIncVat(100, 0.06)).toBe(106)
  })

  test('12% VAT and positive integer', () => {
    expect(calculateAmountIncVat(100, 0.12)).toBe(112)
  })

  test('25% VAT and positive integer', () => {
    expect(calculateAmountIncVat(100, 0.25)).toBe(125)
  })

  test('0% VAT and positive integer', () => {
    expect(calculateAmountIncVat(50000, 0)).toBe(50000)
  })

  test('6% VAT and positive integer', () => {
    expect(calculateAmountIncVat(50000, 0.06)).toBe(53000)
  })

  test('12% VAT and positive integer', () => {
    expect(calculateAmountIncVat(50000, 0.12)).toBe(56000)
  })

  test('25% VAT and positive integer', () => {
    expect(calculateAmountIncVat(50000, 0.25)).toBe(62500)
  })

  test('0% VAT and positive number with 2 decimals', () => {
    expect(calculateAmountIncVat(1256.12, 0)).toBe(1257)
  })

  test('6% VAT and positive number with 2 decimals', () => {
    expect(calculateAmountIncVat(1256.12, 0.06)).toBe(1332)
  })

  test('12% VAT and positive number with 2 decimals', () => {
    expect(calculateAmountIncVat(1256.12, 0.12)).toBe(1407)
  })

  test('25% VAT and positive number with 2 decimals', () => {
    expect(calculateAmountIncVat(1256.12, 0.25)).toBe(1571)
  })
})
