import * as ops from './utils/libraryOperations.js'
import { close } from './config/database.js'
import { exportLibrary } from './config/export.js'

const [command, ...args] = process.argv.slice(2)

async function main() {
    await ops.initTable()
try {
    switch (command) {
        case 'add': {
            const [title, author, genre, status] = args
            const newBook = await ops.addBook(title, author, genre, status)
            console.log(`Added: "${newBook.title}" (ID: ${newBook.id})`)
            break
        }
        case 'list': {
            const [filterType, filterValue] = args
            const books = await ops.listBooks(filterType, filterValue)
            if (books.length === 0) {
                console.log('no matches found')
            } else {
                console.log('Personal library')
                console.table(books)
            }
            break
        }
        case 'update': {
            const [updateId, field, newValue] = args
            const updated = await
            ops.updateBook(updateId, field, newValue)
            console.log(`updated: book ${updateId} ${field} -> '${newValue}`)
            break
        }
        case 'delete': {
            const [deleteId] = args 
            if(!deleteId)
                throw new Error('Please provide a Book Id')
            const deleted = await
            ops.deleteBook(deleteId)
            console.log(`removed: "${deleted.title}"`)
        break
        }
        case 'export': {
            const format = args[0] || 'json'
            const allBooks = await ops.listBooks()
            if (allBooks.length === 0) {
                console.log(`Cannot export. Library is empty`)
            } else {
                await exportLibrary(allBooks, format)
            }
            break
        }
        case 'help':
            default:
                showHelp()
                break
    }
} catch (err) {
    console.error(`Error: ${err.message}`)
} finally {
    await close()
    process.exit()
}
}

main()

function showHelp() {
    console.log(`
Usage: node app.js <command> [args]

Commands:
  add <title> <author> <genre> <status>
  list [filterField] [filterValue]
  update <id> <field> <new_value>
  delete <id>
  `)
}