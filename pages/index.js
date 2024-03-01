
import { Inter } from 'next/font/google'
import MainPage from './main'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (   
    <>    
      <MainPage />     
    </>
  )
}
