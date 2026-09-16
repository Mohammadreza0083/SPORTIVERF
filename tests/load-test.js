import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// ==============================================================================
// Custom Performance & DevSecOps Metrics
// ==============================================================================
const errorRate = new Rate('errors');
const interceptorTrend = new Trend('interceptor_duration');
const healthcheckTrend = new Trend('healthcheck_duration');
const homeEnTrend = new Trend('home_en_duration');
const homeTrTrend = new Trend('home_tr_duration');
const aboutTrend = new Trend('about_duration');

// Target Host: Defaults to local Nginx container on port 80 (or Astro preview on 4321)
const BASE_URL = __ENV.BASE_URL || 'http://localhost:80';

// ==============================================================================
// Load Testing Profile & Strict Production SLAs
// ==============================================================================
export const options = {
  stages: [
    { duration: '30s', target: 30 },  // Stage 1: Warm-up & Ramp-up (0 -> 30 VUs)
    { duration: '1m', target: 50 },   // Stage 2: Soak Testing (50 sustained VUs)
    { duration: '30s', target: 100 }, // Stage 3: Stress Spike (50 -> 100 VUs)
    { duration: '20s', target: 0 }    // Stage 4: Cooldown & Socket Recovery (100 -> 0 VUs)
  ],
  thresholds: {
    // Global HTTP Metrics
    http_req_duration: ['p(95)<300', 'p(99)<500', 'avg<150'],
    http_req_failed: ['rate<0.001'], // Global HTTP failure rate < 0.1%
    errors: ['rate<0.001'],          // Custom assertion failure rate < 0.1%

    // Route-specific Latency SLAs
    home_en_duration: ['p(95)<250'],
    home_tr_duration: ['p(95)<250'],
    interceptor_duration: ['p(95)<200'],
    about_duration: ['p(95)<300'],
    healthcheck_duration: ['p(99)<50']
  }
};

// ==============================================================================
// Test Scenario Workflow
// ==============================================================================
export default function () {
  const params = {
    headers: {
      'User-Agent': 'k6-load-test/sportiverf-devsecops',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9,tr;q=0.8',
      'Connection': 'keep-alive'
    },
    timeout: '10s'
  };

  // ----------------------------------------------------------------------------
  // 1. English Homepage (/en/)
  // ----------------------------------------------------------------------------
  group('01_Homepage_EN', function () {
    const res = http.get(`${BASE_URL}/en/`, params);
    homeEnTrend.add(res.timings.duration);

    const passed = check(res, {
      'status is 200': (r) => r.status === 200,
      'has HTML content': (r) => r.body && r.body.length > 500,
      'has CSP header': (r) => r.headers['Content-Security-Policy'] !== undefined,
      'has X-Content-Type-Options': (r) => r.headers['X-Content-Type-Options'] === 'nosniff'
    });
    errorRate.add(!passed);
  });

  sleep(Math.random() * 1.5 + 0.5);

  // ----------------------------------------------------------------------------
  // 2. Turkish Homepage (/tr/)
  // ----------------------------------------------------------------------------
  group('02_Homepage_TR', function () {
    const res = http.get(`${BASE_URL}/tr/`, params);
    homeTrTrend.add(res.timings.duration);

    const passed = check(res, {
      'status is 200': (r) => r.status === 200,
      'has HTML content': (r) => r.body && r.body.length > 500
    });
    errorRate.add(!passed);
  });

  sleep(Math.random() * 1.5 + 0.5);

  // ----------------------------------------------------------------------------
  // 3. Middleware Interceptor (/en/camps/volleyball)
  // Under maintenance mode, must intercept and return HTTP 503 with Retry-After.
  // ----------------------------------------------------------------------------
  group('03_Middleware_Interceptor_503', function () {
    const res = http.get(`${BASE_URL}/en/camps/volleyball`, {
      ...params,
      responseCallback: http.expectedStatuses(503, 200)
    });
    interceptorTrend.add(res.timings.duration);

    const passed = check(res, {
      'status is 503 (Maintenance) or 200 (Live)': (r) => r.status === 503 || r.status === 200,
      'has Retry-After header when 503': (r) => {
        if (r.status === 503) {
          return r.headers['Retry-After'] === '3600';
        }
        return true;
      },
      'response time under 200ms': (r) => r.timings.duration < 200
    });
    errorRate.add(!passed);
  });

  sleep(Math.random() * 1.5 + 0.5);

  // ----------------------------------------------------------------------------
  // 4. Heavy Content Page (/en/about/)
  // ----------------------------------------------------------------------------
  group('04_About_Page', function () {
    const res = http.get(`${BASE_URL}/en/about/`, params);
    aboutTrend.add(res.timings.duration);

    const passed = check(res, {
      'status is 200': (r) => r.status === 200,
      'has HTML content': (r) => r.body && r.body.length > 500
    });
    errorRate.add(!passed);
  });

  sleep(Math.random() * 1.5 + 0.5);

  // ----------------------------------------------------------------------------
  // 5. Nginx Health Check Endpoint (/health)
  // ----------------------------------------------------------------------------
  group('05_Healthcheck', function () {
    const res = http.get(`${BASE_URL}/health`, {
      headers: { 'Accept': 'application/json' },
      timeout: '5s'
    });
    healthcheckTrend.add(res.timings.duration);

    const passed = check(res, {
      'status is 200': (r) => r.status === 200,
      'body contains UP status': (r) => {
        try {
          const json = JSON.parse(r.body);
          return json.status === 'UP';
        } catch {
          return false;
        }
      }
    });
    errorRate.add(!passed);
  });

  // Realistic pacing between virtual user iterations (1 to 2 seconds)
  sleep(Math.random() * 1 + 1);
}
