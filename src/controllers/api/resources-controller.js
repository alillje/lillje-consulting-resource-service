/**
 * Module for the ImagesController.
 *
 * @author Andreas Lillje
 * @version 1.0.0
 */

import createError from 'http-errors'
import { Resource } from '../../models/resource.js'
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
      const image = await Resource.findById(id)

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
    try {
      // Fine images only for authenticated user and respond
      const resources = await Resource.find({ author: req.user.sub })
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
      if (!req.body.title || !req.body.description) {
        throw new Error('Validation error')
      }

      // Validate and blacklist "<>" before saving to any database
      const dataSanitized = validator.blacklist(req.body.title, '<>')
      const descriptionSanitized = req.body.description ? validator.blacklist(req.body.description, '<>') : undefined


      const json = await response.json()

      // Set properties of image
      const resource = new Resource({
        title: json.title,
        description: descriptionSanitized,
        author: req.user.sub,
      })

      await resource.save()

      // const location = new URL(
      //   `${req.protocol}://${req.get('host')}${req.baseUrl}/${
      //     image._id
      //   }`
      // )

      // Respond with resource data
      res
        // .location(location.href)
        .status(201)
        .json(resource)
    } catch (err) {
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
      const title = req.body.title ? validator.blacklist(req.body.data, '<>') : undefined
      const descriptionSanitized = req.body.description ? validator.blacklist(req.body.description, '<>') : undefined

      // Use conditional tenary operator to check if description or contentType has been changed
      req.resource.title = req.body.title ? req.body.title : req.resource.title
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


      // Set properties of image
      req.resource.title = req.body.titleSanitized
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