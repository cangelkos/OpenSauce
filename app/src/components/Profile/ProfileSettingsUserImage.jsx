import React from 'react';

const ProfileSettingsUserImage = ({image}) => { 
    return (
      <div>
        <span><img src={image.placeholder} width="100" height="100"/></span>
      </div>
    );
}

export default ProfileSettingsUserImage;