/**
 * API version 1 routes.
 *
 * @author Andreas Lillje
 * @version 2.3.1
 */

import express from 'express'
import { router as ResourcesRouter } from './resources-router.js'

export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'Resources API' }))
router.use('/resources', ResourcesRouter)
