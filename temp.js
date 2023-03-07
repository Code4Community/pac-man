const { exec } = require('shelljs');

exec('powershell "cd scripts; npm run build:dev; rm -r ../assets/dist; cp -r dist ../assets/dist; cp index.html ../static/pacman.html; rm -r dist"');
