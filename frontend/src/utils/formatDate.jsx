function formatDate(dateString) {
    const date = new Date(dateString);
    
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      weekday: 'short'
    };
    return date.toLocaleDateString(undefined, options);
  }

export default formatDate;