# basic node image
FROM alpine

## copy the source
COPY index.js /
COPY src /src
COPY package.json /

# secrets file needs to be resident locally
COPY ../private/secrets.js /

#install the dependencies
RUN npm install

#test
#expose port
EXPOSE 8081

#tell app which port to use
ENV PORT 8081

# and the mode
ENV MODE ku

#how to run it
CMD [ "node", "index.js" ]

