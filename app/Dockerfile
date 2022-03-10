FROM node:16-alpine

ENV CI=true

WORKDIR /app

COPY package.json ./


RUN npm install


COPY ./ ./

#add bash
RUN apk add --no-cache bash

#install R and packages
RUN apk --no-cache add R
RUN R -e "install.packages(c('coloc'),dependencies=TRUE,repos='http://cran.rstudio.com/')"

#remove windows line endings
RUN apk add dos2unix
RUN dos2unix pipeline_scripts/coloc.sh
RUN chmod 775 pipeline_scripts/coloc.sh

RUN npm run build

CMD [ "npm", "run", "start:prod" ]
