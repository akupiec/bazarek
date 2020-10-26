import * as axios from 'axios';
import * as Qs from 'qs';

const paramsSerializer = function(params) {
  return Qs.stringify(params, { arrayFormat: 'repeat' });
};

export function fetchPickers() {
  return axios.get('http://localhost:9090/toPick').then(resp => resp.data, (e) => console.error(e));
}

export function fetchGames(filters) {
  let url = 'http://localhost:9090/finder';
  const params = {
    ...filters,
  };
  return axios.get(url, { params, paramsSerializer }).then(resp => resp.data, (e) => console.error(e));
}

export function saveCustomGame(id, type) {
  let url = 'http://localhost:9090/saveCustom/' + id;
  const data = {
    type,
    user: 0,
  };
  return axios.post(url, data).then(resp => resp.data, (e) => console.error(e));
}