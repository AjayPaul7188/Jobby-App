import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {AiFillStar} from 'react-icons/ai'
import {BsFillBriefcaseFill, BsBoxArrowUpRight} from 'react-icons/bs'
import {HiLocationMarker} from 'react-icons/hi'

import Header from '../Header'
import SimilarJobs from '../SimilarJobs'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    jobItemDetails: {},
    requiredSkills: [],
    similarJobDetails: {},
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getJobItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const {match} = this.props
    const {params} = match
    const {id} = params

    const itemUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(itemUrl, options)
    const data = await response.json()
    if (response.ok) {
      const updatedJobDetails = {
        companyLogoUrl: data.job_details.company_logo_url,
        companyWebsiteUrl: data.job_details.company_website_url,
        employmentType: data.job_details.employment_type,
        id: data.job_details.id,
        jobDescription: data.job_details.job_description,
        companyLifeDescription: data.job_details.life_at_company.description,
        companyLifeImageUrl: data.job_details.life_at_company.image_url,
        location: data.job_details.location,
        packagePerAnnum: data.job_details.package_per_annum,
        rating: data.job_details.rating,
        title: data.job_details.title,
      }

      const skillsFetch = data.job_details.skills.map(eachSkill => ({
        skillsImageUrl: eachSkill.image_url,
        skillsName: eachSkill.name,
      }))

      const sameJobs = data.similar_jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        jobItemDetails: updatedJobDetails,
        requiredSkills: skillsFetch,
        similarJobDetails: sameJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobsDetailsFetchingFailed = () => {
    const onClickJobsRetry = () => {
      this.getJobItemDetails()
    }

    return (
      <>
        <img
          className="job-failed-img"
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
        />
        <h1 className="jobs-failure-heading">Oops! Something Went Wrong</h1>
        <p className="jobs-failure-para">
          We cannot seem to find the page you are looking for.
        </p>
        <button className="retry-btn" type="button" onClick={onClickJobsRetry}>
          Retry
        </button>
      </>
    )
  }

  renderJobsDetailsSuccessView = () => {
    const {jobItemDetails, requiredSkills, similarJobDetails} = this.state

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      companyLifeDescription,
      companyLifeImageUrl,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobItemDetails

    return (
      <>
        <div className="job-details-sub-cont">
          <div className="job-header">
            <img
              className="company-logo"
              src={companyLogoUrl}
              alt="job details company logo"
            />
            <div className="job-head-rate">
              <h1 className="company-title">{title}</h1>
              <p className="company-rating" style={{fontSize: '20px'}}>
                <AiFillStar className="star-icon" /> {rating}
              </p>
            </div>
          </div>

          <div className="job-loc">
            <ul className="job-loc1-list">
              <li className="each-loc">
                <HiLocationMarker className="loc-icon" />
                <p className="loc-name">{location}</p>
              </li>
              <li className="each-loc">
                <BsFillBriefcaseFill className="loc-icon" />
                <p className="loc-name">{employmentType}</p>
              </li>
            </ul>
            <p className="ctc">{packagePerAnnum}</p>
          </div>
          <hr className="line" />

          <div className="job-loc">
            <h1 className="job-sub-heading" style={{fontSize: '25px'}}>
              Description
            </h1>
            <a className="visit-link" href={companyWebsiteUrl}>
              Visit <BsBoxArrowUpRight />
            </a>
          </div>

          <p className="job-description" style={{fontSize: '20px'}}>
            {jobDescription}
          </p>

          <h1 className="job-sub-heading" style={{fontSize: '25px'}}>
            Skills
          </h1>

          <ul className="skills-list">
            {requiredSkills.map(eachOne => (
              <li className="each-skill" key={eachOne.skillsName}>
                <img
                  className="skill-img"
                  src={eachOne.skillsImageUrl}
                  alt={eachOne.skillsName}
                />
                <p className="skills-name">{eachOne.skillsName}</p>
              </li>
            ))}
          </ul>

          <h1 className="job-sub-heading" style={{fontSize: '25px'}}>
            Life at Company
          </h1>
          <div className="company-life-cont">
            <p
              className="job-description"
              style={{fontSize: '20px', width: '70%'}}
            >
              {companyLifeDescription}
            </p>
            <img
              className="company-life-img"
              src={companyLifeImageUrl}
              alt="life at company"
            />
          </div>
        </div>

        <div className="similar-jobs-cont">
          <h1 className="similar-job-heading">Similar Jobs</h1>
          <ul className="similar-job-list">
            {similarJobDetails.map(eachOne => (
              <SimilarJobs jobDetails={eachOne} key={eachOne.id} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderJobViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()

      case apiStatusConstants.success:
        return this.renderJobsDetailsSuccessView()

      case apiStatusConstants.failure:
        return this.renderJobsDetailsFetchingFailed()

      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-details-container">{this.renderJobViews()}</div>
      </>
    )
  }
}

export default JobItemDetails
