import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment'

const ProfileExperience = ({ exp }) => {
  return (       
    <div>
      <h3 className="text-dark">{exp.company}</h3>
      <p><Moment format="YYYY/MM/DD">{exp.from}</Moment> - {exp.current ? 'Current' : (
        <Moment format="YYYY/MM/DD">{exp.to}</Moment>
      )}</p>
      <p><strong>Position: </strong>{exp.title}</p>
      <p>
        <strong>Description: </strong>
        {exp.description}
      </p>
    </div>  
   );
}

ProfileExperience.propTypes = {
  exp: PropTypes.object.isRequired
}
 
export default ProfileExperience;