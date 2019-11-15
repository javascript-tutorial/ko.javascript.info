function getLocalDay(date) {

  let day = date.getDay();

  if (day == 0) { // 일요일(숫자 0)은 유럽에선 7입니다.
    day = 7;
  }

  return day;
}