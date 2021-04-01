import React, { Component } from 'react'
import style from './month.module.scss'
import moment from 'moment'
import { IoChevronBackSharp, IoChevronForwardSharp } from 'react-icons/io5'

class Monthp extends Component<{ date: Array<any>, onChange: (arg: Array<any>) => void }, any> {
  state = {
    selected: 'month'
  }

  isMonthIsSelected() {
    return this.state.selected === 'month'
  }

  isYearIsSelected() {
    return this.state.selected === 'year'
  }

  select(arg: string) {
    this.setState({ selected: arg })
  }

  increment() {
    const { date } = this.props
    const { selected } = this.state
    let nxt = date
    if (selected === 'month') nxt[1] = this.canIncrement(date[1], 11) ? date[1] + 1 : date[1]
    if (selected === 'year') nxt[0] = this.canIncrement(date[0], 2050) ? date[0] + 1 : date[0]
    this.props.onChange(nxt)
    console.log(nxt, 'incrementing ' + selected)
  }

  decrement() {
    const { date } = this.props
    const { selected } = this.state
    let nxt = date
    if (selected === 'month') nxt[1] = this.canDecrement(date[1]) ? date[1] - 1 : date[1]
    if (selected === 'year') nxt[0] = this.canDecrement(date[0]) ? date[0] - 1 : date[0]
    this.props.onChange(nxt)
    console.log(date, 'decrementing ' + selected)
  }

  canIncrement(arg: number, max = 0) {
    return arg < max
  }

  canDecrement(arg: number, min = 0): boolean {
    return arg > min
  }

  render() {
    let monthClass = `${style.month} ${this.isMonthIsSelected() ? style.active : ''}`
    let yearClass = `${style.year} ${this.isYearIsSelected() ? style.active : ''}`
    const { date } = this.props
    return (
      <div className={style.monthp}>
        <div className={style.date}>
          <button onClick={() => this.select('month')} type='button'
                  className={monthClass}>{moment().month(date[1]).format('MMM')}</button>
          <button onClick={() => this.select('year')} type='button' className={yearClass}>{date[0]}</button>
        </div>
        <aside className={style.actions}>
          <button onClick={this.decrement.bind(this)} type='button' className={style.action}><IoChevronBackSharp />
          </button>
          <button onClick={this.increment.bind(this)} type='button' className={style.action}><IoChevronForwardSharp />
          </button>
        </aside>
      </div>
    )
  }
}

export default Monthp
