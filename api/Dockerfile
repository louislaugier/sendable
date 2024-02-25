# Start from the latest golang base image
FROM golang:1.22-alpine AS builder

# Set the Current Working Directory inside the container
WORKDIR /go/src/email-validator

# Copy the source from the current directory to the Working Directory inside the container
COPY . .

# Download all dependencies. Dependencies will be cached if the go.mod and the go.sum files are not changed
RUN go mod download

# Build the Go app for a smaller and secured production binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo -o main ./cmd/*.go

######## Start a new stage from scratch #######
FROM alpine:latest

ENV GIN_MODE=release

# Set the Current Working Directory inside the container
WORKDIR /go/src/email-validator

# Copy the pre-built binary file from the previous stage
COPY --from=builder /api/main .

# Expose port 80 to the outside
EXPOSE 80

# Command to run the executable
CMD ["./main"]
