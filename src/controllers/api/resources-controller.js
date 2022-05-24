/**
 * Module for the ImagesController.
 *
 * @author Andreas Lillje
 * @version 2.3.1
 */

import { Resource } from '../../models/resource.js'
import { setAccountNumber } from '../../helper-functions/set-account-number.js'
import { calculateAmountIncVat } from '../../helper-functions/calculate-amount-inc-vat.js'
import createError from 'http-errors'
import validator from 'validator'
import CryptoJS from 'crypto-js'

/**
 * Encapsulates a controller.
 */
export class ResourcesController {
  /**
   * Provide req.resource to the route if :id is present.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   * @param {string} id - The value of the id for the image to load.
   */
  async loadResource (req, res, next, id) {
    try {
      // Get the image.
      const resource = await Resource.findById(id)

      // If no image found send 404, set error message.
      if (!resource) {
        const error = createError(404)
        next(error)
        return
      }

      // Provide the resource to the request object.
      req.resource = resource
      next()
    } catch (err) {
      let error = err
      // If id is incorrect, does not match mongoose format (CastError), send 404
      if (error.name === 'CastError') {
        error = createError(404)
        next(error)
      } else {
        next(error)
      }
    }
  }

  /**
   * Sends a JSON response containing a image.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async find (req, res, next) {
    res.json(req.resource)
  }

  /**
   * Sends a JSON response containing all resources.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async findAll (req, res, next) {
    const query = {}
    // Queries
    if (!req.user.admin) {
      query.author = req.user.sub
    } if (req.query.company) {
      // Make search case insensitive
      query.company = new RegExp(`^${req.query.company}$`, 'i')
    } if (req.query.done) {
      query.done = req.query.done
    } if (req.user?.admin && req.query.author) {
      query.author = req.query.author
    } if (req.query.invoiceDate) {
      query.invoiceDate = req.query.invoiceDate
    } if (req.query.transactionType) {
      query.transactionType = req.query.transactionType
    }

    // Pagination
    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)

    const startIndex = (page - 1) * limit
    const endIndex = page * limit

    const results = {}

    try {
      const allResources = await Resource.find(query)
      // Find resources only for authenticated user and respond
      // Sorts by invoiceDate
      results.resources = await Resource.find(query).limit(limit).skip(startIndex).sort({ invoiceDate: -1 })

      // Count pages
      if (endIndex < allResources.length) {
        results.next = {
          page: page + 1,
          limit: limit
        }
      }
      if (startIndex < 0) {
        results.previous = {
          page: page - 1,
          limit: limit
        }
      }

      results.pages = Math.ceil(allResources.length / limit)
      res.json(results)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Creates a new image resource.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async create (req, res, next) {
    try {
      if (!req.body.date || !req.body.description || !req.body.company || !req.body.transactionType || !req.body.documentUrl) {
        throw new Error('Validation error')
      }
      // Validate and blacklist "<>" before saving to any database
      const descriptionSanitized = req.body.description ? validator.escape(req.body.description) : undefined
      const companySanitized = req.body.company ? validator.escape(req.body.company) : undefined
      const transactionCategorySanitized = req.body.transactionCategory ? validator.escape(req.body.transactionCategory) : undefined
      const transactionTypeSanitized = req.body.transactionType ? validator.escape(req.body.transactionType) : undefined

      const account = setAccountNumber(transactionTypeSanitized, transactionCategorySanitized)
      // Encrypt document before saving into database
      const encryptedDocument = CryptoJS.AES.encrypt(req.body.documentUrl, process.env.DOCUMENT_ENCRYPT_SECRET).toString()

      // Set properties of image
      const resource = new Resource({
        description: descriptionSanitized,
        company: companySanitized,
        invoiceDate: req.body.date,
        vat: req.body.vat,
        amountExVat: req.body.amountExVat,
        amountIncVat: calculateAmountIncVat(req.body.amountExVat, req.body.vat),
        author: req.user.sub,
        authorName: req.user.company,
        done: req.body.done,
        transactionType: transactionTypeSanitized,
        transactionCategory: transactionCategorySanitized,
        account: account,
        documentUrl: encryptedDocument
      })

      await resource.save()
      res
        .status(201)
        .json(resource)
    } catch (err) {
      console.log(err)
      const error = createError(400)
      next(error)
    }
  }

  /**
   * Updates a specific image partially.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async updatePatch (req, res, next) {
    try {
      let done
      if (req.body.done === 'false') {
        done = false
      } else if (req.body.done === 'true') {
        done = true
      } else if (!req.body.done) {
        const error = createError(400)
        next(error)
      }
      req.resource.done = done
      await req.resource.save()

      res
        .status(204)
        .end()
    } catch (err) {
      console.log(err)

      const error = createError(400)
      next(error)
    }
  }

  /**
   * Deletes a specific image.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async delete (req, res, next) {
    try {
      // Delete from resource DB
      await req.resource.deleteOne()
      res
        .status(204)
        .end()
    } catch (err) {
      const error = createError(400)
      next(error)
    }
  }
}
