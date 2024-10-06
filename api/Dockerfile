# Start from the latest golang base image
FROM --platform=linux/amd64 golang:1.23 AS builder

# Set the Current Working Directory inside the container
WORKDIR /go/src/sendable

# Copy the source from the current directory to the Working Directory inside the container
COPY . .

# Download all dependencies. Dependencies will be cached if the go.mod and the go.sum files are not changed
RUN go mod download

# Build the Go app for a smaller and secured production binary
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -a -installsuffix cgo -o main ./cmd/*.go

######## Start a new stage from scratch #######
FROM --platform=linux/amd64 alpine::3.20.3

# Set the Current Working Directory inside the container
WORKDIR /go/src/sendable

# Copy the pre-built binary file from the previous stage
COPY --from=builder /api/main .

# Expose port 80 to the outside
EXPOSE 80

# Command to run the executable
CMD ["./main"]
