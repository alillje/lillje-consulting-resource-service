import { setAccountNumber } from '../helper-functions/set-account-number.js'

describe('Takes type of transaction type, and returns the corresponding account number', () => {
  test('Where the transaction type is leverantörsfaktura and category is bensin', () => {
    expect(setAccountNumber('leverantörsfaktura', 'bensin')).toBe(5611)
  })

  test('Where the transaction type is leverantörsfaktura and category is material', () => {
    expect(setAccountNumber('leverantörsfaktura', 'material')).toBe(4010)
  })

  test('Where the transaction type is leverantörsfaktura and category is material', () => {
    expect(setAccountNumber('leverantörsfaktura', 'mobil')).toBe(6212)
  })

  test('Where the transaction type is leverantörsfaktura and category is internet', () => {
    expect(setAccountNumber('leverantörsfaktura', 'internet')).toBe(6230)
  })
  test('Where the transaction type is leverantörsfaktura and category is försäkring', () => {
    expect(setAccountNumber('leverantörsfaktura', 'internet')).toBe(6230)
  })
  test('Where the transaction type is leverantörsfaktura and category is not defined', () => {
    expect(setAccountNumber('leverantörsfaktura')).toBe(6991)
  })

  test('Where the transaction type is kundfaktura', () => {
    expect(setAccountNumber('kundfaktura')).toBe(3010)
  })

  test('Where the transaction type or transaction category is not defined', () => {
    expect(setAccountNumber()).toBe(3010)
  })
})
