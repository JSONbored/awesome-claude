FROM node:24-bookworm@sha256:8530f76a96d88820d288761f022e318970dda93d01536919fbc16076b7983e63

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    ca-certificates=20230311+deb12u1 \
    git=1:2.39.5-0+deb12u3 \
  && rm -rf /var/lib/apt/lists/* \
  && corepack enable \
  && corepack prepare pnpm@11.4.0 --activate \
  && groupadd --system runner \
  && useradd --system --gid runner --home-dir /runner --shell /usr/sbin/nologin runner \
  && mkdir -p /runner \
  && chown -R runner:runner /runner

WORKDIR /runner
COPY --chown=runner:runner runner.mjs /runner/runner.mjs

ENV HOME=/tmp/heyclaude-runner
ENV COREPACK_HOME=/tmp/heyclaude-corepack
ENV PNPM_HOME=/tmp/heyclaude-pnpm
ENV PNPM_STORE_PATH=/tmp/heyclaude-pnpm-store
ENV XDG_CACHE_HOME=/tmp/heyclaude-cache
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
ENV PATH=/tmp/heyclaude-pnpm:$PATH
ENV PORT=8080
EXPOSE 8080

USER runner
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 8080) + '/health').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "/runner/runner.mjs"]
