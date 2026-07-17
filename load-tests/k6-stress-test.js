import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 5000 }, // Spike to 5000 users rapidly
    { duration: '5m', target: 5000 }, // Hold high traffic to test resilience
    { duration: '2m', target: 0 },    // Scale down
  ],
  thresholds: {
    // Under stress, we might relax latency thresholds slightly, but aim for resilience
    http_req_duration: ['p(95)<1500'],
    http_req_failed: ['rate<0.05'], // Accept up to 5% failure under extreme stress
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Hit endpoints that might trigger DB/Redis/AI
  const res = http.get(`${BASE_URL}/api/v1/version`);
  check(res, { 'status was 200': (r) => r.status === 200 });

  // Simulate user think time
  sleep(Math.random() * 2 + 1); // 1-3 seconds
}
