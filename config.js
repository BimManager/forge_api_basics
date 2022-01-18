module.exports = {
  credentials: {
    client_id: process.env.FORGE_CLIENT_ID,
    client_secret: process.env.FORGE_CLIENT_SECRET,
    grant_type: 'client_credentials',
    scope: 'data:create data:write data:read \
       bucket:create bucket:read bucket:delete'
  },
  options: {
    hostname: 'developer.api.autodesk.com',
    port: 443
  }
};
