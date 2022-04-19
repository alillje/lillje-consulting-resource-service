/**
 * API version 1 routes.
 *
 * @author Andreas Lillje
 * @version 1.0.0
 */

import express from 'express'
import { router as ResourcesRouter } from './resources-router.js'

export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'Resources API' }))
router.use('/resources', ResourcesRouter)
