const { execFile } = require('node:child_process');
const child = execFile('sh', ['build.sh'], (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});