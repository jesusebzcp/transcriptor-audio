"""initial schema

Revision ID: 0001_initial
Revises:
Create Date: 2026-01-01 00:00:00

"""
import sqlalchemy as sa
from alembic import op

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(length=255), nullable=False, unique=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_users_email", "users", ["email"])

    op.create_table(
        "transcriptions",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column(
            "user_id",
            sa.Integer(),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("file_name", sa.String(length=512), nullable=False),
        sa.Column("language", sa.String(length=16), nullable=True),
        sa.Column("duration", sa.Float(), nullable=True),
        sa.Column("model_name", sa.String(length=64), nullable=False),
        sa.Column("context", sa.Text(), nullable=True),
        sa.Column("text", sa.Text(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
        ),
    )
    op.create_index(
        "ix_transcriptions_user_id", "transcriptions", ["user_id"]
    )
    op.create_index(
        "ix_transcriptions_created_at", "transcriptions", ["created_at"]
    )


def downgrade() -> None:
    op.drop_index("ix_transcriptions_created_at", table_name="transcriptions")
    op.drop_index("ix_transcriptions_user_id", table_name="transcriptions")
    op.drop_table("transcriptions")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
