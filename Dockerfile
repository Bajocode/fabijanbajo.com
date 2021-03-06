FROM       node:10.15.3-alpine as builder
RUN        ["npm", "i", "-g", "react-scripts@3.0.1"]
USER       node
WORKDIR    /home/node
COPY       --chown=node:node package*.json ./
RUN        ["npm", "ci"]
COPY       --chown=node:node . .
RUN        ["npm", "run", "build"]
RUN        find . \
           ! -name build \
           ! -name nginx.conf \
           -maxdepth 1 \
           -mindepth 1 \
           -exec rm -rf {} \;

FROM       nginx:1.16.0-alpine as target
COPY       --from=builder /home/node/nginx.conf /etc/nginx/nginx.conf
COPY       --from=builder /home/node/build /usr/share/nginx/html/
EXPOSE     80/tcp
ENTRYPOINT ["nginx"]
CMD        ["-g", "daemon off;"]
