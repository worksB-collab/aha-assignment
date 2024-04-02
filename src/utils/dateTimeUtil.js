const format = (dateString) => {
  const date = new Date(dateString);
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const pad = (number) => {
    return number < 10 ? '0' + number : number;
  }

  return `${monthNames[monthIndex]} ${pad(day)}, ${year} ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

module.exports = {
  format,
};