/**
 * User routes - separate router module
 */

import { Router } from 'express'

const router = Router()

// List users
router.get('/', (req, res) => {
	const _limit = req.query.limit
	const _offset = req.query.offset
	res.json({ users: [] })
})

// Get user by ID
router.get('/:id', (req, res) => {
	const userId = req.params.id
	res.json({ id: userId, name: 'John' })
})

// Create user
router.post('/', (req, res) => {
	const { name, email } = req.body
	res.status(201).json({ id: 1, name, email })
})

// Update user
router.put('/:id', (req, res) => {
	const id = req.params.id
	const body = req.body
	res.json({ id, ...body })
})

// Delete user
router.delete('/:id', (req, res) => {
	const _userId = req.params.id
	res.status(204).send()
})

export default router
