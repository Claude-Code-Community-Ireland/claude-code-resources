const data = require('../catalog/scraped-pending.json');
const blocked = ['dymension', 'cosmos', 'blockchain', 'crypto', 'token', 'defi', 'web3', 'solana', 'ethereum'];

const good = data.filter(d => {
  const name = (d.source.repository.full_name + ' ' + (d.source.repository.description || '')).toLowerCase();
  const isBlocked = blocked.some(b => name.includes(b));
  return d.content && d.content.length > 2000 && !isBlocked;
});

console.log('Found ' + good.length + ' quality non-blockchain resources:\n');

good.slice(0, 20).forEach((r, i) => {
  console.log((i+1) + '. ' + r.source.repository.full_name + ' (' + r.type + ')');
  console.log('   Desc: ' + (r.source.repository.description || 'N/A').substring(0, 80));
  console.log('   Size: ' + r.content.length + ' chars');
  console.log('   URL: ' + r.source.html_url);
  console.log('');
});
