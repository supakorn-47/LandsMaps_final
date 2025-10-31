#docker login deploy.landsmaps.hq:5000
#username : docker-user
#password : zaq12wsx
#docker build --no-cache -t deploy.landsmaps.hq:5000/dol-platform-backoffice:0.0.54 .
#docker image push deploy.landsmaps.hq:5000/dol-platform-backoffice:0.0.54

#docker build --no-cache -t dol-platform-backoffice:0.0.54 .
# docker build --no-cache --platform linux/amd64 -t dol-platform-backoffice:0.0.54 . // build for arm
#docker tag dol-platform-backoffice:0.0.54 pipr-uat-nexusrepos.dol.go.th/repository/docker-hosted/dol-platform-backoffice:0.0.54
#docker push pipr-uat-nexusrepos.dol.go.th/repository/docker-hosted/dol-platform-backoffice:0.0.54
#docker run --restart=always -d -p 50000:30004 --name dol-platform-backoffice dol-platform-backoffice:0.0.54

#FROM pipr-uat-nexusrepos.dol.go.th/repository/docker-hosted/node:14.18.0

FROM node:14.18.0

# set working directory
RUN mkdir -p /webadmin

# install and cache app dependencies
#ENV PATH /webadmin/node_modules/.bin:$PATH
WORKDIR /webadmin

COPY package*.json ./

RUN npm uninstall node-sass && \
    npm install sass && \
    npm install

COPY . .

COPY /public/extensions/node_modules/. ./node_modules

COPY ./build ./build

#RUN npm run build

#COPY ./public/ ./
# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=30004

EXPOSE ${PORT}
CMD ["node", "server"]
