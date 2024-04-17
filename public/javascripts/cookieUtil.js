const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    let cookieValue = parts.pop().split(';').shift();
    try {
      cookieValue = decodeURIComponent(cookieValue);
    } catch (e) {
      console.error("Error decoding cookie value: ", e);
    }
    return cookieValue;
  }
}

export {getCookie}