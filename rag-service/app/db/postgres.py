from __future__ import annotations

from contextlib import contextmanager
from typing import Iterator, Iterable, Any, Optional, Sequence, Mapping

import psycopg
from psycopg import Cursor, Connection

from app.core.settings import settings


@contextmanager
def get_connection() -> Iterator[Connection]:
    """
    Open a short-lived connection.
    MVP-friendly: no pool, one conn per operation.
    """
    database_connection: Connection = psycopg.connect(settings.DATABASE_URL)
    try:
        yield database_connection
    finally:
        database_connection.close()


@contextmanager
def get_database_cursor() -> Iterator[Cursor]:
    """
    Open connection and cursor, auto-commit on success and rollback on error.
    Use for single-shot queries/updates.
    """
    with get_connection() as database_connection:
        database_cursor: Cursor = database_connection.cursor()
        try:
            yield database_cursor
            database_connection.commit()
        except Exception:
            database_connection.rollback()
            raise
        finally:
            database_cursor.close()


def execute(sql: str, params: Optional[Sequence[Any] | Mapping[str, Any]] = None) -> None:
    """
    Execute a statement (DDL/DML) and commit.
    """
    with get_database_cursor() as database_cursor:
        database_cursor.execute(sql, params)


def fetch_one(
    sql: str,
    params: Optional[Sequence[Any] | Mapping[str, Any]] = None,
) -> Optional[tuple]:
    """
    Execute a SELECT and return a single row (or None).
    """
    with get_database_cursor() as database_cursor:
        database_cursor.execute(sql, params)
        return database_cursor.fetchone()


def fetch_all(
    sql: str,
    params: Optional[Sequence[Any] | Mapping[str, Any]] = None,
) -> list[tuple]:
    """
    Execute a SELECT and return all rows.
    """
    with get_database_cursor() as database_cursor:
        database_cursor.execute(sql, params)
        return database_cursor.fetchall()