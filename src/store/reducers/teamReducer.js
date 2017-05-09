export default function reducer(

  state = {
      team: [],
      metrics: []
  }, action) {

    switch (action.type) {


      case "GOT_TEAM": {

        return {
            ...state,
            team: action.payload
          }

      }

      case "GOT_METRICS": {

        return {
            ...state,
            metrics: action.payload
          }

      }

    }

    return state

}
