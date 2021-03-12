describe("getUsers", function() {

  it('GitHub에서 사용자 정보를 얻어옵니다.', async function() {
    let users = await getUsers(["C17AN", "Violet-Bora-Lee", "이런사용자는없습니다"]);
    assert.equal(users[0].login, "C17AN");
    assert.equal(users[1].login, "Violet-Bora-Lee");
    assert.equal(users[2], null);
  });

});
