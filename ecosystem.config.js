module.exports = {
  apps: [{
    name: 'arwen-blessing',
    script: 'app.js',
    instances: 1,
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '200M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_development: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    kill_timeout: 3000,
    listen_timeout: 5000
  }]
};
