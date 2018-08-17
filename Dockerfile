# basic node image
FROM alpine

## copy the source
COPY index.js .
COPY src .
COPY package.json .

# secrets file is  resident locally
COPY private/* .

#install the dependencies
RUN npm install


#expose port
EXPOSE 8081

#tell app which port to use
ENV PORT 8081

# and the mode
ENV MODE ku

#how to run it
CMD [ "node", "index.js" ]

