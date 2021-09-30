module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', 'dedd2b540b6770cb2c1a39e10ce8108d'),
    },
  },
});
