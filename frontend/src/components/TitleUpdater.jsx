import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CONSTANTS } from '../utils/constants';


const TitleUpdater = () => {
  const location = useLocation();
  const [groupName, setGroupName] = useState(null);


  
  useEffect(() => {
    const path = location.pathname;

    const matches = path.match(/^\/groups\/(\d+)/);
    const groupId = matches ? matches[1] : null;


    if (groupId) {
      CONSTANTS.AXIOS.get(`/groups/${groupId}`)
        .then(response => {
          setGroupName(response.data.group.name);
        })
        .catch(error => {
          console.error('Error fetching the group name:', error);
          setGroupName('Error fetching the group name');
        });
    } else {
        setGroupName(null);
        updateTitle(path, null);
    }
    
    if (groupName !== null) {
        updateTitle(path, groupName);
    }
    
}, [location, groupName]);


const updateTitle = (path, groupName) => {
  switch (true) {
    case path === '/groups':
      document.title = 'Groups - coXpense';
      break;
    case path === '/profile':
      document.title = 'Profile - coXpense';
      break;
    case path === '/login':
      document.title = 'Login - coXpense';
      break;
    case path.includes('/expenses') && groupName !== null:
      document.title = `Group ${groupName} expenses - coXpense`;
      break;
    case path.includes('/balance') && groupName !== null:
      document.title = `Group ${groupName} balance - coXpense`;
      break;
    case path.includes('/members') && groupName !== null:
      document.title = `Group ${groupName} members - coXpense`;
      break;
    default:
      document.title = 'coXpense';
  }
};


  return null;
};

export default TitleUpdater;
