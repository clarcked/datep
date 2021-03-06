import * as React from 'react'
import styles from './styles.module.css'
import Monthp from './monthp'
import Datep from './datep'

interface Props {
  text: string
}

export const ExampleComponent = ({ text }: Props) => {
  return <div className={styles.test}>Example Component: {text}</div>
}

export { Datep, Monthp }
