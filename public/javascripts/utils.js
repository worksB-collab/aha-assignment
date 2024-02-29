const getCookie = (name) => {
  // todo need to conduct space issue
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  console.log('document.cookie', document.cookie);
  console.log('parts', parts);
  console.log('parts.length', parts.length);
  if (parts.length === 2) {
    let cookieValue = parts.pop().split(';').shift();
    try {
      // Attempt to decode the specific cookie value.
      cookieValue = decodeURIComponent(cookieValue);
    } catch (e) {
      console.error("Error decoding cookie value: ", e);
      // Optionally handle the error, such as logging it or using the raw value.
    }
    return cookieValue;
  }
}

export {getCookie}