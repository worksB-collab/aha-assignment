const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const cookieArray = value.split(`; ${name}=`);
  if (cookieArray.length === 2) {
    let cookieValue = cookieArray.pop().split(';').shift();
    try {
      cookieValue = decodeURIComponent(cookieValue);
    } catch (e) {
      console.error("Error decoding cookie value: ", e);
    }
    return cookieValue;
  }
};

export {getCookie};