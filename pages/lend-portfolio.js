import React from 'react'
import Footer from '../components/Footer/footer'
import LendPortfolioComp from '../components/LendPortfolioComp/lendPortfolioComp'
import Navbar from '../components/Navbar/Navbar'
import PortfolioComp from '../components/PortfolioComp/portfolioComp'

const LendPortfolio = () => {
  return (
    <div>
      <Navbar />
      <LendPortfolioComp />
      <Footer />
    </div>
  )
}

export default LendPortfolio