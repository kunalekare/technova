const fs = require('fs');
const path = require('path');

const excludeDirs = ['node_modules', '.git', 'dist', 'build', 'artifacts', '.gemini'];
const excludeExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf', '.zip', '.webp'];

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat && stat.isDirectory()) {
            if (!excludeDirs.includes(file)) {
                results = results.concat(walk(filePath));
            }
        } else {
            const ext = path.extname(filePath).toLowerCase();
            if (!excludeExtensions.includes(ext) && file !== 'replace.js' && file !== 'replace.ps1' && file !== 'package-lock.json') {
                results.push(filePath);
            }
        }
    });
    return results;
}

const clientFiles = walk(path.join(__dirname, 'client'));
const serverFiles = walk(path.join(__dirname, 'server'));
const rootFiles = [path.join(__dirname, 'README.md')];

const allFiles = [...clientFiles, ...serverFiles, ...rootFiles];

let filesModified = 0;

allFiles.forEach(file => {
    if (!fs.existsSync(file)) return;
    try {
        let content = fs.readFileSync(file, 'utf8');
        let newContent = content;

        // Mask admin credential (just in case they have velixora inside, which they don't, but still)
        newContent = newContent.replace(/admin@technova\.com/g, '__ADMIN_CRED_MASK__');
        newContent = newContent.replace(/admin@velixora\.com/g, '__ADMIN_CRED_MASK2__');
        newContent = newContent.replace(/client@technova\.com/g, '__CLIENT_CRED_MASK__');
        newContent = newContent.replace(/client@velixora\.com/g, '__CLIENT_CRED_MASK2__');

        // Main replacements
        newContent = newContent.replace(/Velixora/g, 'Tarkko');
        newContent = newContent.replace(/velixora/g, 'tarkko');
        newContent = newContent.replace(/VELIXORA/g, 'TARKKO');
        
        newContent = newContent.replace(/Velixira/g, 'Tarkko');
        newContent = newContent.replace(/velixira/g, 'tarkko');
        newContent = newContent.replace(/VELIXIRA/g, 'TARKKO');
        
        newContent = newContent.replace(/TechNova/g, 'Tarkko');
        newContent = newContent.replace(/technova_theme/g, 'tarkko_theme');
        newContent = newContent.replace(/support@technova\.in/g, 'support@tarkko.in');
        newContent = newContent.replace(/employee@technova\.com/g, 'employee@tarkko.com');

        // Also fix the logo text we just modified in Login.jsx, Register.jsx, Navbar.jsx, Footer.jsx
        // We split it as "Velix" and "ora", so we should change it to "Tar" and "kko" or something similar if it exists.
        // Let's replace "Velix" -> "TARK", "ora" -> "KO" where they appear consecutively in JSX.
        newContent = newContent.replace(/>Velix</g, '>TARK<');
        newContent = newContent.replace(/>ora</g, '>KO<');

        // Unmask credentials
        newContent = newContent.replace(/__ADMIN_CRED_MASK__/g, 'admin@technova.com');
        newContent = newContent.replace(/__ADMIN_CRED_MASK2__/g, 'admin@velixora.com');
        newContent = newContent.replace(/__CLIENT_CRED_MASK__/g, 'client@technova.com');
        newContent = newContent.replace(/__CLIENT_CRED_MASK2__/g, 'client@velixora.com');

        if (content !== newContent) {
            fs.writeFileSync(file, newContent, 'utf8');
            console.log(`Updated: ${file}`);
            filesModified++;
        }
    } catch (err) {
        console.error(`Error processing ${file}:`, err);
    }
});

console.log(`Replacement complete. Modified ${filesModified} files.`);
