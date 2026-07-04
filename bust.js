const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  let changed = false;
  if (c.includes('assets/css/style.css')) {
    c = c.replace(/assets\/css\/style\.css(\?v=[0-9]+)?/g, 'assets/css/style.css?v=30');
    changed = true;
  }
  if (c.includes('assets/js/app.js')) {
    c = c.replace(/assets\/js\/app\.js(\?v=[0-9]+)?/g, 'assets/js/app.js?v=30');
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(f, c, 'utf8');
    console.log('Updated: ' + f);
  }
});
