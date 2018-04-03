var localtunnel = require('localtunnel');
var fs = require('fs');

var serviceName = fs.readFileSync(`${__dirname}/../.service`).toString();

localtunnel(3002, { subdomain: 'comwixmicroservices' + serviceName }, function () {
  console.log('service deployed as ' + serviceName);
});
