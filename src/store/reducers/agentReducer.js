export default function reducer(

  state = {
      agent: []
  }, action) {

    switch (action.type) {


      case "GOT_AGENT": {
        return {
            ...state,
            agent: action.payload
          }

      }

    }

    return state

}
