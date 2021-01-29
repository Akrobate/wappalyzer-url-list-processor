# wappalyzer-url-list-processor

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