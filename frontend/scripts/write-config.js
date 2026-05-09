const fs = require('fs');

const config = `window.APP_CONFIG = {
  AUTH_API_URL: '${process.env.AUTH_API_URL || 'http://localhost:4000'}',
  USER_API_URL: '${process.env.USER_API_URL || 'http://localhost:5000'}'
};
`;

fs.writeFileSync('config.js', config);
console.log('Wrote frontend config.js');
