# models.py - ORM models placeholder
from sqlalchemy import (
    BigInteger,
    String,
    DateTime,
    Float,
    ForeignKey
)
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.db.base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True
    )

    name: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    auth_user_id: Mapped[str] = mapped_column(
        String,
        nullable=False,
        unique=True
    )

    username: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        unique=True
    )

    full_name: Mapped[str] = mapped_column(
        String(255),
        nullable=False
    )

    created_at: Mapped[DateTime] = mapped_column(
        DateTime,
        server_default=func.now()
    )
class Group(Base):
    __tablename__ = "groups"

    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    created_by: Mapped[int | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True
    )

    created_at: Mapped[DateTime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

class GroupMember(Base):
    __tablename__ = "group_members"

    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True
    )

    group_id: Mapped[int] = mapped_column(
        ForeignKey("groups.id"),
        nullable=False
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    joined_at: Mapped[DateTime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

class Expense(Base):
    __tablename__ = "expenses"

    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True
    )

    group_id: Mapped[int] = mapped_column(
        ForeignKey("groups.id"),
        nullable=False
    )

    paid_by: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    amount: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    description: Mapped[str | None] = mapped_column(
        nullable=True
    )

    created_at: Mapped[DateTime] = mapped_column(
        DateTime,
        server_default=func.now()
    )

class ExpenseParticipant(Base):
    __tablename__ = "expense_participants"

    id: Mapped[int] = mapped_column(
        BigInteger,
        primary_key=True
    )

    expense_id: Mapped[int] = mapped_column(
        ForeignKey("expenses.id"),
        nullable=False
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    share_amount: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )