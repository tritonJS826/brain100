from pathlib import Path
from app.db.postgres import get_conn


def run_migrations():
    migrations_directory = Path(__file__).resolve().parents[2] / "migrations"
    sql_file_paths = sorted([file_path for file_path in migrations_directory.glob("*.sql")])

    with get_conn() as database_connection, database_connection.cursor() as database_cursor:
        for sql_file_path in sql_file_paths:
            sql_content = sql_file_path.read_text(encoding="utf-8")
            database_cursor.execute(sql_content)
        database_connection.commit()


if __name__ == "__main__":
    run_migrations()
    print("Migrations applied.")