import React from 'react'
import style from './date.module.scss'
import Monthp from './monthp'
import moment from 'moment'
import { isArray } from 'lodash'

type DatepProps = { mode: 'normal' | 'period', defaultPeriod?: any[], defaultDate?: any[]; onChange?: (arg: any) => void; }
type MonthDaysProps = { date: any[], period: any[], selected: any; select: (arg: any) => void; onChange: (arg: any, e?: any) => void }

const WeekDayName = ({ date }: any) => {
  const days = []
  for (let i = 1; i <= 7; i++) {
    days.push(() => <th>{moment(date).isoWeekday(i).format('dd')}</th>)
  }
  return (
    <tr>
      {days?.map((Day, idx) => <Day key={idx} />)}
    </tr>
  )
}

const MonthDays = (props: MonthDaysProps) => {

  const { date = [2020, 1], period, selected } = props
  const days = 35
  const nWeek = 5
  const weeks: any[] = []
  let lastDayOfTheWeek = 1

  const isToday = (arg: any) => {
    return selected ? arg === selected.dayOfYear() : moment().dayOfYear() === arg
  }

  const isInMonth = (arg: number) => date[1] === arg

  const isInPeriod = (arg: number) => {
    if (isArray(period) && period.length > 1) {
      const start = period[0]?.dayOfYear()
      const end = period[1]?.dayOfYear()
      return arg >= start && arg <= end
    }
    return false
  }

  const isStartPeriod = (arg: number) => {
    if (isInPeriod(arg)) {
      const start = period[0]?.dayOfYear()
      return arg === start
    }
    return false
  }

  const isEndPeriod = (arg: number) => {
    if (isInPeriod(arg)) {
      const end = period[1]?.dayOfYear()
      return arg === end
    }
    return false
  }

  const onClick = (e: any, arg: any) => {
    let payload: any = []
    payload.date = arg
    payload.formatted = arg.format()
    payload.year = arg.format('Y')
    payload.month = arg.format('MM')
    payload.day = arg.format('DD')
    props.onChange && props.onChange(payload, e)
    props.select && props.select(arg)
  }

  for (let i = 0; i < nWeek; i++) {
    const weekDays: any[] = []
    for (let i = 1; i <= 7; i++) {
      if (lastDayOfTheWeek <= days) {
        const currDay = lastDayOfTheWeek
        const currDate = moment.utc(date).day(currDay)

        let dayClass = `${isToday(currDate.dayOfYear()) ? style.today : ''}`
        dayClass = `${dayClass} ${isInMonth(currDate.month()) ? style.isInMonth : ''}`
        dayClass = `${dayClass} ${isInPeriod(currDate.dayOfYear()) ? style.isInPeriod : ''}`
        dayClass = `${dayClass} ${isStartPeriod(currDate.dayOfYear()) ? style.isStart : ''}`
        dayClass = `${dayClass} ${isEndPeriod(currDate.dayOfYear()) ? style.isEnd : ''}`

        weekDays.push(() => (
          <React.Fragment>
            <td
              className={dayClass}
              title={currDate.format('dd, LLL')}>
              <button
                onClick={(e) => onClick(e, currDate)}
                type='button'
                className={style.day}>{currDate.format('DD')}</button>
            </td>
          </React.Fragment>
        ))
        lastDayOfTheWeek = lastDayOfTheWeek + 1
      }
    }
    weeks.push(() => (<tr>{weekDays?.map((Day, idx) => <Day key={idx} />)}</tr>))
  }

  return (
    <React.Fragment>
      {weeks?.map((Week, idx) => <Week key={idx} />)}
    </React.Fragment>)
}

class Datep extends React.Component<DatepProps, any> {
  state: any = {
    date: [moment().year(), moment().month()],
    period: [],
    selected: moment()
  }

  setDate(date: Array<any>) {
    this.setState({ date: date })
  }

  isAValidEndDate(s: any, e: any) {
    let start = s.dayOfYear()
    let end = e.dayOfYear()
    return start <= end
  }

  onChange(arg: any) {
    const { mode, onChange } = this.props
    if (mode === 'period') {
      let period = this.state.period
      const date = arg.date
      if (isArray(period) && period?.length == 1) {
        if (this.isAValidEndDate(period[0], date)) {
          period[1] = date
          this.setState({ period })
          arg.period = period.map((p) => p.format())
          onChange && onChange(arg)
        } else {
          this.setState({ period: [] })
        }
      } else {
        this.setState({ period: [date] })
        arg.period = [date.format()]
        onChange && onChange(arg)
      }
    } else {
      onChange && onChange(arg)
    }
  }

  select(d: any) {
    this.setState({ selected: d })
  }

  render() {
    const { defaultDate, defaultPeriod }: any = this.props
    let date = defaultDate && [defaultDate.year(), defaultDate.month()]
    return (
      <div className={style.container}>
        <Monthp date={date || this.state.date} onChange={this.setDate?.bind(this)} />
        <section>
          <table>
            <tbody>
            <WeekDayName date={date || this.state.date} />
            <MonthDays
              select={this.select.bind(this)}
              selected={defaultDate || this.state.selected}
              date={date || this.state.date}
              period={defaultPeriod || this.state.period}
              onChange={this.onChange?.bind(this)}
            />
            </tbody>
          </table>
        </section>
      </div>
    )
  }
}

export default Datep
