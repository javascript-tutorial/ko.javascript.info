// 만약 현재 마우스 아래에 <td>가 존재하는 경우 해당 요소 입력
let currentElem = null;

table.onmouseover = function(event) {
  // 새로운 요소로 들어가기 전에 마우스는 항상 이전 요소를 떠납니다.
  // 만약 currentElem가 null이 아니라면 이전에 방문한 <td>를 떠나지 않았다는 뜻입니다.
  // 현재 발생한 이벤트는 해당 <td>의 내부에서 발생했다는 의미이므로 무시합니다.
  if (currentElem) return;

  let target = event.target.closest('td');

  // 마우스가 <td>가 아닌 다른 요소로 이동했으므로 무시합니다.
  if (!target) return;

  // 마우스가 <td>로 이동했으나 관심 테이블이 아닙니다(중첩 테이블인 경우 발생 가능합니다).
  // 따라서 무시합니다.
  if (!table.contains(target)) return;

  // 만세! 우리는 새로운 <td>로 이동했습니다.
  currentElem = target;
  onEnter(currentElem);
};

table.onmouseout = function(event) {
  // 만약 마우스가 <td> 밖에 있다면 현재 이벤트를 무시합니다.
  // 테이블 내부를 이동하는 과정에서 <td>와 관계없이 발생한 이벤트일 수 있습니다.
  // 예시, 한 <tr>에서 다른 <tr>로 이동하는 경우
  if (!currentElem) return;

  // 마우스가 기존에 있던 요소를 떠났습니다. 어디로 갔을까요? 자식 요소로 떠났을까요?
  let relatedTarget = event.relatedTarget;

  while (relatedTarget) {
    // 부모 노드를 타고 올라가면서 확인해봅시다.
    // 만약 여전히 currentElem 내부라면 현재 이벤트를 무시합니다.
    if (relatedTarget == currentElem) return;

    relatedTarget = relatedTarget.parentNode;
  }

  // 마우스가 currentElem를 떠났습니다. 정말로.
  onLeave(currentElem);
  currentElem = null;
};

// 요소를 방문하고 떠나는 것을 관리하기 위한 임의 함수입니다.
function onEnter(elem) {
  elem.style.background = 'pink';

  // textarea에 표출합니다.
  text.value += `over -> ${currentElem.tagName}.${currentElem.className}\n`;
  text.scrollTop = 1e6;
}

function onLeave(elem) {
  elem.style.background = '';

  // textarea에 표출합니다.
  text.value += `out <- ${elem.tagName}.${elem.className}\n`;
  text.scrollTop = 1e6;
}
