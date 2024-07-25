import React,{useContext} from 'react'
import {Context} from "../../main"
import HeroSection from "./HeroSection"
import HowItWorks from "./HowItWorks"
import PopularCategories from "./PopularCategories"
import PopularCompanies from "./PopularCompanies"
import { Navigate } from 'react-router-dom'


const home = () => {
  const {isAuthorized} = useContext(Context);
  if(!isAuthorized){
    return <Navigate to = {'/login'}/>
  }
  return (
    <section className="homepage page">
      <HeroSection/>
      <HowItWorks/>
      <PopularCategories/>
      <PopularCompanies/>
    </section>
  )
}

export default home
