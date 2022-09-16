import {Link} from 'react-router-dom'
import rentCategoryImage from '../assets/jpg/rentCategoryImage.jpg'
import sellCategoryImage from '../assets/jpg/sellCategoryImage.jpg'
import Slider from '../components/Slider';
import {ReactComponent as EditIcon} from '../assets/svg/editIcon.svg';


function Explore(){

  return(
      <>
      <div className="exploreCategories2">
        <EditIcon className='editIcon' />
        <Link to='/create-listing'>
          <p className="exploreCategoryHeading2">
            Create Listing
          </p>
        </Link>
      </div>
      <div className="explore">
        <header>
          <p className="pageHeader">Explore</p>
        </header>

        <main>
       <Slider />
          <p className="exploreCategoryHeading">
            Categories
          </p>
          <div className="exploreCategories">
            <Link to='/categories/rent'>
              <img src={rentCategoryImage} alt="rent" className="exploreCategoryImg"/>
              <p className="exploreCategoryName">Places for rent</p>
            </Link>
            <Link to='/categories/sale'>
              <img src={sellCategoryImage} alt="sell" className="exploreCategoryImg"/>
              <p className="exploreCategoryName">Places for sale</p>
            </Link>
          </div>
        </main>
      </div>
      </>
  )
}

export default Explore
