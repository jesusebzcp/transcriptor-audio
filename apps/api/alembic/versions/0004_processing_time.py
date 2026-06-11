"""add processing_time to transcriptions

Revision ID: 0004_processing_time
Revises: 0003_transcription_queue
Create Date: 2026-06-11 00:00:00

"""
import sqlalchemy as sa
from alembic import op

revision = "0004_processing_time"
down_revision = "0003_transcription_queue"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("transcriptions", sa.Column("processing_time", sa.Float(), nullable=True))


def downgrade() -> None:
    op.drop_column("transcriptions", "processing_time")
