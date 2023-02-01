# Make sure all layers are based on the same python
# version.
FROM node:latest
ENV NODE_ENV=production

WORKDIR ./Docker

# The actual production image.
COPY . ./

RUN npm install --production

ENTRYPOINT ["python"]

# Assuming you want to run run.py as a script.
CMD ["npm", "run", "prod"]