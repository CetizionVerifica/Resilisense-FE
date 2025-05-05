import {useEffect, useState} from 'react'

export default function useWindow() {
  const [width, setWidth] = useState(window.innerWidth)
  const [height, setHeight] = useState(window.innerHeight)
  useEffect(() => {
    function handleChange() {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }
    window.addEventListener('resize', handleChange)
    return () => {
      window.removeEventListener('resize', handleChange)
    }
  }, [])

  return {width, height}
}
