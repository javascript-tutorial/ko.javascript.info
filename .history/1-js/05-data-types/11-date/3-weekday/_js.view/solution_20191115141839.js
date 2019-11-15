function getLocalDay(date) {

  let day = date.getDay();

  if (day == 0) { // 유럽에서 주일은 0 (일요일)은 7 입니다.
    day = 7;
  }

  return day;
}
