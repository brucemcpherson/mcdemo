#googles node image
FROM launcher.gcr.io/google/nodejs
MAINTAINER Bruce Mcpherson <bruce@mcpher.com>

#create a workdirectory
WORKDIR /usr/src/mcdemo

## copy the source
COPY index.js .
COPY src/ src/
COPY package.json .

# secrets file needs to be resident locally
COPY private/* src/

#install the dependencies
RUN npm install

#tell app which port to use
ENV PORT 8081

# and the mode
ENV MODE ku

#how to run it
CMD [ "node", "index.js" ]