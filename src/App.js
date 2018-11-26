import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons'

library.add(faPlusCircle)
library.add(faMinusCircle)

class App extends Component {
  constructor(props){
      super(props)
      let days = [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
      ]

      let startTimes = []
      let endTimes = []
      let lunches = []
      let totalHours = []
      let daysOff = []
      let hideSelectors = []
      let dayOffType = []
      let halfDayHours = []

      days.forEach((day, i) => {
          startTimes.push("08:45")
          endTimes.push("17:30")
          lunches.push("0.5")
          totalHours.push(0)
          daysOff.push(false)
          hideSelectors.push(false)
          dayOffType.push("Not Selected")
          halfDayHours.push(0)
      })

      this.state= {
          startTime: startTimes,
          endTime: endTimes,
          lunch: lunches,
          totalHours: totalHours,
          days: days,
          daysOff: daysOff,
          hideSelectors: hideSelectors,
          dayOffType: dayOffType,
          halfDayHours: halfDayHours
      }
  }

  componentDidMount(){
      this.state.days.forEach((day, i) => {
          this.calculateTotalHours(i)
      })
  }

  handleChangeStartTime(i, e){
      let startTime = this.state.startTime
      startTime[i] = e.target.value

      this.setState({
          startTime: startTime
      }, () => {this.calculateTotalHours(i)})
  }

  handleChangeEndTime(i, e){
      let endTime = this.state.endTime
      endTime[i] = e.target.value

      this.setState({
          endTime: endTime
      }, () => {this.calculateTotalHours(i)})
  }

  handleChangeLunch(i, e){
      let lunch = this.state.lunch
      lunch[i] = e.target.value

      this.setState({
          lunch: lunch
      }, () => {this.calculateTotalHours(i)})
  }

  addTimeOff(i){
      let daysOff = this.state.daysOff
      daysOff[i] = true
      this.setState({
          daysOff: daysOff
      })
  }

  removeTimeOff(i){
      let daysOff = this.state.daysOff
      daysOff[i] = false

      let hideSelectors = this.state.hideSelectors
      hideSelectors[i] = false

      let dayOffType = this.state.dayOffType
      dayOffType[i] = "Not Selected"

      this.setState({
          daysOff: daysOff,
          hideSelectors: hideSelectors,
          dayOffType: dayOffType
      }, () => {this.calculateTotalHours(i)})
  }

  addDayOff(i, type){
      let totalHours = this.state.totalHours
      let hideSelectors = this.state.hideSelectors
      let dayOffType = this.state.dayOffType
      let startTime = this.state.startTime
      let endTime = this.state.endTime
      let halfDayHours = this.state.halfDayHours

      switch (type) {
          case "full":
              totalHours[i] = 7.5
              hideSelectors[i] = true
              dayOffType[i] = "Full Day"
              break;
          case "half":
              totalHours[i] = 3.75
              dayOffType[i] = "Half Day"
              hideSelectors[i] = true
              startTime[i] = "09:00"
              endTime[i] = "13:15"
              halfDayHours[i] = 3.75
              break;
          case "condensed":
              totalHours[i] = 0
              hideSelectors[i] = true
              dayOffType[i] = "Condensed"
              break;
      }

      this.setState({
          totalHours: totalHours,
          hideSelectors: hideSelectors,
          dayOffType: dayOffType,
          startTime: startTime,
          endTime: endTime,
          halfDayHours: halfDayHours
      })
  }

  calculateTotalHours(i){
      let totalHours = this.state.totalHours;
      let halfDayHours = this.state.halfDayHours;
      let startTime = this.state.startTime[i].split(":");
      let endTime = this.state.endTime[i].split(":");

      let earlyHours = startTime[1] !== "00" ? (60 - startTime[1])/60 : 0
      let lateHours = endTime[1] !== "00" ? 1 - (60 - endTime[1])/60 : 0

      let startHour =  startTime[1] !== "00" ? parseInt(startTime[0]) + 1 : startTime[0]

      if(this.state.dayOffType[i] === "Half Day"){
          halfDayHours[i] = (endTime[0]-startHour) + earlyHours + lateHours - this.state.lunch[i]
      } else {
          totalHours[i] = (endTime[0]-startHour) + earlyHours + lateHours - this.state.lunch[i]
      }

      this.setState({
          totalHours: totalHours,
          halfDayHours: halfDayHours
      })
  }

  showSubTotal(i){
      let subTotal = "subTotal"+i
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      let thisWeek = i === 4 ? this.state.totalHours.slice(0,5).concat(this.state.halfDayHours.slice(0,5)) : this.state.totalHours.slice(5,10).concat(this.state.halfDayHours.slice(5,10))
      let subTotalValue = thisWeek.reduce(reducer)
      return(
          <div>
              <div className="form-group offset-md-8 col-md-2">
                  <label htmlFor={subTotal}>Weekly Hours</label>
                  <input className="form-control" type="text" id={subTotal} readOnly
                         style={{"backgroundColor": "white"}} value={subTotalValue}></input>
              </div>
              <br/>
          </div>
      )
  }

  calculateFortnightTotal(){
      const reducer = (accumulator, currentValue) => accumulator + currentValue;
      return this.state.totalHours.concat(this.state.halfDayHours).reduce(reducer)
  }

  createOptions(timesArray){
      return timesArray.map((time, i) => {
          return <option key={i}>{time}</option>
      })
  }

  render() {
      let startTimes = [
          "08:00",
          "08:15",
          "08:30",
          "08:45",
          "09:00",
          "09:15",
          "09:30",
          "09:45",
          "10:00"
      ]

      let extraStartTimes = [
          "10:15",
          "10:30",
          "10:45",
          "11:00",
          "11:15",
          "11:30",
          "11:45",
          "12:00",
          "12:15",
          "12:30",
          "12:45",
          "13:00",
          "13:15",
          "13:30",
          "13:45"
      ]

      let endTimes = [
          "16:00",
          "16:15",
          "16:30",
          "16:45",
          "17:00",
          "17:15",
          "17:30",
          "17:45",
          "18:00",
          "18:15",
          "18:30",
          "18:45",
          "19:00"
      ]

      let extraEndTimes = [
          "12:15",
          "12:30",
          "12:45",
          "13:00",
          "13:15",
          "13:30",
          "13:45",
          "14:00",
          "14:15",
          "14:30",
          "14:45",
          "15:00",
          "15:15",
          "15:30",
          "15:45"
      ]

      var dayRows = []

      this.state.days.forEach((day, i) => {
          let breadcrumb = "breadcrumb"
          let startTime = "startTime"+i
          let endTime = "endTime"+i
          let lunch = "lunch"+i
          let totHours = "totHours"+i
          let totHoursHalfDay = "totHoursHalfDay"+i

          dayRows.push(
              <div key={day+i}>
                  <div className="row" id={day + i} key={day+i}>
                      <div className="col-md-2">
                          <label htmlFor={breadcrumb}></label>
                          <nav aria-label="breadcrumb">
                              <ol className={breadcrumb}>
                                  <li className="breadcrumb-item active" aria-current="page">{day}</li>
                              </ol>
                          </nav>
                      </div>
                      <div className="form-group col-md-2">
                          {this.state.hideSelectors[i] === false ?
                          <div>
                              <label htmlFor={startTime}>Start Time</label>
                              <select className="form-control" id={startTime} value={this.state.startTime[i]} onChange={this.handleChangeStartTime.bind(this, i)}>
                                  {this.createOptions(startTimes)}
                              </select>
                          </div>: null}
                      </div>
                      <div className="form-group col-md-2">
                          {this.state.hideSelectors[i] === false ?
                          <div>
                              <label htmlFor={endTime}>End Time</label>
                              <select className="form-control" id={endTime} value={this.state.endTime[i]} onChange={this.handleChangeEndTime.bind(this, i)}>
                                  {day === "Friday" ? this.createOptions(endTimes) : this.createOptions(endTimes.slice(4,13))}
                              </select>
                          </div>: null}
                      </div>
                      <div className="form-group col-md-2">
                          {this.state.hideSelectors[i] === false ?
                          <div>
                              <label htmlFor={lunch}>Lunch (hours)</label>
                              <select className="form-control" id={lunch} value={this.state.lunch[i]} onChange={this.handleChangeLunch.bind(this, i)}>
                                  <option>0</option>
                                  <option>0.5</option>
                                  <option>0.75</option>
                                  <option>1</option>
                              </select>
                          </div>: null}
                      </div>
                      <div className="form-group col-md-2">
                          <label htmlFor={totHours}>Hours</label>
                          <input className="form-control" type="text" id={totHours} readOnly
                                 style={{"backgroundColor": "white"}} value={this.state.totalHours[i]}></input>
                      </div>
                      <div className="form-group col-md-2">
                          <label htmlFor={"alBtn"+i}>Time Off</label>
                          {this.state.daysOff[i] === false ?
                          <button type="button" id={"alBtn"+i} className="btn btn-success" onClick={this.addTimeOff.bind(this, i)}>
                              Add Day <FontAwesomeIcon icon="plus-circle" />
                          </button> :
                          <button type="button" id={"alBtn"+i} className="btn btn-danger" onClick={this.removeTimeOff.bind(this, i)}>
                              {this.state.dayOffType[i] + " "} <FontAwesomeIcon icon="minus-circle" />
                          </button> }
                      </div>
                  </div>
                  {this.state.dayOffType[i] === "Half Day" ?
                      <div className="row">
                          <div className="form-group offset-md-2 col-md-2">
                              <label htmlFor={startTime}>Start Time</label>
                              <select className="form-control" id={startTime} value={this.state.startTime[i]} onChange={this.handleChangeStartTime.bind(this, i)}>
                                  {this.createOptions(startTimes.concat(extraStartTimes))}
                              </select>
                          </div>
                          <div className="form-group col-md-2">
                              <div>
                                  <label htmlFor={endTime}>End Time</label>
                                  <select className="form-control" id={endTime} value={this.state.endTime[i]} onChange={this.handleChangeEndTime.bind(this, i)}>
                                      {day === "Friday" ? this.createOptions(extraEndTimes.concat(endTimes)) : this.createOptions(extraEndTimes.slice(4,15).concat(endTimes.slice(4,13)))}
                                  </select>
                              </div>
                          </div>
                          <div className="form-group col-md-2">
                              <label htmlFor={lunch}>Lunch (hours)</label>
                              <select className="form-control" id={lunch} value={this.state.lunch[i]} onChange={this.handleChangeLunch.bind(this, i)}>
                                  <option>0</option>
                                  <option>0.5</option>
                                  <option>0.75</option>
                                  <option>1</option>
                              </select>
                          </div>
                          <div className="form-group col-md-2">
                              <label htmlFor={totHoursHalfDay}>Hours</label>
                              <input className="form-control" type="text" id={totHoursHalfDay} readOnly
                                     style={{"backgroundColor": "white"}} value={this.state.halfDayHours[i]}></input>
                          </div>
                      </div>
                  : null}
                  {this.state.daysOff[i] ?
                  <div className="row">
                      <div className="offset-md-2 col-md-2">
                          <button type="button" id={"fullDay"+i} className="btn btn-primary" onClick={this.addDayOff.bind(this, i, "full")}>Full Day Leave</button>
                      </div>
                      <div className="col-md-2">
                          <button type="button" id={"fullDay"+i} className="btn btn-info" onClick={this.addDayOff.bind(this, i, "half")}>Half Day Leave</button>
                      </div>
                      <div className="col-md-2">
                          <button type="button" id={"fullDay"+i} className="btn btn-warning" onClick={this.addDayOff.bind(this, i, "condensed")}>Condensed Day</button>
                      </div>
                  </div> : null}
                  {day === "Friday" ? this.showSubTotal(i) : null}
              </div>
          )
      })


    return (
      <div className="container">
          <div className="row">
              <h3>Timecalc</h3>
          </div>
          {dayRows}
          <br/>
          <div className="form-group offset-md-8 col-md-2">
              <label htmlFor="fortnightTotal">Total Fortnight</label>
              <input className="form-control" type="text" id="fortnightTotal" readOnly
                     style={{"backgroundColor": "white"}} value={this.calculateFortnightTotal()}></input>
          </div>
          <br/>
      </div>
    );
  }
}

export default App;
