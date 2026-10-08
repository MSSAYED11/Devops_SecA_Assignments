# Task 2: Observability & The Three Pillars

## 1. What is Observability?
Observability is the ability to measure and infer the internal states of a system based entirely on its external outputs. While monitoring answers *"Is the system working?"*, observability answers *"Why is the system broken and where is the bottleneck?"*.

---

## 2. The Three Pillars of Observability

### A. Metrics (Aggregatable Telemetry)
- **Definition:** Numeric, time-series data measured over intervals representing aggregate health and performance.
- **Key Characteristics:** Lightweight, easily graphable, and ideal for alerting.
- **Examples:** CPU utilization percentage, memory consumption in MB, HTTP request rate, error count, p99 latency.
- **Primary Tools:** Prometheus, Grafana, Datadog.

### B. Logs (Event Records)
- **Definition:** Timestamped, immutable text records emitted when distinct events occur in an application or infrastructure component.
- **Key Characteristics:** High context and detail; essential for debugging specific root-cause errors and exception stack traces.
- **Examples:** Nginx access logs, application error logs, container stdout/stderr.
- **Primary Tools:** Grafana Loki, Fluentd, Logstash, Elasticsearch.

### C. Traces (Distributed Request Flow)
- **Definition:** End-to-end journey of a single user request as it traverses across multiple microservices and network hops in a distributed architecture.
- **Key Characteristics:** Composed of spans representing individual operations with start/end times and metadata.
- **Examples:** Tracing a checkout transaction: Web Frontend -> Auth Service -> Payment Gateway -> Database.
- **Primary Tools:** OpenTelemetry, Jaeger, Zipkin.

---

## 3. Kubernetes Observability Stack
In modern cloud-native Kubernetes environments:
- **Prometheus** scrapes `/metrics` endpoints and cAdvisor container metrics.
- **Grafana** visualizes time-series dashboards.
- **Loki** or **FluentBit** aggregates container stdout logs.
- **OpenTelemetry Operator / Jaeger** captures distributed spans across pods.

---

## 4. Visual Evidence & Live Dashboards

### Prometheus Metrics Collection & Query Interface (`localhost:9090`)
![Prometheus Query Interface](../screenshots/prometheus-dashboard.png)

### Grafana Visualization Dashboard (`localhost:3000`)
![Grafana Metrics Dashboard](../screenshots/grafana-dashboard.png)

