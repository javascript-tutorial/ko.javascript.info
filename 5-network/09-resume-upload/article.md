# 파일 업로드 재개하기

`fetch` 메서드를 사용하면 쉽게 파일을 업로드할 수 있습니다.

업로드 중 연결이 끊겼을 때는 어떻게 재개할까요. 내장된 기능은 없지만 해결할 방법이 있습니다.

아마도 큰 용량의 파일(재 업로드를 해야 하는 상황이라면) 업로드를 재개하려면 업로드 진행률 표시가 동반되어야 합니다. `fetch` 메서드로는 업로드 진행률을 알 수 없음으로 [XMLHttpRequest](info:xmlhttprequest)를 사용합니다.

## 별 도움 안 되는 진행률 이벤트

업로드를 재개하기 전에, 연결이 끊기기 전까지 얼마나 업로드가 되었는지 알아야 합니다.

`xhr.upload.onprogress`로 업로드 진행률을 알 수 있습니다.

그러나 이 기능만으로는 업로드 재개에 도움이 되지 않습니다. 데이터를 _보낼_ 때 작동할 뿐 서버가 데이터를 받았는지 브라우저는 알 수 없습니다.

지역 네트워크 프락시의 지연, 원격 서버 프로세스가 죽어서 처리를 하지 못하거나, 중간에 손실이 일어나 리시버에 도달하지 못했을 수 있습니다.

그래서 이 이벤트는 멋진 진행률을 보여주는 것 외에는 그다지 유용하지 않습니다.

업로드를 재개하기 위해서, 서버에 송신된 바이트의 _정확한_ 수를 알아야 합니다. 그리고 바이트의 수는 서버만이 알고 있어서 추가적인 요청을 해야 합니다.

## 알고리즘

1. 첫째, 업로드할 파일에 고윳값 구분을 위한 파일 아이디를 생성하세요.

   ```js
   let fileId = file.name + "-" + file.size + "-" + +file.lastModifiedDate;
   ```

   이는 어떤 파일 업로드를 재개할 건지 서버에게 알려주기 위해 필요합니다.

   이름, 크기 혹은 최종 수정 날짜가 변하면 별도의 `fileId`가 생성됩니다.

2. 서버가 가지고 있는 바이트가 얼마나 되는지 요청을 보냅니다. 이렇게요.

   ```js
   let response = await fetch("status", {
     headers: {
       "X-File-Id": fileId,
     },
   });

   // The server has that many bytes
   let startByte = +(await response.text());
   ```

   서버가 `X-File-Id` 헤더에서 파일 업로드를 추적한다고 가정합니다. 이는 서버사이드에 구현되어야 합니다.

   아직 파일이 서버에 없으면 서버는 `0`으로 응답해야 합니다.

3. `startByte`에서 파일을 보내기 위해 `Blob`의 `slice` 메서드를 사용합니다.

   ```js
   xhr.open("POST", "upload", true);

   // File id, so that the server knows which file we upload
   xhr.setRequestHeader("X-File-Id", fileId);

   // The byte we're resuming from, so the server knows we're resuming
   xhr.setRequestHeader("X-Start-Byte", startByte);

   xhr.upload.onprogress = (e) => {
     console.log(`Uploaded ${startByte + e.loaded} of ${startByte + e.total}`);
   };

   // file can be from input.files[0] or another source
   xhr.send(file.slice(startByte));
   ```

   파일을 업로드할 때 서버에 파일 아이디인 `X-File-Id`를 보내고 처음부터 업로드하지 않고 재개하기 위해 `X-Start-Byte`로 시작 바이트를 서버에 보냅니다.

   서버는 기록을 확인해서 파일에 업로드가 있었는지, 지금 올리는 크기가 정확히 `X-Start-Byte`인지 확인하고 데이터를 확장합니다.

여기에 Node.js로 작성된 클라이언트와 서버 코드 예시가 있습니다.

Node.js는 Nginx의 백그라운드, 업로드 버퍼가 완료되었을 때 Node.js로 전달하여 작동하기 때문에 이 사이트에서만 부분적으로 작동합니다.

그래도 다운로드를 받아서 시연해보세요.

[codetabs src="upload-resume" height=200]

알다시피 최신 네트워킹 메서드들은 기능 면에서 파일 매니저에 가깝습니다 -- 오버 헤더 통제, 진행률 표시, 파일을 부분적으로 보냄 등.

이제 파일 업로드 재개를 구현할 수 있습니다.
