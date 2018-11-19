import { call, put, takeLatest } from 'redux-saga/effects';
import request from 'utils/request';
import {
  FETCH_SOURCE_LIST,
  TOGGLE_SOURCE_AUTO_DISCOVER,
  ADD_OR_UPDATE_SOURCE,
  DELETE_SOURCE,
  SET_PORTS
} from './constants';
import {
  fetchSourceListSuccess,
  fetchSourceListFail,
  addOrUpdateSourceSuccess,
  addOrUpdateSourceFail,
  deleteSourceSuccess,
  deleteSourceFail,
  closeSourceEditor,
  fetchSourceList
} from './actions';

export function* fetchSourcesListAPI() {
  const requestURL = `${process.env.API_URL}/api/sources/list`;

  try {
    const sourceList = yield call(request, requestURL);
    yield put(fetchSourceListSuccess(sourceList));
  } catch (err) {
    yield put(fetchSourceListFail(err));
  }
}

export function* toggleSourceAutoDiscover(action) {
  const requestURL = `${process.env.API_URL}/api/sources/${
    action.isSourceEnabled ? 'enable' : 'disable'
  }`;
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({ id: action.sourceId })
  };

  try {
    const sourceList = yield call(request, requestURL, requestOptions);
    // yield put(fetchSourceListSuccess(sourceList));
  } catch (err) {
    // yield put(fetchSourceListFail(err));
  }
}

export function* addOrUpdateSource(action) {
  const requestURL = `${process.env.API_URL}/api/sources/add`;
  const params = action.fields;
  if (action.id) {
    params.id = action.id;
  }
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify(params)
  };

  try {
    const res = yield call(request, requestURL, requestOptions);
    yield put(addOrUpdateSourceSuccess(res));
    yield put(fetchSourceList());
    yield put(closeSourceEditor());
  } catch (err) {
    yield put(addOrUpdateSourceFail(err));
  }
}

export function* deleteSource(action) {
  const requestURL = `${process.env.API_URL}/api/sources/delete`;
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify({ id: action.sourceId })
  };

  try {
    const res = yield call(request, requestURL, requestOptions);
    yield put(deleteSourceSuccess(res));
  } catch (err) {
    yield put(deleteSourceFail(err));
  }
}

export function* setPorts(action) {
  const requestURL = `${process.env.API_URL}/api/settings/setports`;
  const requestOptions = {
    method: 'POST',
    body: JSON.stringify(action.ports.split(','))
  };

  try {
    const res = yield call(request, requestURL, requestOptions);
    yield put(deleteSourceSuccess(res));
  } catch (err) {
    yield put(deleteSourceFail(err));
  }
}

export default function* sideBarSaga() {
  yield takeLatest(FETCH_SOURCE_LIST, fetchSourcesListAPI);
  yield takeLatest(TOGGLE_SOURCE_AUTO_DISCOVER, toggleSourceAutoDiscover);
  yield takeLatest(ADD_OR_UPDATE_SOURCE, addOrUpdateSource);
  yield takeLatest(DELETE_SOURCE, deleteSource);
  yield takeLatest(SET_PORTS, setPorts);
}
