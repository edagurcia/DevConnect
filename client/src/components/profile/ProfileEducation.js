import React from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment'

const ProfileEducation = ({ edu }) => {
  return ( 
    <div>
      <h3>{edu.school}</h3>
      <p><Moment format="YYYY/MM/DD">{edu.from}</Moment> - {edu.current ? 'Current' : (
        <Moment format="YYYY/MM/DD">{edu.to}</Moment>
      )}</p>
      <p><strong>Degree: </strong>{edu.degree}</p>
      <p><strong>Field Of Study: </strong>{edu.fieldofstudy}</p>
      <p>
        <strong>Description: </strong>{edu.description}
      </p>
    </div>    
   );
}
 
ProfileEducation.propTypes = {
  edu: PropTypes.object.isRequired
}
export default ProfileEducation;