import {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {collection, getDocs, query, orderBy, limit} from 'firebase/firestore'
import {db} from '../firebase.config'
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import {Swiper, SwiperSlide, useSwiper} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Spinner from './Spinner';

function Slider(){

  const [loading, setLoading] = useState(true)
  const [listings,setListings] = useState(null)
  const navigate = useNavigate()
  const swiper = useSwiper();

  useEffect(() =>{

    const fetchListings = async() =>{
      //get all the records from db
      const listingsRef = collection(db,'listings')
      const q = query(listingsRef, orderBy('timestamp','desc'),limit(5))
      const querySnap = await getDocs(q)

      const listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })

      console.log(listings)
      setListings(listings)
      setLoading(false)
    }

    fetchListings()
  },[])

  if(loading){
    return <Spinner />
  }

  if(listings.length === 0){
    return <></>
  }
  return listings && (
      <>
        <p className="exploreHeading">
          Recommended
        </p>
        <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={1}
            pagination={{clickable: true}}
            spaceBetween={50}
            navigation
            scrollbar={{draggable: true}}
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log('slide change')}
        >
          {listings.map(({data,id}) => (
              <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
                <div className="swiperSlideDiv"
                style={{
                  background: `url(${data.imgUrls[0]}) center no-repeat`,
                  backgroundSize: 'cover'
                }}>
                  <p className="swiperSlideText">{data.name}</p>
                  <p className="swiperSlidePrice">${data.discountedPrice ?? data.regularPrice}
                    {' '}
                    {data.type === "rent" && '/ month'}</p>
                </div>
              </SwiperSlide>
          ))}

        </Swiper>
      </>
  )
}

export default Slider
