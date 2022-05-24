/**
 * Mongoose model Image.
 *
 * @author Andreas Lillje
 * @version 2.3.1
 */

import mongoose from 'mongoose'

// Schema.
const schema = new mongoose.Schema({
  description: {
    type: String,
    trim: true,
    required: [true, 'Description is required.']
  },
  author: {
    type: String,
    required: [true, 'Author is required.'],
    trim: true
  },
  authorName: {
    type: String,
    required: [true, 'Authorname is required.'],
    trim: true
  },
  invoiceDate: {
    type: String,
    required: [true, 'Date is required.']
  },
  vat: {
    type: Number,
    emum: [0, 0.06, 0.12, 0.25]

  },
  amountExVat: {
    type: Number
  },
  amountIncVat: {
    type: Number
  },
  company: {
    type: String,
    trim: true,
    required: [true, 'Company is required.']
  },
  done: {
    type: Boolean,
    default: false
  },
  transactionType: {
    type: String,
    required: [true, 'Transaction Type is required.'],
    trim: true,
    enum: ['Leverantörsfaktura', 'Kundfaktura', 'Utlägg']
  },
  transactionCategory: {
    type: String,
    default: 'Övrigt',
    trim: true,
    enum: ['Bensin', 'Material', 'Mobil', 'Internet', 'Försäkring', 'Övrigt', 'Försäljning']
  },
  account: {
    type: Number,
    required: [true, 'Content Type is required.'],
    trim: true,
    enum: [5611, 4010, 6212, 6230, 6310, 6991, 3010]
  },
  documentUrl: {
    type: String
  }

}, {
  timestamps: true,
  toJSON: {
    /**
     * Performs a transformation of the resulting object to remove sensitive information.
     *
     * @param {object} doc - The mongoose document which is being converted.
     * @param {object} ret - The plain object representation which has been converted.
     */
    transform: function (doc, ret) {
      delete ret._id
      delete ret.__v
      // Using the author and imageServiceId property to store resource by user, but delete to not display this sensitive data
      // delete ret.author
    },
    virtuals: true // ensure virtual fields are serialized
  }
})

schema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Create a model using the schema.
export const Resource = mongoose.model('Resource', schema)
