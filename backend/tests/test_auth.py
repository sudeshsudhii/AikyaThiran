def test_health(client):
    assert client.get("/api/health").json() == {"status": "ok"}


def test_config_returns_client_id(client):
    assert client.get("/api/auth/config").json() == {"google_client_id": "test-client-id"}


def test_me_requires_login(client):
    assert client.get("/api/auth/me").status_code == 401


def test_google_login_creates_user_and_session(client):
    r = client.post("/api/auth/google", json={"credential": "valid-token-1"})
    assert r.status_code == 200
    body = r.json()
    assert body["email"] == "student1@example.com"
    assert body["profile_complete"] is False
    assert "at_session" in r.cookies

    me = client.get("/api/auth/me")
    assert me.status_code == 200
    assert me.json()["id"] == body["id"]


def test_second_login_reuses_same_user(client):
    a = client.post("/api/auth/google", json={"credential": "valid-token-7"}).json()
    b = client.post("/api/auth/google", json={"credential": "valid-token-7"}).json()
    assert a["id"] == b["id"]


def test_bad_google_token_rejected(client):
    r = client.post("/api/auth/google", json={"credential": "bad-token-value"})
    assert r.status_code == 401
    assert "Token expired" in r.json()["detail"]


def test_tampered_cookie_rejected(client):
    client.cookies.set("at_session", "not-a-real-jwt")
    assert client.get("/api/auth/me").status_code == 401


def test_logout_clears_session(client):
    client.post("/api/auth/google", json={"credential": "valid-token-2"})
    assert client.post("/api/auth/logout").status_code == 204
    client.cookies.clear()
    assert client.get("/api/auth/me").status_code == 401


def test_update_profile(client):
    client.post("/api/auth/google", json={"credential": "valid-token-3"})
    r = client.patch(
        "/api/users/me",
        json={"college": "  SRM IST ", "course": "MTech CSE", "year_of_study": 1,
              "interests": ["AI", "ai", " Web Dev ", ""]},
    )
    assert r.status_code == 200
    body = r.json()
    assert body["college"] == "SRM IST"
    assert body["interests"] == ["AI", "Web Dev"]
    assert body["profile_complete"] is True


def test_update_profile_validation(client):
    client.post("/api/auth/google", json={"credential": "valid-token-4"})
    assert client.patch("/api/users/me", json={"year_of_study": 99}).status_code == 422
