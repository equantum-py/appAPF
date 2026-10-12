from dataclasses import dataclass
from uuid import UUID

from sqlalchemy import select, text
from sqlalchemy.exc import SQLAlchemyError

from app.identity.jwt import AuthUnavailable
from app.shared.database import register_models

metadata = register_models()
users = metadata.tables["app.users"]
memberships = metadata.tables["app.memberships"]
organizations = metadata.tables["app.organizations"]


class ForbiddenAccess(Exception):
    pass


@dataclass(frozen=True)
class Actor:
    user_id: UUID


class AccessService:
    def __init__(self, engine):
        self.engine = engine

    def _resolve(self, connection, identity):
        forbidden = connection.exec_driver_sql(
            "SELECT rolsuper OR rolbypassrls OR rolcreaterole OR rolcreatedb "
            "OR EXISTS (SELECT 1 FROM pg_namespace WHERE nspname='app' "
            "AND nspowner = current_user::regrole) "
            "OR EXISTS (SELECT 1 FROM pg_class c "
            "JOIN pg_namespace n ON n.oid=c.relnamespace "
            "WHERE n.nspname='app' AND c.relowner=current_user::regrole) "
            "FROM pg_roles WHERE rolname=current_user"
        ).scalar()
        if forbidden is not False:
            raise AuthUnavailable()
        connection.execute(text("SELECT set_config('app.organization_id', '', true)"))
        connection.execute(text("SELECT set_config('app.actor_id', '', true)"))
        connection.execute(
            text("SELECT set_config('app.subject', :v, true)"),
            {"v": str(identity.subject)},
        )
        user_id = connection.execute(
            select(users.c.id).where(users.c.supabase_subject == identity.subject)
        ).scalar_one_or_none()
        if user_id is None:
            raise ForbiddenAccess()
        connection.execute(
            text("SELECT set_config('app.actor_id', :v, true)"), {"v": str(user_id)}
        )
        return Actor(user_id)

    def me(self, identity):
        try:
            with self.engine.begin() as connection:
                actor = self._resolve(connection, identity)
                return {"user_id": actor.user_id}
        except SQLAlchemyError:
            raise AuthUnavailable() from None

    def mine(self, identity):
        try:
            with self.engine.begin() as connection:
                actor = self._resolve(connection, identity)
                rows = (
                    connection.execute(
                        select(memberships).where(
                            memberships.c.user_id == actor.user_id,
                            memberships.c.active.is_(True),
                        )
                    )
                    .mappings()
                    .all()
                )
                output = []
                for row in rows:
                    connection.execute(
                        text("SELECT set_config('app.organization_id', :v, true)"),
                        {"v": str(row["organization_id"])},
                    )
                    organization = (
                        connection.execute(
                            select(organizations).where(
                                organizations.c.id == row["organization_id"]
                            )
                        )
                        .mappings()
                        .one_or_none()
                    )
                    if organization is not None:
                        output.append(
                            {
                                "organization_id": row["organization_id"],
                                "name": organization["name"],
                                "kind": organization["kind"],
                                "role": row["role"],
                            }
                        )
                return output
        except SQLAlchemyError:
            raise AuthUnavailable() from None

    def organization(self, identity, organization_id, admin=False):
        try:
            with self.engine.begin() as connection:
                actor = self._resolve(connection, identity)
                connection.execute(
                    text("SELECT set_config('app.organization_id', :v, true)"),
                    {"v": str(organization_id)},
                )
                member = (
                    connection.execute(
                        select(memberships).where(
                            memberships.c.organization_id == organization_id,
                            memberships.c.user_id == actor.user_id,
                            memberships.c.active.is_(True),
                        )
                    )
                    .mappings()
                    .one_or_none()
                )
                organization = (
                    connection.execute(
                        select(organizations).where(
                            organizations.c.id == organization_id
                        )
                    )
                    .mappings()
                    .one_or_none()
                )
                if member is None or organization is None:
                    raise ForbiddenAccess()
                if admin:
                    if (
                        member["role"] != "ADMIN"
                        or organization["kind"] != "INSTITUTIONAL"
                    ):
                        raise ForbiddenAccess()
                    return [
                        {
                            "user_id": row["user_id"],
                            "role": row["role"],
                            "active": row["active"],
                        }
                        for row in connection.execute(
                            select(memberships).where(
                                memberships.c.organization_id == organization_id
                            )
                        ).mappings()
                    ]
                reviewer = organization["kind"] == "INSTITUTIONAL" and member[
                    "role"
                ] in {
                    "INSTRUCTOR",
                    "REVIEWER",
                    "ADMIN",
                }
                return {
                    "organization_id": organization_id,
                    "role": member["role"],
                    "can_review_technical": reviewer and member["can_review_technical"],
                    "can_review_physical": reviewer and member["can_review_physical"],
                }
        except SQLAlchemyError:
            raise AuthUnavailable() from None
