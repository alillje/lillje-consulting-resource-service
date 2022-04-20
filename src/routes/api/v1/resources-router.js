/**
 * API version 1 routes.
 *
 * @author Andreas Lillje
 * @version 1.0.0
 */

import express from 'express'
import jwt from 'jsonwebtoken'
import createError from 'http-errors'
import { ResourcesController } from '../../../controllers/api/resources-controller.js'
export const router = express.Router()

const controller = new ResourcesController()

/**
 * Authenticates requests.
 *
 * If authentication is successful, `req.user`is populated and the
 * request is authorized to continue.
 * If authentication fails, an unauthorized response will be sent.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const authenticateJWT = (req, res, next) => {
  try {
    const [authenticationScheme, token] = req.headers.authorization?.split(' ')

    if (authenticationScheme !== 'Bearer') {
      throw new Error('Invalid authentication scheme.')
    }

    // Set properties to req.user from JWT payload
    const payload = jwt.verify(token, Buffer.from(process.env.ACCESS_TOKEN_SECRET, 'base64').toString('ascii'))
    req.user = {
      sub: payload.sub,
      username: payload.username,
      email: payload.email
    }

    next()
  } catch (err) {
    const error = createError(401)
    error.cause = err
    next(error)
  }
}

/**
 * Authorizes resources.
 *
 * Checks if user has right/access to a specific resource.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const authorizeResource = (req, res, next) => {
  try {
    if (req.resource.author !== req.user.sub) {
      throw new Error('No right to access.')
    }
    next()
  } catch (err) {
    const error = createError(403)
    error.cause = err
    next(error)
  }
}

// ------------------------------------------------------------------------------
//  Routes
// ------------------------------------------------------------------------------

// Provide req.image to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => controller.loadResource(req, res, next, id))

// GET images
router.get('/',
  authenticateJWT, (req, res, next) => controller.findAll(req, res, next)
)

// GET images/:id
router.get('/:id',
  authenticateJWT, authorizeResource,
  (req, res, next) => controller.find(req, res, next)
)

// POST images
router.post('/',
  authenticateJWT,
  (req, res, next) => controller.create(req, res, next)
)

// PATCH images
router.patch('/:id',
  authenticateJWT, authorizeResource,
  (req, res, next) => controller.updatePatch(req, res, next)
)

// DELETE images
router.delete('/:id',
  authenticateJWT, authorizeResource,
  (req, res, next) => controller.delete(req, res, next)
)

// PUT images
router.put('/:id',
  authenticateJWT, authorizeResource,
  (req, res, next) => controller.update(req, res, next)
)
