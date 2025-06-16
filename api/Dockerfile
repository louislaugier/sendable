FROM --platform=linux/amd64 golang:1.24

WORKDIR /go/src/sendable/api

COPY . .
COPY wait-for-certs.sh .

RUN apt-get update && apt-get install -y netcat-traditional && rm -rf /var/lib/apt/lists/*

RUN go install ./...
RUN go install github.com/air-verse/air@latest

ENTRYPOINT ["./wait-for-certs.sh"]
CMD ["air", "."]