# 파일 업로드 재개하기

`fetch` 메서드를 사용하면 꽤 쉽게 파일 업로드를 할 수 있습니다.

업로드 중 연결이 끊긴 후에 업로드를 재개하려면 어떻게 해야 할까요. 업로드 재개를 위해 내장된 기능은 없지만 부분적으로 구현할 수 있는 여러 기능이 있습니다.

아마도 큰 용량의 파일(재 업로드를 해야 하는 상황이라면) 업로드를 재개하려면 업로드 진행률 표시가 동반되어야 합니다. `fetch` 메서드로는 업로드 진행률을 알 수 없으므로 [XMLHttpRequest](info:xmlhttprequest)를 사용합니다.

## 별 도움 안 되는 진행률 이벤트

업로드를 재개하기 위해서 연결이 끊기기 전까지 얼마나 업로드가 되었는지 알아야 합니다.

`xhr.upload.onprogress`로 업로드 진행률을 추적할 수 있습니다.

불행하게도 업로드 진행률 추적은 데이터를 *보낼* 때 작동할 뿐, 서버가 데이터를 받았는지 브라우저는 알 수 없어서 파일 업로드 재개에 도움이 되지 않습니다.

어쩌면 지역 네트워크 프락시의 지연이나, 원격 서버의 프로세스가 죽어서 처리를 하지 못하거나, 단지 중간에 손실이 일어나 리시버에 도달하지 못했을 수 있습니다.

이것이 업로드 진행률 이벤트가 멋진 진행률을 보여주는 것 외에는 그다지 유용하지 않은 이유입니다.

업로드를 재개하기 위해서 서버로부터 수신받은 바이트의 *정확한* 숫자를 알아야 합니다. 그리고 바이트의 숫자는 서버만이 말해줄 수 있기 때문에 추가로 요청을 해야 합니다.

## 알고리즘

1. 첫째, 업로드를 할 파일에 고윳값을 구분할 파일 아이디를 생성하세요.
    ```js
    let fileId = file.name + '-' + file.size + '-' + +file.lastModifiedDate;
    ```
    파일 아이디는 파일 업로드를 재개할 때 서버에 어떤 파일을 재개할지 말해주기 위해 필요합니다.

    이름이나 크기 혹은 최종 수정 날짜가 변하면 별도의 `fileId`가 생성됩니다.

2. 서버에 요청을 보내어 바이트가 이미 얼마나 되는지 물어봅니다. 이렇게요.
    ```js
    let response = await fetch('status', {
      headers: {
        'X-File-Id': fileId
      }
    });

    // The server has that many bytes
    let startByte = +await response.text();
    ```

    서버가 `X-File-Id` 헤더에서 파일 업로드를 추적한다고 가정합니다. 헤더의 파일 업로드 추적 작업은 서버사이드에서 구현되어 있어야 합니다.

    아직 파일이 서버에 없으면 서버는 `0`으로 응답해야 합니다.

3. `startByte`에서 파일을 보내기 위해 `Blob`의 `slice` 메서드를 사용합니다.
    ```js
    xhr.open("POST", "upload", true);

    // File id, so that the server knows which file we upload
    xhr.setRequestHeader('X-File-Id', fileId);

    // The byte we're resuming from, so the server knows we're resuming
    xhr.setRequestHeader('X-Start-Byte', startByte);

    xhr.upload.onprogress = (e) => {
      console.log(`Uploaded ${startByte + e.loaded} of ${startByte + e.total}`);
    };

    // file can be from input.files[0] or another source
    xhr.send(file.slice(startByte));
    ```

    서버에 파일 아이디인 `X-File-Id`를 보내 업로드를 할 파일을 알고 시작 바이트인 `X-Start-Byte`를 서버에 보내 처음부터 업로드를 하지 않고 재개하게 합니다.

    서버는 기록을 확인해서 파일에 업로드가 있었는지 그리고 현재 올리는 크기가 정확히 `X-Start-Byte`인지 확인하고 데이터를 확장합니다.


여기에 시범을 위해 Node.js로 작성된 서버와 클라이언트의 코드가 있습니다.

Node.js는 Nginx의 서버 뒤에서 버퍼 업로드가 완료되었을 때 Node.js로 전달하기 때문에 이 사이트에서만 부분적으로 작동합니다.

그래도 다운로드를 받아서 로컬에서 전체 시범을 실행해보세요.

[codetabs src="upload-resume" height=200]

아시다시피 여러 최신 네트워킹 메서드는 기능 면에서 파일 매니저에 가깝습니다 -- 오버 헤더 통제, 진행률 표시, 파일을 부분적으로 보냄 등.

이제 파일 업로드 재개를 구현할 수 있습니다.
