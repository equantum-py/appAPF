import pytest

from app.shared.test_database import isolated_test_url


@pytest.mark.parametrize(
    "mode,url",
    [
        ("", "postgresql+psycopg://localhost/apf_e02_test"),
        ("isolated", "postgresql+psycopg://remote.example/apf_e02_test"),
        ("isolated", "postgresql+psycopg://localhost/production"),
        ("isolated", "sqlite:///apf_e02_test"),
    ],
)
def test_migration_target_guard(monkeypatch, mode, url):
    monkeypatch.setenv("E02_TEST_MODE", mode)
    monkeypatch.setenv("E02_TEST_MIGRATOR_URL", url)
    with pytest.raises(RuntimeError):
        isolated_test_url("E02_TEST_MIGRATOR_URL")
