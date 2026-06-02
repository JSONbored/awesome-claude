FROM node:24-bookworm@sha256:8530f76a96d88820d288761f022e318970dda93d01536919fbc16076b7983e63

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates=20230311+deb12u1 \
    git=1:2.39.5-0+deb12u3 \
  && rm -rf /var/lib/apt/lists/* \
  && groupadd --system runner \
  && useradd --system --gid runner --home-dir /runner --shell /usr/sbin/nologin runner

WORKDIR /runner
COPY --chown=runner:runner runner.mjs /runner/runner.mjs

ENV PORT=8080
EXPOSE 8080

USER runner
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 8080) + '/health').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "/runner/runner.mjs"]
