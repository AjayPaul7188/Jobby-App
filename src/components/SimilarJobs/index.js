import {AiFillStar} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {HiLocationMarker} from 'react-icons/hi'

import './index.css'

const SimilarJobs = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = jobDetails

  return (
    <li className="each-similar-list">
      <div className="job-header">
        <img
          className="company-logo"
          style={{height: '60px'}}
          src={companyLogoUrl}
          alt="similar job company logo"
        />
        <div className="job-head-rate">
          <h1 className="company-title">{title}</h1>
          <p className="company-rating">
            <AiFillStar className="star-icon" /> {rating}
          </p>
        </div>
      </div>

      <h1 className="job-sub-heading">Description</h1>
      <p className="job-description">{jobDescription}</p>

      <div className="job-loc1">
        <HiLocationMarker className="loc-icon" />
        <p className="loc-name">{location}</p>
        <BsFillBriefcaseFill className="loc-icon" />
        <p className="loc-name">{employmentType}</p>
      </div>
    </li>
  )
}

export default SimilarJobs
