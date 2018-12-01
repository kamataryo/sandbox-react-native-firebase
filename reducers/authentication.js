const SET = 'AUTHENTICATION.SET'
const UNSET = 'AUTHENTICATION.UNSET'

const initialState = {
  data: false
}

export const createActions = {
  set: data => ({ type: SET, payload: { data } }),
  unset: () => ({ type: UNSET, payload: {} })
}

export const reducer = (state = initialState, action) => {
  const { type, payload } = action

  if (type === SET) {
    const { data } = payload
    return { ...state, data }
  } else if (type === UNSET) {
    return { ...state, data: false }
  } else {
    return state
  }
}
