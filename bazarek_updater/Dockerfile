FROM golang:alpine AS build
RUN apk add build-base
WORKDIR /src
ENV CGO_ENABLED=1
COPY . .
RUN go build -o /out/bazarek .


FROM alpine:3 AS bin
COPY --from=build /out/bazarek /
RUN mkdir /data
ENV PATH_DSN="/data/bazared.db"
CMD ./bazarek