#!/bin/bash
set -euo pipefail

IMAGE_REPO="${IMAGE_REPO:-kylevedder/kylevedderwebsite}"
DOCKER_ARCH="${DOCKER_ARCH:-$(docker version --format '{{.Server.Arch}}')}"

case "${DOCKER_ARCH}" in
    arm64|aarch64)
        IMAGE="${IMAGE_REPO}:arm64"
        DOCKERFILE="docker/Dockerfile.arm64"
        PLATFORM="linux/arm64"
        ;;
    amd64|x86_64)
        IMAGE="${IMAGE_REPO}:latest"
        DOCKERFILE="docker/Dockerfile"
        PLATFORM="linux/amd64"
        ;;
    *)
        echo "Unsupported Docker architecture: ${DOCKER_ARCH}" >&2
        exit 1
        ;;
esac

if ! docker image inspect "${IMAGE}" >/dev/null 2>&1; then
    docker pull --platform "${PLATFORM}" "${IMAGE}" >/dev/null 2>&1 || docker build --platform "${PLATFORM}" -f "${DOCKERFILE}" -t "${IMAGE}" docker/
fi

# Clean previous build
rm -rf _site/

# Run build
docker run --rm --platform "${PLATFORM}" -v "$(pwd)":/project "${IMAGE}" python3 ./build/build.py
