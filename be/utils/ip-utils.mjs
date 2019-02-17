import os from 'os';

export const getIps = () => {
  const addresses = [];
  const ifaces = os.networkInterfaces();

  Object.keys(ifaces).forEach(function (ifname) {
    ifaces[ifname].forEach(function (iface) {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        return;
      }

      addresses.push(iface.address);
    });
  });

  return addresses;
};

export const getInternalIp = () => {
  return getIps().find(ip => ip.startsWith('192.'));
};

