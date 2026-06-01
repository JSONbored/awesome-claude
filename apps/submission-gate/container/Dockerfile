FROM node:24-bookworm

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates git openssh-client \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /runner
COPY runner.mjs /runner/runner.mjs

ENV PORT=8080
EXPOSE 8080

CMD ["node", "/runner/runner.mjs"]
