module.exports = {
  ACCESS_TOKEN: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJraXJhbmIuYnRkaXAyM0BydnUuZWR1LmluIiwiZXhwIjoxNzU3MzE0ODAwLCJpYXQiOjE3NTczMTM5MDAsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiIzNDkzYWU4NC03NGYyLTQ4MzUtYjlhNi1kYWFkOWVhMmQ2MzgiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJraXJhbmIiLCJzdWIiOiIwNjRkZTg5Mi1hZjM5LTQ1ODMtOGFhNy04Y2M3ODViNTJiZGQifSwiZW1haWwiOiJraXJhbmIuYnRkaXAyM0BydnUuZWR1LmluIiwibmFtZSI6ImtpcmFuYiIsInJvbGxObyI6IjFydnUyM2xjc2UwMDQiLCJhY2Nlc3NDb2RlIjoiV1BWcWt3IiwiY2xpZW50SUQiOiIwNjRkZTg5Mi1hZjM5LTQ1ODMtOGFhNy04Y2M3ODViNTJiZGQiLCJjbGllbnRTZWNyZXQiOiJNWWVZRktGTUJoVVFSRFZZIn0.3T3QLiFQyS7wR67KN9EQy6xTA3MKIxyNPh87xg2Gn90',
  API_URL: 'http://20.244.56.144/evaluation-service/logs',
  
  VALID_STACKS: ['backend', 'frontend'],
  VALID_LEVELS: ['debug', 'info', 'warn', 'error', 'fatal'],
  
  BACKEND_PACKAGES: [
    'cache', 'controller', 'cron_job', 'db', 'domain', 
    'handler', 'repository', 'route', 'service'
  ],
  FRONTEND_PACKAGES: ['api'],
  COMMON_PACKAGES: ['auth', 'config', 'middleware', 'utils']
};