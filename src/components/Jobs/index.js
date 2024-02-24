import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'

import Header from '../Header'
import JobCard from '../JobCard'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    allJobs: [],
    profileDetails: {},
    apiStatus: apiStatusConstants.initial,
    typeOfEmployment: '',
    salaryRange: '',
    searchWords: '',
    profileApiStatus: apiStatusConstants.initial,
    search: '',
    idList: [],
  }

  componentDidMount() {
    this.getJobsDetails()
    this.getProfileDetails()
  }

  renderProfileFailure = () => {
    const onClickProfileRetry = () => {
      this.getProfileDetails()
    }

    return (
      <div className="profile-container">
        <button
          className="retry-btn"
          type="button"
          onClick={onClickProfileRetry}
        >
          Retry
        </button>
      </div>
    )
  }

  getProfileDetails = async () => {
    this.setState({profileApiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const profileUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const profileResponse = await fetch(profileUrl, options)
    const profileData = await profileResponse.json()

    if (profileResponse.ok) {
      const updatedProfileData = {
        name: profileData.profile_details.name,
        profileImageUrl: profileData.profile_details.profile_image_url,
        shortBio: profileData.profile_details.short_bio,
      }

      this.setState({
        profileDetails: updatedProfileData,
        profileApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileApiStatus: apiStatusConstants.failure})
    }
  }

  renderJobsFetchingFailed = () => {
    const {search} = this.state
    const onClickJobsRetry = () => {
      this.getJobsDetails()
    }

    return (
      <>
        <div className="jobs-input-container">
          <input
            className="search-input"
            type="search"
            placeholder="Search"
            onChange={this.onChangeSearchInput}
            value={search}
          />
          <button
            className="search-btn"
            onClick={this.onClickSearchInput}
            type="button"
            data-testid="searchButton"
          >
            <BsSearch className="search-icon" />
          </button>
        </div>
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

  getJobsDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const {typeOfEmployment, salaryRange, searchWords} = this.state

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${typeOfEmployment}&minimum_package=${salaryRange}&search=${searchWords}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok) {
      const updatedData = data.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,

        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        allJobs: updatedData,
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

  renderProfileSuccessView = () => {
    const {profileDetails} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    return (
      <div className="profile-container">
        <img className="profile-img" src={profileImageUrl} alt="profile" />
        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileViews = () => {
    const {profileApiStatus} = this.state

    switch (profileApiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()

      case apiStatusConstants.success:
        return this.renderProfileSuccessView()

      case apiStatusConstants.failure:
        return this.renderProfileFailure()

      default:
        return null
    }
  }

  onChangeSearchInput = event => {
    this.setState({search: event.target.value})
  }

  onClickSearchInput = () => {
    const {search} = this.state
    console.log(search)
    this.setState({searchWords: search}, this.getJobsDetails)
  }

  renderNoJobsView = () => (
    <>
      <img
        className="job-failed-img"
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
      />
      <h1 className="jobs-failure-heading">No Jobs Found</h1>
      <p className="jobs-failure-para">
        We could not find any jobs. Try other filters
      </p>
    </>
  )

  renderJobsSuccessView = () => {
    const {allJobs, search} = this.state

    return (
      <>
        <div className="jobs-input-container">
          <input
            className="search-input"
            type="search"
            placeholder="Search"
            onChange={this.onChangeSearchInput}
            value={search}
          />
          <button
            className="search-btn"
            onClick={this.onClickSearchInput}
            type="button"
            data-testid="searchButton"
          >
            <BsSearch className="search-icon" />
          </button>
        </div>

        <ul className="jobs-list">
          {allJobs.map(eachOne => (
            <JobCard job={eachOne} key={eachOne.id} />
          ))}
        </ul>
        {allJobs.length === 0 ? this.renderNoJobsView() : ''}
      </>
    )
  }

  renderJobsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoader()

      case apiStatusConstants.success:
        return this.renderJobsSuccessView()

      case apiStatusConstants.failure:
        return this.renderJobsFetchingFailed()

      default:
        return null
    }
  }

  setIdList = () => {
    const {idList} = this.state

    const idListString = idList.join(',')
    this.setState({typeOfEmployment: idListString}, this.getJobsDetails)
    console.log(idListString)
  }

  selectEmploymentType = id => {
    const {idList} = this.state
    // eslint-disable-next-line no-unused-vars
    const dum = idList.includes(id)
      ? this.setState(
          prevState => ({
            idList: prevState.idList.filter(eachItem => eachItem !== id),
          }),
          this.setIdList,
        )
      : this.setState(
          prevState => ({
            idList: [...prevState.idList, id],
          }),
          this.setIdList,
        )
  }

  renderEmploymentFilter = typeDetails => {
    const {label, employmentTypeId} = typeDetails

    const onChangeEmploymentType = () => {
      this.selectEmploymentType(employmentTypeId)
    }

    return (
      <li className="each-list" key={employmentTypeId}>
        <input
          type="checkbox"
          className="check-box"
          id={employmentTypeId}
          onChange={onChangeEmploymentType}
        />
        <label htmlFor={employmentTypeId} className="label-el">
          {label}
        </label>
      </li>
    )
  }

  onChangeSalaryRange = event => {
    this.setState({salaryRange: event.target.value}, this.getJobsDetails)
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-main-container">
          <div className="filters-container">
            <div className="profile-cont">{this.renderProfileViews()}</div>

            <hr className="line" />

            <h1 className="filter-heading">Type of Employment</h1>
            <ul className="filter-list">
              {employmentTypesList.map(eachType =>
                this.renderEmploymentFilter(eachType),
              )}
            </ul>

            <hr className="line" />

            <h1 className="filter-heading">Salary Range</h1>
            <div className="filter-list" onChange={this.onChangeSalaryRange}>
              {salaryRangesList.map(eachOne => (
                <div className="each-list" key={eachOne.salaryRangeId}>
                  <input
                    className="check-box"
                    type="radio"
                    value={eachOne.salaryRangeId}
                    id={eachOne.salaryRangeId}
                    name="salary_ranges"
                  />
                  <label className="label-el" htmlFor={eachOne.salaryRangeId}>
                    {eachOne.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="jobs-container">{this.renderJobsView()}</div>
        </div>
      </>
    )
  }
}

export default Jobs
