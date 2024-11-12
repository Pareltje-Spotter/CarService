import http from 'k6/http';
import {sleep, check} from 'k6'

export const options = {
    vus: 10,
    duration: '5m'
}

export default function(){
    const res = http.get('http://localhost/markerinfo/');
    check(res,{
        'status was 200': (r) => r.status == 200,
        'response was <= 200ms': (r) => r.timings.duration <= 200,
    });
    sleep(1);
}