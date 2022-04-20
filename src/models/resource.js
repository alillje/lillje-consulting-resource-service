/**
 * Mongoose model Image.
 *
 * @author Andreas Lillje
 * @version 1.0.0
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
  invoiceDate: {
    type: Date
    // required: [true, 'Date is required.'],
  },
  company: {
    type: String,
    trim: true,
    required: [true, 'Company is required.']
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
