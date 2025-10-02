module.exports = {
  apps: [{
    name: 'verstack-ihm',
    script: './dist/verstack-ihm/server/server.mjs',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 4000,
      API_BASE_URL: 'http://127.0.0.1:3000'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
