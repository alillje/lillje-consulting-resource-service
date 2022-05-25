/**
 * API version 1 routes.
 *
 * @author Andreas Lillje
 * @version 2.3.1
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
      company: payload.company,
      admin: payload.admin
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
    // Check if admin or authorized user
    if (!req.user.admin && req.resource.author !== req.user.sub) {
      throw new Error('No right to access.')
    }
    next()
  } catch (err) {
    const error = createError(403)
    error.cause = err
    next(error)
  }
}

/**
 * Authorizes admin only action.
 *
 * Checks if user has right/access to a specific resource.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const authorizeAdminResource = (req, res, next) => {
  try {
    // Check if admin or authorized user
    if (!req.user.admin) {
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

// Provide req.resource to the route if :id is present in the route path.
router.param('id', (req, res, next, id) => controller.loadResource(req, res, next, id))

router.get('/',
  authenticateJWT, (req, res, next) => controller.findAll(req, res, next)
)

router.get('/:id',
  authenticateJWT, authorizeResource,
  (req, res, next) => controller.find(req, res, next)
)

router.post('/',
  authenticateJWT,
  (req, res, next) => controller.create(req, res, next)
)

router.patch('/:id',
  authenticateJWT, authorizeAdminResource,
  (req, res, next) => controller.updatePatch(req, res, next)
)

router.delete('/:id',
  authenticateJWT, authorizeAdminResource,
  (req, res, next) => controller.delete(req, res, next)
)
