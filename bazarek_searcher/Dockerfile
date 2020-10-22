FROM golang:alpine AS build
RUN apk add build-base
WORKDIR /src
ENV CGO_ENABLED=1
COPY . .
RUN go build -o /out/example .

FROM alpine:3 AS bin

COPY --from=build /out/example /
CMD ./example