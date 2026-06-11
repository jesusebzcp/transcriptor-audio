"""transcription queue fields

Revision ID: 0003_transcription_queue
Revises: 0002_user_auth_fields
Create Date: 2026-06-11 00:00:00

"""
import sqlalchemy as sa
from alembic import op

revision = "0003_transcription_queue"
down_revision = "0002_user_auth_fields"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("transcriptions", sa.Column("beam_size", sa.Integer(), nullable=False, server_default="5"))
    op.add_column("transcriptions", sa.Column("vad_filter", sa.Boolean(), nullable=False, server_default=sa.true()))
    op.add_column("transcriptions", sa.Column("status", sa.String(length=32), nullable=False, server_default="completed"))
    op.add_column("transcriptions", sa.Column("source_path", sa.String(length=1024), nullable=True))
    op.add_column("transcriptions", sa.Column("error_message", sa.Text(), nullable=True))
    op.add_column("transcriptions", sa.Column("started_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("transcriptions", sa.Column("completed_at", sa.DateTime(timezone=True), nullable=True))
    op.create_index("ix_transcriptions_status", "transcriptions", ["status"])


def downgrade() -> None:
    op.drop_index("ix_transcriptions_status", table_name="transcriptions")
    op.drop_column("transcriptions", "completed_at")
    op.drop_column("transcriptions", "started_at")
    op.drop_column("transcriptions", "error_message")
    op.drop_column("transcriptions", "source_path")
    op.drop_column("transcriptions", "status")
    op.drop_column("transcriptions", "vad_filter")
    op.drop_column("transcriptions", "beam_size")
