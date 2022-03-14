FROM node:16

ENV CI=true

WORKDIR /app

COPY package.json ./

RUN npm install

COPY ./ ./

#install R and packages
RUN apt update

RUN apt-get install -y libgsl-dev
RUN apt-get install -y r-base
RUN apt-get install -y -qq r-cran-irlba
RUN R -e "install.packages(c('RcppGSL'),dependencies=TRUE,repos='http://cran.rstudio.com/')"
RUN R -e "install.packages(c('RcppZiggurat'),dependencies=TRUE,repos='http://cran.rstudio.com/')"
RUN R -e "install.packages(c('Rfast'),dependencies=TRUE,repos='http://cran.rstudio.com/')"
RUN R -e "install.packages(c('mixsqp'),dependencies=TRUE,repos='http://cran.rstudio.com/')"
RUN R -e "install.packages(c('susieR'),dependencies=TRUE,repos='http://cran.rstudio.com/')"
RUN R -e "install.packages(c('coloc'),dependencies=TRUE,repos='http://cran.rstudio.com/')"

#add bash
#RUN apk add --no-cache bash

#remove windows line endings
RUN apt-get install -y dos2unix
RUN dos2unix pipeline_scripts/coloc.sh
RUN chmod 775 pipeline_scripts/coloc.sh

RUN npm run build

CMD [ "npm", "run", "start:prod" ]
