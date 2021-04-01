import React, { useState } from 'react'
import { Datep } from 'datep'
import 'datep/dist/index.css'
import moment from 'moment'

const App = () => {
  const [date, setDate] = useState<any>(moment())
  const onChangeDate = (arg: any) => {
    setDate(arg.date)
    console.log(arg.period,"date")
  }
  return <div className='container'>
    <div className='date'>
      <Datep mode='period' onChange={onChangeDate} defaultDate={date} />
    </div>
  </div>
}

export default App
