import {useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {doc, getDoc} from 'firebase/firestore';
import {getAuth} from 'firebase/auth';
import {db} from '../firebase.config';
import Spinner from '../components/Spinner';
import shareIcon from '../assets/svg/shareIcon.svg';
// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import {MapContainer, Marker, Popup, TileLayer} from 'react-leaflet';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import { useSwiper } from 'swiper/react';

function Listing() {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setSharedLinkCopied] = useState(null);

  const swiper = useSwiper();
  const navigate = useNavigate();
  const params = useParams();
  const auth = getAuth();

  useEffect(() => {

    const fetchListing = async () => {

      //get data from db
      const docRef = doc(db, 'listings', params.listingId);
      const docSnap = await getDoc(docRef);

      console.log(docSnap.data());

      if (docSnap.exists()) {
        console.log(docSnap.data());
        setListing(docSnap.data());
        setLoading(false);
      }
    };

    fetchListing();
  }, [navigate, params.listingId]);

  if (loading) {
    return <Spinner/>;
  }
  return (
      <main>
        <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            slidesPerView={1}
            pagination={{clickable: true}}
            spaceBetween={50}
            navigation
            scrollbar={{draggable: true}}
            onSwiper={(swiper) => console.log(swiper)}
            onSlideChange={() => console.log('slide change')}>
          {listing.imgUrls.map((list, index) => (

              <SwiperSlide key={index}>
                <div className="swiperSlideDiv">
                  <img src={list} alt="img" width="100%" height="100%"/>
                </div>
              </SwiperSlide>

          ))}
        </Swiper>


        <div className="shareIconDiv" onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setSharedLinkCopied(true);
          setTimeout(() => {
            setSharedLinkCopied(false);
          }, 2000);
        }}>
          <img src={shareIcon} alt=""/>
        </div>
        {shareLinkCopied && <p className="linkCopied">Link Copied</p>}
        <div className="listingDetails">
          <p className="listingName">
            {listing.name} - $
            {listing.offer
                ?
                listing.discountedPrice.toString().
                    replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                :
                listing.regularPrice.toString().
                    replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          </p>
          <p className="listingLocation">
            {listing.location}
          </p>
          <p className="listingType">
            For {listing.type === 'rent' ? 'Rent' : 'Sale'}
          </p>
          {listing.offer && (
              <p className="discountPrice">
                ${listing.regularPrice - listing.discountedPrice} discount
              </p>
          )}

          <ul className="listingDetailsList">
            <li>
              {listing.bedrooms > 1 ?
                  `${listing.bedrooms} Bedrooms` :
                  '1 Bedroom'}
            </li>
            <li>
              {listing.bathrooms > 1 ?
                  `${listing.bathrooms} Bathroom` :
                  '1 Bathroom'}
            </li>
            <li>
              {listing.parking && 'Parking Spot'}
            </li>
            <li>
              {listing.furnished && 'Furnished'}
            </li>
          </ul>
          <p className="listingLocationTitle">
            Location
          </p>

          <div className="leafletContainer">
            <MapContainer style={{
              height: '100%',
              width: '100%',
            }}
                          center={[
                            listing.geolocation.lat,
                            listing.geolocation.lng]}
                          zoom={13}
                          scrollWheelZoom={false}>
              <TileLayer
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
              />
              <Marker
                  position={[listing.geolocation.lat, listing.geolocation.lng]}>
                <Popup>{listing.location}</Popup>
              </Marker>
            </MapContainer>
          </div>

          {auth.currentUser?.uid !== listing.userRef && (
              <Link
                  to={`/contact/${listing.userRef}?listingName=${listing.name}`}
                  className="primaryButton">
                Contact LandLord
              </Link>
          )}
        </div>
      </main>
  );
}

export default Listing;
