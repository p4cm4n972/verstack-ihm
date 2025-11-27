module.exports = {
  apps: [{
    name: 'verstack-ihm',
    cwd: '/var/www/verstack.io/verstack-ihm',
    script: 'dist/verstack-ihm/server/server.mjs',
    instances: 1,
    exec_mode: 'fork',
    env: {
      PORT: 4000,
    }
  }]
};
