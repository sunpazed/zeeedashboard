class Helpers {

  constructor() {

    this.formatTimeHS = this.formatTimeHS.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.formatMinsToDHMS = this.formatMinsToDHMS.bind(this);

  }

  // process minutes to day, hour, min, sec
  formatMinsToDHMS(minutes) {

    let timeslices = {
      weeks: (24*60*7),
      days: (24*60),
      hours: (60),
      minutes: (1)
    }
    let result = {};

    for (let key in timeslices) {
      let this_period = minutes / timeslices[key];
      result[key] = Math.floor(this_period);
      minutes = minutes - (Math.floor(this_period)*timeslices[key]);
    }

    return result;

  }

  // format time function
  formatTimeHS(time) {

    var hours = time.getHours();
    var minutes = time.getMinutes();

    var ampm = "AM";

    if (hours >= 12) {
    	if (hours > 12) {
    	hours = hours - 12;
  	}
    ampm = "PM";
    }

    if (minutes < 10) {
    minutes = "0" + minutes
    }

    return(hours + ":" + minutes + " " + ampm)
  }

  formatDateFromString(timestring) {
      return new Date(timestring).toLocaleString(window.navigator.userLanguage || window.navigator.language,{ year: 'numeric', weekday: 'short', month: 'long', day: 'numeric' });
  }

  formatDate(time) {
    let diff = (((new Date()).getTime() - time*1000) / 1000);
    let day_diff = Math.floor(diff / 86400);
    if (day_diff < 1) {
      return "Today";
    } else {
      return new Date(time*1000).toLocaleString(window.navigator.userLanguage || window.navigator.language,{ weekday: 'long', month: 'long', day: 'numeric' });
    }
  }



}

export default Helpers;
