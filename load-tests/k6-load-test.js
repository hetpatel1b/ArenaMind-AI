import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 },  // Ramp up to 100 users
    { duration: '1m', target: 100 },   // Stay at 100 users
    { duration: '30s', target: 500 },  // Ramp up to 500 users
    { duration: '1m', target: 500 },   // Stay at 500 users
    { duration: '30s', target: 1000 }, // Ramp up to 1000 users
    { duration: '1m', target: 1000 },  // Stay at 1000 users
    { duration: '30s', target: 0 },    // Scale down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'], // 95% of requests must complete below 500ms
    http_req_failed: ['rate<0.01'],                 // Error rate should be less than 1%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Test Liveness
  const liveRes = http.get(`${BASE_URL}/api/v1/live`);
  check(liveRes, { 'Liveness status was 200': (r) => r.status === 200 });

  sleep(1);

  // Test API endpoint (Simulated)
  const apiRes = http.get(`${BASE_URL}/api/v1/health`);
  check(apiRes, { 'Health status was 200': (r) => r.status === 200 });

  sleep(1);
}
