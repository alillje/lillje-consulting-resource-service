/**
 * API version 1 routes.
 *
 * @author Andreas Lillje
 * @version 1.0.0
 */

import express from 'express'
import { router as imagesRouter } from './images-router.js'

export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'This is the picture-it API' }))
router.use('/images', imagesRouter)
