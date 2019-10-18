FROM node:alpine
RUN npm install pm2 -g

COPY "." "/app"
WORKDIR "/app"
EXPOSE 3000
HEALTHCHECK --interval=5s --timeout=20s \
   CMD curl -fs -o /dev/null http://localhost:3000/health || exit 1
CMD ["pm2-runtime", "./ecosystem.config.js"]
