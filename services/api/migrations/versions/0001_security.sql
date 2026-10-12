GRANT USAGE ON SCHEMA app TO apf_runtime;
REVOKE CREATE ON SCHEMA app FROM apf_runtime;
REVOKE ALL ON ALL TABLES IN SCHEMA app FROM PUBLIC;
ALTER TABLE app.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY scope_access ON app.users TO apf_runtime USING (id = NULLIF(current_setting('app.actor_id', true), '')::uuid) WITH CHECK (id = NULLIF(current_setting('app.actor_id', true), '')::uuid);
GRANT SELECT, INSERT, UPDATE, DELETE ON app.users TO apf_runtime;
ALTER TABLE app.organizations ENABLE ROW LEVEL SECURITY;
CREATE POLICY scope_access ON app.organizations TO apf_runtime USING (id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND (kind <> 'PERSONAL' OR owner_user_id = NULLIF(current_setting('app.actor_id', true), '')::uuid)) WITH CHECK (id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND (kind <> 'PERSONAL' OR owner_user_id = NULLIF(current_setting('app.actor_id', true), '')::uuid));
GRANT SELECT, INSERT, UPDATE, DELETE ON app.organizations TO apf_runtime;
ALTER TABLE app.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY scope_access ON app.audit_log TO apf_runtime USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id)) WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id));
GRANT SELECT, INSERT, UPDATE, DELETE ON app.audit_log TO apf_runtime;
ALTER TABLE app.memberships ENABLE ROW LEVEL SECURITY;
CREATE POLICY scope_access ON app.memberships TO apf_runtime USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid) WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid);
GRANT SELECT, INSERT, UPDATE, DELETE ON app.memberships TO apf_runtime;
ALTER TABLE app.physical_exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY scope_access ON app.physical_exercises TO apf_runtime USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id)) WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id));
GRANT SELECT, INSERT, UPDATE, DELETE ON app.physical_exercises TO apf_runtime;
ALTER TABLE app.rulebook_editions ENABLE ROW LEVEL SECURITY;
CREATE POLICY scope_access ON app.rulebook_editions TO apf_runtime USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id)) WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id));
GRANT SELECT, INSERT, UPDATE, DELETE ON app.rulebook_editions TO apf_runtime;
ALTER TABLE app.situations ENABLE ROW LEVEL SECURITY;
CREATE POLICY scope_access ON app.situations TO apf_runtime USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id)) WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id));
GRANT SELECT, INSERT, UPDATE, DELETE ON app.situations TO apf_runtime;
ALTER TABLE app.training_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY scope_access ON app.training_sessions TO apf_runtime USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id)) WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id));
GRANT SELECT, INSERT, UPDATE, DELETE ON app.training_sessions TO apf_runtime;
ALTER TABLE app.video_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY scope_access ON app.video_assets TO apf_runtime USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id)) WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id));
GRANT SELECT, INSERT, UPDATE, DELETE ON app.video_assets TO apf_runtime;
ALTER TABLE app.physical_exercise_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY scope_access ON app.physical_exercise_versions TO apf_runtime USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id)) WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id));
GRANT SELECT, INSERT, UPDATE, DELETE ON app.physical_exercise_versions TO apf_runtime;
ALTER TABLE app.rubrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY scope_access ON app.rubrics TO apf_runtime USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id)) WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id));
GRANT SELECT, INSERT, UPDATE, DELETE ON app.rubrics TO apf_runtime;
ALTER TABLE app.situation_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY scope_access ON app.situation_versions TO apf_runtime USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id)) WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id));
GRANT SELECT, INSERT, UPDATE, DELETE ON app.situation_versions TO apf_runtime;
ALTER TABLE app.training_session_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY scope_access ON app.training_session_versions TO apf_runtime USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id)) WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id));
GRANT SELECT, INSERT, UPDATE, DELETE ON app.training_session_versions TO apf_runtime;
ALTER TABLE app.approvals ENABLE ROW LEVEL SECURITY;
CREATE POLICY scope_access ON app.approvals TO apf_runtime USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id)) WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id));
GRANT SELECT, INSERT, UPDATE, DELETE ON app.approvals TO apf_runtime;
ALTER TABLE app.rubric_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY scope_access ON app.rubric_versions TO apf_runtime USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id)) WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id));
GRANT SELECT, INSERT, UPDATE, DELETE ON app.rubric_versions TO apf_runtime;
ALTER TABLE app.situation_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY scope_access ON app.situation_options TO apf_runtime USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id)) WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id));
GRANT SELECT, INSERT, UPDATE, DELETE ON app.situation_options TO apf_runtime;
ALTER TABLE app.training_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY scope_access ON app.training_runs TO apf_runtime USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id)) WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id));
GRANT SELECT, INSERT, UPDATE, DELETE ON app.training_runs TO apf_runtime;
ALTER TABLE app.training_session_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY scope_access ON app.training_session_items TO apf_runtime USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id)) WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id));
GRANT SELECT, INSERT, UPDATE, DELETE ON app.training_session_items TO apf_runtime;
ALTER TABLE app.attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY scope_access ON app.attempts TO apf_runtime USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id)) WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id));
GRANT SELECT, INSERT, UPDATE, DELETE ON app.attempts TO apf_runtime;
ALTER TABLE app.physical_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY scope_access ON app.physical_results TO apf_runtime USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id)) WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id));
GRANT SELECT, INSERT, UPDATE, DELETE ON app.physical_results TO apf_runtime;
ALTER TABLE app.rubric_criteria ENABLE ROW LEVEL SECURITY;
CREATE POLICY scope_access ON app.rubric_criteria TO apf_runtime USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id)) WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id));
GRANT SELECT, INSERT, UPDATE, DELETE ON app.rubric_criteria TO apf_runtime;
ALTER TABLE app.evaluations ENABLE ROW LEVEL SECURITY;
CREATE POLICY scope_access ON app.evaluations TO apf_runtime USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id)) WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id));
GRANT SELECT, INSERT, UPDATE, DELETE ON app.evaluations TO apf_runtime;
ALTER TABLE app.evaluation_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY scope_access ON app.evaluation_reviews TO apf_runtime USING (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id)) WITH CHECK (organization_id = NULLIF(current_setting('app.organization_id', true), '')::uuid AND EXISTS (SELECT 1 FROM app.organizations o WHERE o.id = organization_id));
GRANT SELECT, INSERT, UPDATE, DELETE ON app.evaluation_reviews TO apf_runtime;

CREATE FUNCTION app.immutable_record() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  RAISE EXCEPTION 'Historical records cannot be updated or deleted' USING ERRCODE = '23514';
END;
$$;
CREATE FUNCTION app.immutable_published_version() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF OLD.status IN ('PUBLISHED', 'ARCHIVED') THEN
    IF TG_OP = 'DELETE' THEN
      RAISE EXCEPTION 'Published version cannot be deleted' USING ERRCODE = '23514';
    END IF;
    IF (to_jsonb(NEW) - 'status') IS DISTINCT FROM (to_jsonb(OLD) - 'status')
       OR (OLD.status = 'ARCHIVED' AND NEW.status <> 'ARCHIVED')
       OR (OLD.status = 'PUBLISHED' AND NEW.status NOT IN ('PUBLISHED', 'ARCHIVED')) THEN
      RAISE EXCEPTION 'Published version is immutable' USING ERRCODE = '23514';
    END IF;
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;
CREATE FUNCTION app.guard_published_children() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE state text; parent uuid; tenant uuid;
BEGIN
  IF TG_OP <> 'INSERT' THEN
    parent := (to_jsonb(OLD)->>TG_ARGV[1])::uuid;
    tenant := OLD.organization_id;
    EXECUTE format('SELECT status FROM app.%I WHERE id = $1 AND organization_id = $2 FOR SHARE', TG_ARGV[0])
      INTO state USING parent, tenant;
    IF state IN ('PUBLISHED', 'ARCHIVED') THEN
      RAISE EXCEPTION 'Published version children cannot change' USING ERRCODE = '23514';
    END IF;
  END IF;
  IF TG_OP <> 'DELETE' THEN
    parent := (to_jsonb(NEW)->>TG_ARGV[1])::uuid;
    tenant := NEW.organization_id;
    EXECUTE format('SELECT status FROM app.%I WHERE id = $1 AND organization_id = $2 FOR SHARE', TG_ARGV[0])
      INTO state USING parent, tenant;
    IF state IN ('PUBLISHED', 'ARCHIVED') THEN
      RAISE EXCEPTION 'Published version children cannot change' USING ERRCODE = '23514';
    END IF;
  END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$;
CREATE FUNCTION app.immutable_run_identity() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF (to_jsonb(NEW) - 'state') IS DISTINCT FROM (to_jsonb(OLD) - 'state') THEN
    RAISE EXCEPTION 'Run identity and payload cannot change' USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE UPDATE, DELETE, TRUNCATE ON app.audit_log FROM apf_runtime;
CREATE TRIGGER immutable_history BEFORE UPDATE OR DELETE ON app.audit_log FOR EACH ROW EXECUTE FUNCTION app.immutable_record();
REVOKE UPDATE, DELETE, TRUNCATE ON app.attempts FROM apf_runtime;
CREATE TRIGGER immutable_history BEFORE UPDATE OR DELETE ON app.attempts FOR EACH ROW EXECUTE FUNCTION app.immutable_record();
REVOKE UPDATE, DELETE, TRUNCATE ON app.evaluations FROM apf_runtime;
CREATE TRIGGER immutable_history BEFORE UPDATE OR DELETE ON app.evaluations FOR EACH ROW EXECUTE FUNCTION app.immutable_record();
REVOKE UPDATE, DELETE, TRUNCATE ON app.evaluation_reviews FROM apf_runtime;
CREATE TRIGGER immutable_history BEFORE UPDATE OR DELETE ON app.evaluation_reviews FOR EACH ROW EXECUTE FUNCTION app.immutable_record();
REVOKE UPDATE, DELETE, TRUNCATE ON app.approvals FROM apf_runtime;
CREATE TRIGGER immutable_history BEFORE UPDATE OR DELETE ON app.approvals FOR EACH ROW EXECUTE FUNCTION app.immutable_record();
REVOKE UPDATE, DELETE, TRUNCATE ON app.physical_results FROM apf_runtime;
CREATE TRIGGER immutable_history BEFORE UPDATE OR DELETE ON app.physical_results FOR EACH ROW EXECUTE FUNCTION app.immutable_record();
CREATE TRIGGER immutable_version BEFORE UPDATE OR DELETE ON app.situation_versions FOR EACH ROW EXECUTE FUNCTION app.immutable_published_version();
CREATE TRIGGER immutable_version BEFORE UPDATE OR DELETE ON app.rubric_versions FOR EACH ROW EXECUTE FUNCTION app.immutable_published_version();
CREATE TRIGGER immutable_version BEFORE UPDATE OR DELETE ON app.physical_exercise_versions FOR EACH ROW EXECUTE FUNCTION app.immutable_published_version();
CREATE TRIGGER immutable_version BEFORE UPDATE OR DELETE ON app.training_session_versions FOR EACH ROW EXECUTE FUNCTION app.immutable_published_version();
CREATE TRIGGER guard_version_children BEFORE INSERT OR UPDATE OR DELETE ON app.situation_options FOR EACH ROW EXECUTE FUNCTION app.guard_published_children('situation_versions', 'situation_version_id');
CREATE TRIGGER guard_version_children BEFORE INSERT OR UPDATE OR DELETE ON app.rubric_criteria FOR EACH ROW EXECUTE FUNCTION app.guard_published_children('rubric_versions', 'rubric_version_id');
CREATE TRIGGER guard_version_children BEFORE INSERT OR UPDATE OR DELETE ON app.training_session_items FOR EACH ROW EXECUTE FUNCTION app.guard_published_children('training_session_versions', 'session_version_id');
CREATE TRIGGER immutable_identity BEFORE UPDATE ON app.training_runs FOR EACH ROW EXECUTE FUNCTION app.immutable_run_identity();
REVOKE ALL ON FUNCTION app.immutable_record() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app.immutable_record() TO apf_runtime;
REVOKE ALL ON FUNCTION app.immutable_published_version() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app.immutable_published_version() TO apf_runtime;
REVOKE ALL ON FUNCTION app.guard_published_children() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app.guard_published_children() TO apf_runtime;
REVOKE ALL ON FUNCTION app.immutable_run_identity() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app.immutable_run_identity() TO apf_runtime;
