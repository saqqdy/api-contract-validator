/**
 * Express app for testing
 */

import express from 'express'

const app = express()

// Simple routes
app.get('/users', (req, res) => {
	const _limit = req.query.limit
	res.json({ users: [] })
})

app.post('/users', (req, res) => {
	const body = req.body
	res.status(201).json({ id: 1, name: body.name })
})

app.get('/users/:id', (req, res) => {
	const id = req.params.id
	res.json({ id, name: 'John' })
})

app.put('/users/:id', (req, res) => {
	const id = req.params.id
	const body = req.body
	res.json({ id, name: body.name })
})

app.delete('/users/:id', (req, res) => {
	const _id = req.params.id
	res.status(204).send()
})

// Routes with comments
// Get all products
app.get('/products', (req, res) => {
	res.json({ products: [] })
})

// Create a new product
app.post('/products', (req, res) => {
	const _body = req.body
	res.status(201).json({ id: 1 })
})

export default app
