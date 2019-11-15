function getLocalDay(date) {

  let day = date.getDay();

  if (day == 0) { // 유럽의 주중은 0 일요일은 7
    day = 7;
  }

  return day;
}
