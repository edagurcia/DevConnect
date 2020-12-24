import React, { useState } from 'react';
import { Link, withRouter } from 'react-router-dom'
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { addEducation } from '../../actions/profile'


const AddEducation = ({ addEducation, history }) => {

  const [ formData, setFormData ] = useState({
    school: '',
    degree: '',
    fieldofstudy: '',
    from: '',
    to: '',
    current: false,
    description: ''
  })

  const [ toDateDisabled, toggleDisabled ] = useState(false)

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = formData

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return ( 
    <>

      <h1 classNameName="large text-primary">
       Add Education
      </h1>
      <p class="lead">
        <i class="fas fa-graduation-cap"></i> Add any school, bootcamp, etc that
        you have attended
      </p>
      <small>* = required field</small>
      <form className="form" onSubmit={
        e => {
          e.preventDefault()
          addEducation(formData, history)
        }
      }>
        <div className="form-group">
          <input type="text" placeholder="* Degree" name="degree" value={degree} onChange={handleChange} />
        </div>
        <div className="form-group">
          <input type="text" placeholder="* School" name="school" value={school} onChange={handleChange} />
        </div>
        <div className="form-group">
          <input type="text" placeholder="Field of study" name="fieldofstudy" value={fieldofstudy} onChange={handleChange} />
        </div>
        <div className="form-group">
          <h4>From Date</h4>
          <input type="date" name="from" value={from} onChange={handleChange} />
        </div>
         <div className="form-group">
          <p><input type="checkbox" name="current" checked={current} value={current} onChange={ e => {
            setFormData({ ...formData, current: !current })
            toggleDisabled(!toDateDisabled)
          }} /> {' '} Current School</p>
        </div>
        <div className="form-group">
          <h4>To Date</h4>
          <input type="date" name="to" disabled={toDateDisabled ? 'disabled' : ''} value={to} onChange={handleChange} />
        </div>
        <div className="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Description"
            value={description} onChange={handleChange}
          ></textarea>
        </div>
        <input type="submit" className="btn btn-primary my-1" value="Submit" />
        <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
      </form>

    </>
   );
}

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired
}
 
export default connect(null, { addEducation })(withRouter(AddEducation));