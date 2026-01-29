import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';

export async function exportLibrary(books, format = 'json') {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `library_${timestamp}.${format}`;
    const filePath = path.join(process.cwd(), fileName);

    let content;
    if (format.toLowerCase() === 'csv') {
        const headers = 'id,title,author,genre,status\n';
        const rows = books.map(b => `${b.id},"${b.title}","${b.author}",${b.genre},${b.status}`).join('\n');
        content = headers + rows;
    } else {
        content = JSON.stringify(books, null, 2);
    }

    await fs.writeFile(filePath, content);
    console.log(`\n💾 Library exported to: ${filePath}`);


    const start = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    exec(`${start} .`);
}