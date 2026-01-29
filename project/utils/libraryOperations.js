import * as db from '../config/database.js'

export async function initTable() {
    const sql = `CREATE TABLE IF NOT EXISTS books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    status TEXT(20) 'To Read',
    created_at TIMESTAMPTZ NOW()
    );
`
}

export async function addBook(title, author, genre, status) {
    if (!title || !author) {
        throw new Error('Title and Author are required')
    }
    const sql = `
    INSERT INTO books (title, author, genre, status)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
    `
    const result = await
    db.query(sql, [title, author, genre, status])
    return result.rows[0]
}

export async function listBooks(filterType, filterValue) {
    let sql = 'SELECT id, title, author, genre, status FROM books'
    const params = []
    const allowedFilters = ['genre', 'status']
    if (filterType && filterValue && allowedFilters.includes(filterType.toLowerCase())) {
        sql += ` WHERE ${filterType.toLowerCase()} = $1`
        params.push(filterValue)
    }
     sql += ' ORDER BY id ASC'
    const res = await db.query(sql, params)
    return res.rows
}

export async function updateBook(id, field, value) {
    const allowedFields = ['title', 'author', 'genre', 'status']
    if (!allowedFields.includes(field.toLowerCase())) {
        throw new Error(`Invalid field: ${field}`)
    }
    const sql = `UPDATE books SET ${field.toLowerCase()} =$2 WHERE id = $1 RETURNING *`
    const res = await db.query(sql, [id, value])
    if (res.rowCount === 0) throw new Error(`Book with ID ${id} not found`)
        return res.rows[0]
}

export async function deleteBook(id) {
    const sql = 'DELETE FROM books WHERE id = $1 RETURNING title'
    const res = await db.query(sql, [id])
    if (res.rowCount === 0) throw new Error(`Book with ID ${id} not found`)
        return res.rows[0]
}
