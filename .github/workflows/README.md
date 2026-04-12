# GitHub Actions Deploy

This repository uses two deployment workflows:

- deploy-api.yml: deploys api and restarts process in PM2
- deploy-front.yml: builds front and uploads static files

Required repository secrets:

- VPS_HOST: server hostname or IP
- VPS_PORT: server SSH port (optional, defaults to 22)
- VPS_USER: server SSH user
- VPS_SSH_KEY: private SSH key used by Actions
- API_APP_DIR: absolute directory of api project on server
- API_PM2_APP_NAME: PM2 process name for api (optional)
- FRONT_DEPLOY_PATH: absolute directory where static files are published

Important server prerequisites:

- API_APP_DIR must already be a cloned git repository with remote access configured
- PM2 must be installed on the server for backend deploy
- Environment file for api must already exist on the server
- FRONT_DEPLOY_PATH should be the web root read by your web server (for example Nginx)
