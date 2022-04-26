/**
 * Module for the ImagesController.
 *
 * @author Andreas Lillje
 * @version 1.0.0
 */

import { Resource } from '../../models/resource.js'
import { setAccountNumber } from '../../helper-functions/set-account-number.js'

import createError from 'http-errors'
import validator from 'validator'

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

      // Provide the image to the request object.
      req.resource = resource

      // Next middleware.
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
    query.author = req.user.sub
    if (req.query.company) {
      // Make search case insensitive
      query.company = new RegExp(`^${req.query.company}$`, 'i')
    } if (req.query.done) {
      query.done = req.query.done
    } if (req.user?.admin && req.query.author) {
      query.author = req.query.author
    } if (req.query.invoiceDate) {
      query.invoiceDate = req.query.invoiceDate
    }
    try {
      // Find resources only for authenticated user and respond
      // const resources = await Resource.find({ author: req.user.sub })

      // const resources = await Resource.find({ author: req.user.sub })
      const resources = await Resource.find(query)

      res.json(resources)
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
      if (!req.body.date || !req.body.description || !req.body.company || !req.body.transactionType) {
        throw new Error('Validation error')
      }
      // Validate and blacklist "<>" before saving to any database
      const descriptionSanitized = req.body.description ? validator.escape(req.body.description) : undefined
      const companySanitized = req.body.company ? validator.escape(req.body.company) : undefined
      const transactionCategorySanitized = req.body.transactionCategory ? validator.escape(req.body.transactionCategory) : undefined
      const transactionTypeSanitized = req.body.transactionType ? validator.escape(req.body.transactionType) : undefined

      const account = setAccountNumber(transactionTypeSanitized, transactionCategorySanitized)

      // Set properties of image
      const resource = new Resource({
        description: descriptionSanitized,
        company: companySanitized,
        invoiceDate: req.body.date,
        amount: req.body.amount,
        author: req.user.sub,
        done: req.body.done,
        transactionType: transactionTypeSanitized,
        transactionCategory: transactionCategorySanitized,
        account: account
      })

      await resource.save()

      console.log(resource)
      // const location = new URL(
      //   `${req.protocol}://${req.get('host')}${req.baseUrl}/${
      //     image._id
      //   }`
      // )

      // Respond with resource data

      // .location(location.href)
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
      // Sanitize data description if any
      const titleSanitized = req.body.title ? validator.blacklist(req.body.data, '<>') : undefined
      const descriptionSanitized = req.body.description ? validator.blacklist(req.body.description, '<>') : undefined

      // Use conditional tenary operator to check if description or contentType has been changed
      req.resource.title = req.body.title ? titleSanitized : req.resource.title
      req.resource.description = req.body.description ? descriptionSanitized : req.resource.title

      await req.image.save()

      res
        .status(204)
        .end()
    } catch (err) {
      const error = createError(400)
      next(error)
    }
  }

  /**
   * Updates a specific image.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async update (req, res, next) {
    try {
      if (!req.body.title || !req.body.description) {
        throw new Error('Validation error')
      }

      const titleSanitized = req.body.title ? validator.blacklist(req.body.title, '<>') : undefined
      const descriptionSanitized = req.body.description ? validator.blacklist(req.body.description, '<>') : undefined

      // Set properties of resource
      req.resource.title = titleSanitized
      req.resource.description = descriptionSanitized
      req.resource.author = req.user.sub

      await req.resource.save()

      res
        .status(204)
        .end()
    } catch (err) {
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
