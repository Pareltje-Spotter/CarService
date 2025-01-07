import http from 'k6/http';
import { sleep, check } from 'k6'

// export const options = {
//     vus: 500,
//     duration: '10m',
//     thresholds: {
//         http_req_duration: ['p(95)<200'],
//         http_req_duration: ['p(100)<2000']
//     }
// }

// export default function () {
//     const res = http.get('http://localhost:5002/markerinfo');
//     check(res, {
//         'status was 200': (r) => r.status == 200,
//         'response was < 2000ms (2s)': (r) => r.timings.duration < 2000,
//         'response was <= 200ms': (r) => r.timings.duration <= 200,
//     });
//     sleep(1);
// }

export const options = {
    thresholds: {
        http_req_failed: ['rate<0.01'], // http errors should be less than 1%
        http_req_duration: ['p(95)<200'], // 95% Response time under 200ms 
        http_req_duration: ['p(100)<2000'] // 100% Response time under 2000ms (2s) 
    },
    scenarios: {
        // standard_load_test: {
        //     executor: 'constant-arrival-rate',
        //     duration: '5m', // total duration
        //     preAllocatedVUs: 72, // to allocate runtime resources

        //     rate: 72, // number of constant iterations given `timeUnit`
        //     timeUnit: '1s',
        // },
        // spike_test_5x: {
        //     executor: 'ramping-arrival-rate',
        //     startRate: 36, // initial low rate
        //     timeUnit: '1s',
        //     stages: [
        //         { duration: '30s', target: 36 }, // maintain low rate (500 users)
        //         { duration: '10s', target: 360 }, // sudden spike to 360 iterations per second (5,000 users)
        //         { duration: '30s', target: 360 }, // maintain spike load (5,000 users)
        //         { duration: '10s', target: 36 }, // drop back to low rate (500 users)
        //     ],
        //     preAllocatedVUs: 400, // ensure enough VUs to handle the spike
        //     maxVUs: 450, // limit the maximum VUs that can be allocated
        // },
        spike_test_10x: {
            executor: 'ramping-arrival-rate',
            startRate: 36, // initial low rate
            timeUnit: '1s',
            stages: [
                { duration: '30s', target: 36 }, // maintain low rate (500 users)
                { duration: '10s', target: 720 }, // sudden spike to 360 iterations per second (10,000 users)
                { duration: '30s', target: 720 }, // maintain spike load (10,000 users)
                { duration: '10s', target: 36 }, // drop back to low rate (500 users)
            ],
            preAllocatedVUs: 750, // ensure enough VUs to handle the spike
            maxVUs: 10000, // limit the maximum VUs that can be allocated
        },
        // stress_test: {
        //     executor: 'ramping-arrival-rate',
        //     startRate: 36, // Start with a low number of requests.
        //     timeUnit: '1s',
        //     stages: [
        //         { duration: '30s', target: 36 }, // Initial steady low traffic. maintain low rate (500 users)
        //         { duration: '1m', target: 72 }, // Ramp up to 1000 users over 1 minute. (1000)
        //         { duration: '2m', target: 180 }, // Ramp up further to 2500 users. (2500 users)
        //         { duration: '2m', target: 360 }, // Push to 5000 users to test maximum system stress. (5000 users)
        //         { duration: '1m', target: 0 }, // Bring the traffic down gracefully.
        //     ],
        //     preAllocatedVUs: 400, // Pre-allocate virtual users to ensure they can ramp up with load.
        //     maxVUs: 550, // Cap the number of concurrent virtual users.
        // },
    },
};

export default function () {
    const url = "http://127.0.0.1:9080/markerinfo/";
    const params = {
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNIeWNzbU9Sbzg0M3ZPS0FPX0lIciJ9.eyJpc3MiOiJodHRwczovL3BhcmVsdGplLmV1LmF1dGgwLmNvbS8iLCJzdWIiOiJzeXFaRDVqZlNhMFVhRGdoQktianV5ZEt1YlpGaXFkMEBjbGllbnRzIiwiYXVkIjoiaHR0cHM6Ly9wYXJlbHRqZS5ubCIsImlhdCI6MTczMzgyNzMwMSwiZXhwIjoxNzMzOTEzNzAxLCJndHkiOiJjbGllbnQtY3JlZGVudGlhbHMiLCJhenAiOiJzeXFaRDVqZlNhMFVhRGdoQktianV5ZEt1YlpGaXFkMCJ9.rSOFJu3g5QMwopTM9y_DOgBb-z38-DM2NPRSLgXImd8EO-sUWff0TK0u55D9e0PAd3rMbIsPXP7RFCqt_XH3NOCr_kBTCNuBWfsA8kVetvR0Sjq6DfjGCn4qdWM31RmnuXIqge0-_j1NTMCP4GKCzx6Pmri2yux53K6c8V5tC7Lgt329EVX3DFNdaaWZm0u8WiQudVFGUulgXJdiRKtBQLnaji0lD1MSyYe26v3zZnJdfq3nFomBas9SoWK2g-pKRzNTjO2g5vI07WrmLIP4LfUnBQHnaVF0h5Mh-rWijm9eLI3b08VS4OUsU_6i0nGBef3LkmvcBpCjsqW391Vh0w', //if applicable
        },
    };
    const res = http.get(url, params);

    check(res, {
        'status was 200': (r) => r.status == 200
    });
}