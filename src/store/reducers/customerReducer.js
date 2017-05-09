export default function reducer(state={
    customers: []
  }, action) {

    switch (action.type) {
  
      case "GOT_CUSTOMERS": {
        return {
          ...state,
          customers: action.payload,
        }
  
      }
  
    }
    return state
}
