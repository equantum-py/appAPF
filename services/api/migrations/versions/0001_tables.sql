CREATE TABLE app.users (
	id UUID NOT NULL,
	supabase_subject UUID NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	PRIMARY KEY (id),
	UNIQUE (supabase_subject)
)

;

CREATE TABLE app.organizations (
	id UUID NOT NULL,
	name VARCHAR(200) NOT NULL,
	kind VARCHAR(20) NOT NULL,
	owner_user_id UUID,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(owner_user_id) REFERENCES app.users (id),
	CHECK (kind IN ('PERSONAL','INSTITUTIONAL')),
	CHECK (kind <> 'PERSONAL' OR owner_user_id IS NOT NULL)
)

;
CREATE UNIQUE INDEX uq_personal_owner ON app.organizations (owner_user_id) WHERE kind = 'PERSONAL';

CREATE TABLE app.audit_log (
	id UUID NOT NULL,
	organization_id UUID NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	actor_user_id UUID,
	action VARCHAR(100) NOT NULL,
	details JSONB NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(actor_user_id) REFERENCES app.users (id),
	UNIQUE (organization_id, id),
	FOREIGN KEY(organization_id) REFERENCES app.organizations (id)
)

;
CREATE INDEX ix_audit_log_actor_user_id ON app.audit_log (actor_user_id);

CREATE TABLE app.memberships (
	id UUID NOT NULL,
	organization_id UUID NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	user_id UUID NOT NULL,
	role VARCHAR(30) NOT NULL,
	active BOOLEAN DEFAULT true NOT NULL,
	can_review_technical BOOLEAN DEFAULT false NOT NULL,
	can_review_physical BOOLEAN DEFAULT false NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(user_id) REFERENCES app.users (id),
	UNIQUE (organization_id, user_id),
	CHECK (role IN ('REFEREE','INSTRUCTOR','REVIEWER','ADMIN')),
	UNIQUE (organization_id, id),
	FOREIGN KEY(organization_id) REFERENCES app.organizations (id)
)

;
CREATE INDEX ix_memberships_user_id ON app.memberships (user_id);

CREATE TABLE app.physical_exercises (
	id UUID NOT NULL,
	organization_id UUID NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	title VARCHAR(200) NOT NULL,
	PRIMARY KEY (id),
	UNIQUE (organization_id, id),
	FOREIGN KEY(organization_id) REFERENCES app.organizations (id)
)

;

CREATE TABLE app.rulebook_editions (
	id UUID NOT NULL,
	organization_id UUID NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	label VARCHAR(100) NOT NULL,
	PRIMARY KEY (id),
	UNIQUE (organization_id, label),
	UNIQUE (organization_id, id),
	FOREIGN KEY(organization_id) REFERENCES app.organizations (id)
)

;

CREATE TABLE app.situations (
	id UUID NOT NULL,
	organization_id UUID NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	title VARCHAR(200) NOT NULL,
	PRIMARY KEY (id),
	UNIQUE (organization_id, id),
	FOREIGN KEY(organization_id) REFERENCES app.organizations (id)
)

;

CREATE TABLE app.training_sessions (
	id UUID NOT NULL,
	organization_id UUID NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	title VARCHAR(200) NOT NULL,
	PRIMARY KEY (id),
	UNIQUE (organization_id, id),
	FOREIGN KEY(organization_id) REFERENCES app.organizations (id)
)

;

CREATE TABLE app.video_assets (
	id UUID NOT NULL,
	organization_id UUID NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	object_key VARCHAR(500) NOT NULL,
	mime_type VARCHAR(100) NOT NULL,
	size_bytes BIGINT NOT NULL,
	rights_reference VARCHAR(500) NOT NULL,
	PRIMARY KEY (id),
	CHECK (size_bytes > 0),
	UNIQUE (organization_id, object_key),
	UNIQUE (organization_id, id),
	FOREIGN KEY(organization_id) REFERENCES app.organizations (id)
)

;

CREATE TABLE app.physical_exercise_versions (
	id UUID NOT NULL,
	organization_id UUID NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	physical_exercise_id UUID NOT NULL,
	version_number INTEGER NOT NULL,
	status VARCHAR(20) NOT NULL,
	author_user_id UUID NOT NULL,
	instructions TEXT NOT NULL,
	rights_reference VARCHAR(500) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(organization_id, physical_exercise_id) REFERENCES app.physical_exercises (organization_id, id),
	FOREIGN KEY(organization_id, author_user_id) REFERENCES app.memberships (organization_id, user_id),
	UNIQUE (organization_id, physical_exercise_id, version_number),
	UNIQUE (organization_id, id, author_user_id),
	CHECK (version_number > 0),
	CHECK (status IN ('DRAFT','IN_REVIEW','APPROVED','PUBLISHED','ARCHIVED')),
	UNIQUE (organization_id, id),
	FOREIGN KEY(organization_id) REFERENCES app.organizations (id)
)

;
CREATE INDEX ix_physical_exercise_versions_organization_id_author_user_id ON app.physical_exercise_versions (organization_id, author_user_id);

CREATE TABLE app.rubrics (
	id UUID NOT NULL,
	organization_id UUID NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	situation_id UUID NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(organization_id, situation_id) REFERENCES app.situations (organization_id, id),
	UNIQUE (organization_id, id, situation_id),
	UNIQUE (organization_id, id),
	FOREIGN KEY(organization_id) REFERENCES app.organizations (id)
)

;
CREATE INDEX ix_rubrics_organization_id_situation_id ON app.rubrics (organization_id, situation_id);

CREATE TABLE app.situation_versions (
	id UUID NOT NULL,
	organization_id UUID NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	situation_id UUID NOT NULL,
	version_number INTEGER NOT NULL,
	status VARCHAR(20) NOT NULL,
	rulebook_edition_id UUID NOT NULL,
	video_asset_id UUID NOT NULL,
	author_user_id UUID NOT NULL,
	prompt TEXT NOT NULL,
	technical_criterion JSONB NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(organization_id, situation_id) REFERENCES app.situations (organization_id, id),
	FOREIGN KEY(organization_id, rulebook_edition_id) REFERENCES app.rulebook_editions (organization_id, id),
	FOREIGN KEY(organization_id, video_asset_id) REFERENCES app.video_assets (organization_id, id),
	FOREIGN KEY(organization_id, author_user_id) REFERENCES app.memberships (organization_id, user_id),
	UNIQUE (organization_id, situation_id, version_number),
	UNIQUE (organization_id, id, situation_id),
	UNIQUE (organization_id, id, rulebook_edition_id),
	UNIQUE (organization_id, id, author_user_id),
	CHECK (version_number > 0),
	CHECK (status IN ('DRAFT','IN_REVIEW','APPROVED','PUBLISHED','ARCHIVED')),
	UNIQUE (organization_id, id),
	FOREIGN KEY(organization_id) REFERENCES app.organizations (id)
)

;
CREATE INDEX ix_situation_versions_organization_id_author_user_id ON app.situation_versions (organization_id, author_user_id);
CREATE INDEX ix_situation_versions_organization_id_rulebook_edition_id ON app.situation_versions (organization_id, rulebook_edition_id);
CREATE INDEX ix_situation_versions_organization_id_video_asset_id ON app.situation_versions (organization_id, video_asset_id);

CREATE TABLE app.training_session_versions (
	id UUID NOT NULL,
	organization_id UUID NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	training_session_id UUID NOT NULL,
	version_number INTEGER NOT NULL,
	status VARCHAR(20) NOT NULL,
	kind VARCHAR(30) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(organization_id, training_session_id) REFERENCES app.training_sessions (organization_id, id),
	UNIQUE (organization_id, training_session_id, version_number),
	UNIQUE (organization_id, id, kind),
	CHECK (kind IN ('COGNITIVE_DECISION','PHYSICAL')),
	CHECK (version_number > 0),
	CHECK (status IN ('DRAFT','IN_REVIEW','APPROVED','PUBLISHED','ARCHIVED')),
	UNIQUE (organization_id, id),
	FOREIGN KEY(organization_id) REFERENCES app.organizations (id)
)

;

CREATE TABLE app.approvals (
	id UUID NOT NULL,
	organization_id UUID NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	situation_version_id UUID,
	physical_exercise_version_id UUID,
	author_user_id UUID NOT NULL,
	reviewer_user_id UUID NOT NULL,
	reason TEXT NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(organization_id, situation_version_id, author_user_id) REFERENCES app.situation_versions (organization_id, id, author_user_id),
	FOREIGN KEY(organization_id, physical_exercise_version_id, author_user_id) REFERENCES app.physical_exercise_versions (organization_id, id, author_user_id),
	FOREIGN KEY(organization_id, reviewer_user_id) REFERENCES app.memberships (organization_id, user_id),
	CHECK (num_nonnulls(situation_version_id, physical_exercise_version_id) = 1),
	CHECK (reviewer_user_id <> author_user_id),
	CHECK (length(trim(reason)) > 0),
	UNIQUE (organization_id, id),
	FOREIGN KEY(organization_id) REFERENCES app.organizations (id)
)

;
CREATE INDEX ix_approvals_organization_id_physical_exercise_v_faf441b1ee7a ON app.approvals (organization_id, physical_exercise_version_id, author_user_id);
CREATE INDEX ix_approvals_organization_id_reviewer_user_id ON app.approvals (organization_id, reviewer_user_id);
CREATE INDEX ix_approvals_organization_id_situation_version_i_8821254a118b ON app.approvals (organization_id, situation_version_id, author_user_id);

CREATE TABLE app.rubric_versions (
	id UUID NOT NULL,
	organization_id UUID NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	rubric_id UUID NOT NULL,
	situation_id UUID NOT NULL,
	situation_version_id UUID NOT NULL,
	version_number INTEGER NOT NULL,
	status VARCHAR(20) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(organization_id, rubric_id, situation_id) REFERENCES app.rubrics (organization_id, id, situation_id),
	FOREIGN KEY(organization_id, situation_version_id, situation_id) REFERENCES app.situation_versions (organization_id, id, situation_id),
	UNIQUE (organization_id, rubric_id, version_number),
	UNIQUE (organization_id, id, situation_version_id),
	CHECK (version_number > 0),
	CHECK (status IN ('DRAFT','IN_REVIEW','APPROVED','PUBLISHED','ARCHIVED')),
	UNIQUE (organization_id, id),
	FOREIGN KEY(organization_id) REFERENCES app.organizations (id)
)

;
CREATE INDEX ix_rubric_versions_organization_id_rubric_id_situation_id ON app.rubric_versions (organization_id, rubric_id, situation_id);
CREATE INDEX ix_rubric_versions_organization_id_situation_ver_2f3f11fd3a8c ON app.rubric_versions (organization_id, situation_version_id, situation_id);

CREATE TABLE app.situation_options (
	id UUID NOT NULL,
	organization_id UUID NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	situation_version_id UUID NOT NULL,
	key VARCHAR(40) NOT NULL,
	text TEXT NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(organization_id, situation_version_id) REFERENCES app.situation_versions (organization_id, id),
	UNIQUE (organization_id, situation_version_id, key),
	UNIQUE (organization_id, id),
	FOREIGN KEY(organization_id) REFERENCES app.organizations (id)
)

;

CREATE TABLE app.training_runs (
	id UUID NOT NULL,
	organization_id UUID NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	user_id UUID NOT NULL,
	session_version_id UUID NOT NULL,
	state VARCHAR(20) NOT NULL,
	idempotency_key VARCHAR(128) NOT NULL,
	payload_hash VARCHAR(64) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(organization_id, user_id) REFERENCES app.memberships (organization_id, user_id),
	FOREIGN KEY(organization_id, session_version_id) REFERENCES app.training_session_versions (organization_id, id),
	UNIQUE (organization_id, id, session_version_id),
	UNIQUE (organization_id, id, session_version_id, user_id),
	UNIQUE (organization_id, user_id, idempotency_key),
	CHECK (state IN ('STARTED','COMPLETED','ABANDONED')),
	CHECK (payload_hash ~ '^[0-9a-f]{64}$'),
	CHECK (length(idempotency_key) > 0),
	UNIQUE (organization_id, id),
	FOREIGN KEY(organization_id) REFERENCES app.organizations (id)
)

;
CREATE INDEX ix_training_runs_organization_id_session_version_id ON app.training_runs (organization_id, session_version_id);

CREATE TABLE app.training_session_items (
	id UUID NOT NULL,
	organization_id UUID NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	session_version_id UUID NOT NULL,
	position INTEGER NOT NULL,
	kind VARCHAR(30) NOT NULL,
	situation_version_id UUID,
	physical_exercise_version_id UUID,
	planned_duration_seconds INTEGER,
	PRIMARY KEY (id),
	FOREIGN KEY(organization_id, session_version_id, kind) REFERENCES app.training_session_versions (organization_id, id, kind),
	FOREIGN KEY(organization_id, situation_version_id) REFERENCES app.situation_versions (organization_id, id),
	FOREIGN KEY(organization_id, physical_exercise_version_id) REFERENCES app.physical_exercise_versions (organization_id, id),
	UNIQUE (organization_id, session_version_id, position),
	UNIQUE (organization_id, session_version_id, id, kind),
	UNIQUE (organization_id, session_version_id, id, kind, situation_version_id),
	CHECK (position > 0),
	CHECK (planned_duration_seconds IS NULL OR planned_duration_seconds >= 0),
	CHECK ((kind = 'PHYSICAL' AND physical_exercise_version_id IS NOT NULL AND situation_version_id IS NULL) OR (kind = 'COGNITIVE_DECISION' AND situation_version_id IS NOT NULL AND physical_exercise_version_id IS NULL)),
	UNIQUE (organization_id, id),
	FOREIGN KEY(organization_id) REFERENCES app.organizations (id)
)

;
CREATE INDEX ix_training_session_items_organization_id_physic_3c4665d0394d ON app.training_session_items (organization_id, physical_exercise_version_id);
CREATE INDEX ix_training_session_items_organization_id_sessio_335e80fd4233 ON app.training_session_items (organization_id, session_version_id, kind);
CREATE INDEX ix_training_session_items_organization_id_situation_version_id ON app.training_session_items (organization_id, situation_version_id);

CREATE TABLE app.attempts (
	id UUID NOT NULL,
	organization_id UUID NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	user_id UUID NOT NULL,
	situation_version_id UUID NOT NULL,
	response JSONB NOT NULL,
	idempotency_key VARCHAR(128) NOT NULL,
	payload_hash VARCHAR(64) NOT NULL,
	training_run_id UUID,
	session_version_id UUID,
	session_item_id UUID,
	item_kind VARCHAR(30) DEFAULT 'COGNITIVE_DECISION' NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(organization_id, user_id) REFERENCES app.memberships (organization_id, user_id),
	FOREIGN KEY(organization_id, situation_version_id) REFERENCES app.situation_versions (organization_id, id),
	FOREIGN KEY(organization_id, training_run_id, session_version_id, user_id) REFERENCES app.training_runs (organization_id, id, session_version_id, user_id),
	FOREIGN KEY(organization_id, session_version_id, session_item_id, item_kind, situation_version_id) REFERENCES app.training_session_items (organization_id, session_version_id, id, kind, situation_version_id),
	UNIQUE (organization_id, user_id, idempotency_key),
	UNIQUE (organization_id, id, situation_version_id),
	CHECK (payload_hash ~ '^[0-9a-f]{64}$'),
	CHECK (length(idempotency_key) > 0),
	CHECK (item_kind = 'COGNITIVE_DECISION'),
	CHECK (num_nonnulls(training_run_id, session_version_id, session_item_id) IN (0,3)),
	UNIQUE (organization_id, id),
	FOREIGN KEY(organization_id) REFERENCES app.organizations (id)
)

;
CREATE INDEX ix_attempts_organization_id_session_version_id_s_108c2c7a0260 ON app.attempts (organization_id, session_version_id, session_item_id, item_kind, situation_version_id);
CREATE INDEX ix_attempts_organization_id_situation_version_id ON app.attempts (organization_id, situation_version_id);
CREATE INDEX ix_attempts_organization_id_training_run_id_sess_2195bdc1fae5 ON app.attempts (organization_id, training_run_id, session_version_id, user_id);

CREATE TABLE app.physical_results (
	id UUID NOT NULL,
	organization_id UUID NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	training_run_id UUID NOT NULL,
	session_version_id UUID NOT NULL,
	session_item_id UUID NOT NULL,
	item_kind VARCHAR(30) DEFAULT 'PHYSICAL' NOT NULL,
	completed BOOLEAN DEFAULT false NOT NULL,
	metric VARCHAR(40),
	value NUMERIC(12, 3),
	unit VARCHAR(20),
	protocol_version VARCHAR(100) NOT NULL,
	source VARCHAR(30) DEFAULT 'SELF_REPORTED' NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(organization_id, training_run_id, session_version_id) REFERENCES app.training_runs (organization_id, id, session_version_id),
	FOREIGN KEY(organization_id, session_version_id, session_item_id, item_kind) REFERENCES app.training_session_items (organization_id, session_version_id, id, kind),
	UNIQUE NULLS NOT DISTINCT (organization_id, training_run_id, session_item_id, metric),
	CHECK (item_kind = 'PHYSICAL'),
	CHECK (source = 'SELF_REPORTED'),
	CHECK (num_nonnulls(metric, value, unit) IN (0,3)),
	CHECK (value IS NULL OR value >= 0),
	CHECK (metric IS NULL OR (metric = 'duration' AND unit = 'seconds') OR (metric = 'distance' AND unit = 'meters') OR (metric = 'repetitions' AND unit = 'count')),
	CHECK (length(trim(protocol_version)) > 0),
	UNIQUE (organization_id, id),
	FOREIGN KEY(organization_id) REFERENCES app.organizations (id)
)

;
CREATE INDEX ix_physical_results_organization_id_session_vers_cb54713f79bf ON app.physical_results (organization_id, session_version_id, session_item_id, item_kind);
CREATE INDEX ix_physical_results_organization_id_training_run_58fbd55d461c ON app.physical_results (organization_id, training_run_id, session_version_id);

CREATE TABLE app.rubric_criteria (
	id UUID NOT NULL,
	organization_id UUID NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	rubric_version_id UUID NOT NULL,
	key VARCHAR(40) NOT NULL,
	weight NUMERIC(8, 4) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(organization_id, rubric_version_id) REFERENCES app.rubric_versions (organization_id, id),
	UNIQUE (organization_id, rubric_version_id, key),
	CHECK (weight > 0 AND weight <= 1),
	UNIQUE (organization_id, id),
	FOREIGN KEY(organization_id) REFERENCES app.organizations (id)
)

;

CREATE TABLE app.evaluations (
	id UUID NOT NULL,
	organization_id UUID NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	attempt_id UUID NOT NULL,
	situation_version_id UUID NOT NULL,
	rubric_version_id UUID NOT NULL,
	rulebook_edition_id UUID NOT NULL,
	algorithm_version VARCHAR(80) NOT NULL,
	score NUMERIC(7, 3) NOT NULL,
	breakdown JSONB NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(organization_id, attempt_id, situation_version_id) REFERENCES app.attempts (organization_id, id, situation_version_id),
	FOREIGN KEY(organization_id, rubric_version_id, situation_version_id) REFERENCES app.rubric_versions (organization_id, id, situation_version_id),
	FOREIGN KEY(organization_id, situation_version_id, rulebook_edition_id) REFERENCES app.situation_versions (organization_id, id, rulebook_edition_id),
	UNIQUE (organization_id, attempt_id),
	CHECK (score >= 0 AND score <= 100),
	UNIQUE (organization_id, id),
	FOREIGN KEY(organization_id) REFERENCES app.organizations (id)
)

;
CREATE INDEX ix_evaluations_organization_id_attempt_id_situation_version_id ON app.evaluations (organization_id, attempt_id, situation_version_id);
CREATE INDEX ix_evaluations_organization_id_rubric_version_id_59b125a2c83c ON app.evaluations (organization_id, rubric_version_id, situation_version_id);
CREATE INDEX ix_evaluations_organization_id_situation_version_6bca38350128 ON app.evaluations (organization_id, situation_version_id, rulebook_edition_id);

CREATE TABLE app.evaluation_reviews (
	id UUID NOT NULL,
	organization_id UUID NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
	evaluation_id UUID NOT NULL,
	reviewer_user_id UUID NOT NULL,
	reason TEXT NOT NULL,
	reviewed_score NUMERIC(7, 3) NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY(organization_id, evaluation_id) REFERENCES app.evaluations (organization_id, id),
	FOREIGN KEY(organization_id, reviewer_user_id) REFERENCES app.memberships (organization_id, user_id),
	CHECK (length(trim(reason)) > 0),
	CHECK (reviewed_score >= 0 AND reviewed_score <= 100),
	UNIQUE (organization_id, id),
	FOREIGN KEY(organization_id) REFERENCES app.organizations (id)
)

;
CREATE INDEX ix_evaluation_reviews_organization_id_evaluation_id ON app.evaluation_reviews (organization_id, evaluation_id);
CREATE INDEX ix_evaluation_reviews_organization_id_reviewer_user_id ON app.evaluation_reviews (organization_id, reviewer_user_id);
