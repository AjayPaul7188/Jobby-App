import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {HiLocationMarker} from 'react-icons/hi'

import './index.css'

const JobCard = props => {
  const {job} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = job

  return (
    <Link to={`/jobs/${id}`} className="link-item">
      <li className="each-job-list">
        <div className="job-header">
          <img
            className="company-logo"
            src={companyLogoUrl}
            alt="company logo"
          />
          <div className="job-head-rate">
            <h1 className="company-title">{title}</h1>
            <p className="company-rating">
              <AiFillStar className="star-icon" /> {rating}
            </p>
          </div>
        </div>

        <div className="job-loc">
          <div className="job-loc1">
            <HiLocationMarker className="loc-icon" />
            <p className="loc-name">{location}</p>
            <BsFillBriefcaseFill className="loc-icon" />
            <p className="loc-name">{employmentType}</p>
          </div>
          <h1 className="ctc">{packagePerAnnum}</h1>
        </div>
        <hr className="line" />

        <h1 className="job-sub-heading">Description</h1>
        <p className="job-description">{jobDescription}</p>
      </li>
    </Link>
  )
}

export default JobCard
