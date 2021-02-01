# wappalyzer-url-list-processor

### Strart infrastructure

This project need rabbitMQ stack to work. A docker-compose file has been provided for this porpose:
```bash
docker-compose -f docker-compose-infrastructure.yml up -d
```

### Build and run tasks feeder

```bash
docker build -t wappalyzer-worker .
docker run -it wappalyzer-worker bash -c "npm run feed"
```

### Build and run worker

```bash
docker build -t wappalyzer-worker .
docker run -it wappalyzer-worker bash -c "npm run worker"
```

### Build and run results collector

```bash
docker build -t wappalyzer-worker .
docker run -it wappalyzer-worker bash -c "npm run collector"
```