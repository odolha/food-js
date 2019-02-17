const concurrently = require('concurrently');

concurrently([
  'npm run ui:scss',
  `node --max_old_space_size=1000 --experimental-modules ./ui/live-server.mjs ${process.argv.slice(2).join(' ')}`,
  'npm-watch ui:scss'
]);
