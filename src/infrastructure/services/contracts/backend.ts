// Generated from contracts/backend.openapi.json. Do not edit.
export interface paths {
    "/api/v1/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Login */
        post: operations["login_api_v1_auth_login_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Logout */
        post: operations["logout_api_v1_auth_logout_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Refresh */
        post: operations["refresh_api_v1_auth_refresh_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Me */
        get: operations["me_api_v1_me_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/publications": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Publish */
        post: operations["publish_api_v1_publications_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/publications/{publication_id}/class-map": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Class Map */
        get: operations["class_map_api_v1_publications__publication_id__class_map_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/publications/{publication_id}/monitor": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Monitor */
        get: operations["monitor_api_v1_publications__publication_id__monitor_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/runs/{run_id}/close": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Close */
        post: operations["close_api_v1_runs__run_id__close_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/runs/{run_id}/open-lobby": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Open Lobby */
        post: operations["open_lobby_api_v1_runs__run_id__open_lobby_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/runs/{run_id}/start": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Start */
        post: operations["start_api_v1_runs__run_id__start_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/sessions/{session_id}/report": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Report */
        get: operations["report_api_v1_sessions__session_id__report_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/sessions/{session_id}/safety-actions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Safety Action */
        post: operations["safety_action_api_v1_sessions__session_id__safety_actions_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/student/missions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Missions */
        get: operations["missions_api_v1_student_missions_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/student/publications/{publication_id}/window-session": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Window Session */
        post: operations["window_session_api_v1_student_publications__publication_id__window_session_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/student/runs/join": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Join */
        post: operations["join_api_v1_student_runs_join_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/student/runs/{run_id}/lobby": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Lobby */
        get: operations["lobby_api_v1_student_runs__run_id__lobby_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/student/runs/{run_id}/warmup-choice": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Warmup Choice */
        put: operations["warmup_choice_api_v1_student_runs__run_id__warmup_choice_put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/student/sessions/{session_id}/answers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Submit Answer */
        post: operations["submit_answer_api_v1_student_sessions__session_id__answers_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/student/sessions/{session_id}/reflection": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Reflection */
        get: operations["reflection_api_v1_student_sessions__session_id__reflection_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/student/sessions/{session_id}/state": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Session State */
        get: operations["session_state_api_v1_student_sessions__session_id__state_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/student/sessions/{session_id}/telemetry": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Telemetry */
        post: operations["telemetry_api_v1_student_sessions__session_id__telemetry_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/teacher/assignments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Assignments */
        get: operations["assignments_api_v1_teacher_assignments_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/teacher/publications": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Publications */
        get: operations["publications_api_v1_teacher_publications_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Health */
        get: operations["health_health_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/health/ready": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Ready */
        get: operations["ready_health_ready_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** AnswerAccepted */
        AnswerAccepted: {
            /** Next Prompt Url */
            next_prompt_url: string;
            /**
             * Status
             * @default processing
             * @constant
             */
            status: "processing";
        };
        /** AnswerIn */
        AnswerIn: {
            /** Answer Text */
            answer_text: string;
            /**
             * Client Submission Id
             * Format: uuid
             */
            client_submission_id: string;
            /** Turn Index */
            turn_index: number;
        };
        /** AssignmentOut */
        AssignmentOut: {
            /**
             * Class Id
             * Format: uuid
             */
            class_id: string;
            /** Class Name */
            class_name: string;
            /** Grade Level */
            grade_level: number;
            /**
             * School Id
             * Format: uuid
             */
            school_id: string;
            /**
             * School Subject Id
             * Format: uuid
             */
            school_subject_id: string;
            /** Subject Name */
            subject_name: string;
        };
        /** AssignmentsOut */
        AssignmentsOut: {
            /** Items */
            items: components["schemas"]["AssignmentOut"][];
        };
        /** ClassMapOut */
        ClassMapOut: {
            /** Concepts */
            concepts: components["schemas"]["ConceptCountOut"][];
            /** Denominator */
            denominator: number;
            /** Incomplete Count */
            incomplete_count: number;
            insight?: components["schemas"]["InsightOut"] | null;
        };
        /** ClosedOut */
        ClosedOut: {
            /**
             * Closed At
             * Format: date-time
             */
            closed_at: string;
            /** Status */
            status: string;
        };
        /** ConceptCountOut */
        ConceptCountOut: {
            /**
             * Concept Id
             * Format: uuid
             */
            concept_id: string;
            /** Developing Count */
            developing_count: number;
            /** Mastered Count */
            mastered_count: number;
            /** Misconceptions */
            misconceptions: components["schemas"]["MisconceptionCountOut"][];
            /** Name */
            name: string;
            /** Not Observed Count */
            not_observed_count: number;
        };
        /** ConnectionEvent */
        ConnectionEvent: {
            /**
             * At
             * Format: date-time
             */
            at: string;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "disconnect" | "reconnect";
        };
        /** CountsOut */
        CountsOut: {
            /** Completed */
            completed: number;
            /** Evaluated */
            evaluated: number;
            /** Started */
            started: number;
            /** Timed Out */
            timed_out: number;
        };
        /** EvidenceOut */
        EvidenceOut: {
            /** Quote */
            quote: string;
            /**
             * Turn Id
             * Format: uuid
             */
            turn_id: string;
        };
        /** HTTPValidationError */
        HTTPValidationError: {
            /** Detail */
            detail?: components["schemas"]["ValidationError"][];
        };
        /** HiddenEvent */
        HiddenEvent: {
            /**
             * At
             * Format: date-time
             */
            at: string;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "visibility_hidden";
            /** Value */
            value: number;
        };
        /** InsightOut */
        InsightOut: {
            /**
             * Generated At
             * Format: date-time
             */
            generated_at: string;
            /** Narrative */
            narrative: string;
        };
        /** JoinIn */
        JoinIn: {
            /** Join Code */
            join_code: string;
        };
        /** JoinOut */
        JoinOut: {
            /** Deadline At */
            deadline_at: string | null;
            /** Mission Title */
            mission_title: string;
            /**
             * Participant Id
             * Format: uuid
             */
            participant_id: string;
            /**
             * Publication Id
             * Format: uuid
             */
            publication_id: string;
            /**
             * Run Id
             * Format: uuid
             */
            run_id: string;
            /**
             * Run Status
             * @enum {string}
             */
            run_status: "lobby" | "open";
            /** Session Id */
            session_id: string | null;
            warmup: components["schemas"]["WarmupOut"] | null;
        };
        /** LobbyOut */
        LobbyOut: {
            /** Join Code */
            join_code: string;
            /**
             * Lobby Opened At
             * Format: date-time
             */
            lobby_opened_at: string;
            /** Status */
            status: string;
        };
        /** LoginIn */
        LoginIn: {
            /** Email */
            email: string;
            /**
             * Password
             * Format: password
             */
            password: string;
        };
        /** MeOut */
        MeOut: {
            /** Full Name */
            full_name: string;
            /** Is Parent */
            is_parent: boolean;
            /** Is Platform Admin */
            is_platform_admin: boolean;
            /** Roles */
            roles: components["schemas"]["RoleOut"][];
            /**
             * User Id
             * Format: uuid
             */
            user_id: string;
        };
        /** MisconceptionCountOut */
        MisconceptionCountOut: {
            /** Count */
            count: number;
            /**
             * Misconception Id
             * Format: uuid
             */
            misconception_id: string;
            /** Resolved Count */
            resolved_count: number;
            /** Statement */
            statement: string;
            /** Student Ids */
            student_ids: string[];
        };
        /** MissionCardOut */
        MissionCardOut: {
            /** Attempt Status */
            attempt_status: string;
            /** Closes At */
            closes_at: string | null;
            /** Max Duration Minutes */
            max_duration_minutes: number;
            /** Mission Title */
            mission_title: string;
            /** Mode */
            mode: string;
            /** Opens At */
            opens_at: string | null;
            /**
             * Publication Id
             * Format: uuid
             */
            publication_id: string;
            /** Run Status */
            run_status: string;
            /** Subject Name */
            subject_name: string;
            /**
             * Target Duration Minutes
             * @default 15
             */
            target_duration_minutes: number;
        };
        /** MonitorOut */
        MonitorOut: {
            run: components["schemas"]["MonitorRunOut"];
            /** Students */
            students: components["schemas"]["MonitorStudentOut"][];
            /** Waiting Count */
            waiting_count: number;
        };
        /** MonitorRunOut */
        MonitorRunOut: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Join Code */
            join_code: string | null;
            /** Mode */
            mode: string;
            /** Started At */
            started_at: string | null;
            /** Status */
            status: string;
        };
        /** MonitorStudentOut */
        MonitorStudentOut: {
            /** Current Turn Index */
            current_turn_index: number | null;
            /** Deadline At */
            deadline_at: string | null;
            /** Max Turns */
            max_turns: number;
            /** Name */
            name: string;
            /** Open Flag Count */
            open_flag_count: number;
            /** Safety Paused */
            safety_paused: boolean;
            /** Status */
            status: string;
            /**
             * Student Id
             * Format: uuid
             */
            student_id: string;
        };
        /** OpeningGuessOut */
        OpeningGuessOut: {
            /** Choice Id */
            choice_id: string;
            /** Text */
            text: string;
        };
        /** OverrideOut */
        OverrideOut: {
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** New Level */
            new_level: number;
            /** Previous Level */
            previous_level: number;
            /** Reason */
            reason: string;
        };
        /** PasteEvent */
        PasteEvent: {
            /**
             * At
             * Format: date-time
             */
            at: string;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "paste";
            /** Value */
            value: number;
        };
        /** PromptOut */
        PromptOut: {
            /** Kind */
            kind: string;
            /** Text */
            text: string;
            /** Turn Index */
            turn_index: number;
        };
        /** PublicationOut */
        PublicationOut: {
            /**
             * Class Id
             * Format: uuid
             */
            class_id: string;
            /** Class Name */
            class_name: string;
            counts: components["schemas"]["CountsOut"];
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Mission Title */
            mission_title: string;
            /** Released To Parents At */
            released_to_parents_at: string | null;
            run: components["schemas"]["RunSummaryOut"];
        };
        /** PublicationsPageOut */
        PublicationsPageOut: {
            /** Items */
            items: components["schemas"]["PublicationOut"][];
            /** Next Cursor */
            next_cursor: string | null;
        };
        /** PublishIn */
        PublishIn: {
            /**
             * Class Id
             * Format: uuid
             */
            class_id: string;
            /**
             * Mission Version Id
             * Format: uuid
             */
            mission_version_id: string;
            run: components["schemas"]["RunIn"];
        };
        /** PublishOut */
        PublishOut: {
            /**
             * Publication Id
             * Format: uuid
             */
            publication_id: string;
            /**
             * Run Id
             * Format: uuid
             */
            run_id: string;
            /** Run Status */
            run_status: string;
        };
        /** ReflectionOut */
        ReflectionOut: {
            /** Completed At */
            completed_at: string | null;
            /** Content */
            content: string;
            /** Mission Title */
            mission_title: string;
            opening_guess: components["schemas"]["OpeningGuessOut"] | null;
        };
        /** RefreshIn */
        RefreshIn: {
            /** Refresh Token */
            refresh_token: string;
        };
        /** ReportConceptResultOut */
        ReportConceptResultOut: {
            /**
             * Concept Id
             * Format: uuid
             */
            concept_id: string;
            /** Misconception Id */
            misconception_id: string | null;
            /** Outcome */
            outcome: string;
            /** Resolved In Session */
            resolved_in_session: boolean;
        };
        /** ReportEvaluationOut */
        ReportEvaluationOut: {
            /** Status */
            status: string;
            /** Summary */
            summary: string | null;
        };
        /** ReportFlagOut */
        ReportFlagOut: {
            /** Flag Type */
            flag_type: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Severity */
            severity: string;
            /** Status */
            status: string;
        };
        /** ReportOut */
        ReportOut: {
            /** Concept Results */
            concept_results: components["schemas"]["ReportConceptResultOut"][];
            evaluation: components["schemas"]["ReportEvaluationOut"] | null;
            /** Flags */
            flags: components["schemas"]["ReportFlagOut"][];
            /** Scores */
            scores: components["schemas"]["ReportScoreOut"][];
            session: components["schemas"]["ReportSessionOut"];
            student: components["schemas"]["ReportStudentOut"];
            /** Turns */
            turns: components["schemas"]["ReportTurnOut"][];
        };
        /** ReportScoreOut */
        ReportScoreOut: {
            /** Ai Level */
            ai_level: number;
            /** Dimension */
            dimension: string;
            /** Evidence */
            evidence: components["schemas"]["EvidenceOut"][];
            /** Final Level */
            final_level: number;
            /** Overrides */
            overrides: components["schemas"]["OverrideOut"][];
            /** Rationale */
            rationale: string | null;
            /**
             * Score Id
             * Format: uuid
             */
            score_id: string;
        };
        /** ReportSessionOut */
        ReportSessionOut: {
            /** Attempt Number */
            attempt_number: number;
            /** End Reason */
            end_reason: string | null;
            /** Ended At */
            ended_at: string | null;
            /**
             * Started At
             * Format: date-time
             */
            started_at: string;
            /** Status */
            status: string;
        };
        /** ReportStudentOut */
        ReportStudentOut: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Name */
            name: string;
        };
        /** ReportTurnOut */
        ReportTurnOut: {
            /** Answer */
            answer: string | null;
            /** Answer State */
            answer_state: string | null;
            /** Guard Result */
            guard_result: string | null;
            /** Kind */
            kind: string;
            /** Move */
            move: string | null;
            /** Move Source */
            move_source: string | null;
            /** Prompt */
            prompt: string;
            /** Reason */
            reason: string | null;
            /** Reason Code */
            reason_code: string | null;
            /** Safety Paused */
            safety_paused: boolean;
            /**
             * Turn Id
             * Format: uuid
             */
            turn_id: string;
            /** Turn Index */
            turn_index: number;
        };
        /** RoleOut */
        RoleOut: {
            /** Role */
            role: string;
            /**
             * School Id
             * Format: uuid
             */
            school_id: string;
            /** School Name */
            school_name: string;
        };
        /** RunIn */
        RunIn: {
            /** Closes At */
            closes_at?: string | null;
            /**
             * Mode
             * @enum {string}
             */
            mode: "window" | "live";
            /** Opens At */
            opens_at?: string | null;
            /** Planner Mode */
            planner_mode?: ("table" | "hybrid") | null;
        };
        /** RunSummaryOut */
        RunSummaryOut: {
            /** Closes At */
            closes_at: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Join Code */
            join_code: string | null;
            /** Mode */
            mode: string;
            /** Opens At */
            opens_at: string | null;
            /** Status */
            status: string;
        };
        /** SafetyActionIn */
        SafetyActionIn: {
            /**
             * Action
             * @enum {string}
             */
            action: "resume" | "end";
            /** Note */
            note?: string | null;
        };
        /** SafetyActionOut */
        SafetyActionOut: {
            /**
             * Acted At
             * Format: date-time
             */
            acted_at: string;
            /**
             * Session Id
             * Format: uuid
             */
            session_id: string;
            /** Status */
            status: string;
        };
        /** SessionOut */
        SessionOut: {
            /** Access Token */
            access_token: string;
            /** Expires At */
            expires_at: number;
            /** Refresh Token */
            refresh_token: string;
            /**
             * Token Type
             * @default bearer
             * @constant
             */
            token_type: "bearer";
            /**
             * User Id
             * Format: uuid
             */
            user_id: string;
        };
        /** StartedOut */
        StartedOut: {
            /**
             * Started At
             * Format: date-time
             */
            started_at: string;
            /** Started Count */
            started_count: number;
            /** Status */
            status: string;
        };
        /** StateOut */
        StateOut: {
            /**
             * Deadline At
             * Format: date-time
             */
            deadline_at: string;
            /** Probe Number */
            probe_number: number;
            /** Probe Total */
            probe_total: number;
            prompt: components["schemas"]["PromptOut"] | null;
            /** Reflection Ready */
            reflection_ready: boolean;
            /** Safety Message */
            safety_message: string | null;
            /**
             * Started At
             * Format: date-time
             */
            started_at: string;
            /** Status */
            status: string;
            /** Turn Index */
            turn_index: number;
        };
        /** StudentLobbyOut */
        StudentLobbyOut: {
            /** Deadline At */
            deadline_at: string | null;
            /** Participant Status */
            participant_status: string;
            /** Run Status */
            run_status: string;
            /** Session Id */
            session_id: string | null;
            /** Started At */
            started_at: string | null;
            /** Warmup Choice Id */
            warmup_choice_id: string | null;
        };
        /** StudentMissionsOut */
        StudentMissionsOut: {
            /** Completed */
            completed: components["schemas"]["MissionCardOut"][];
            /** Open */
            open: components["schemas"]["MissionCardOut"][];
            /** Upcoming */
            upcoming: components["schemas"]["MissionCardOut"][];
        };
        /** TelemetryAccepted */
        TelemetryAccepted: {
            /** Accepted Client Seq */
            accepted_client_seq: number;
        };
        /** TelemetryIn */
        TelemetryIn: {
            /** Client Sent At */
            client_sent_at?: string | null;
            /** Client Seq */
            client_seq: number;
            /** Events */
            events: (components["schemas"]["PasteEvent"] | components["schemas"]["HiddenEvent"] | components["schemas"]["ConnectionEvent"] | components["schemas"]["TypingEvent"])[];
            /** Turn Index */
            turn_index?: number | null;
        };
        /** TypingEvent */
        TypingEvent: {
            /**
             * At
             * Format: date-time
             */
            at: string;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "typing";
            value: components["schemas"]["TypingValue"];
        };
        /** TypingValue */
        TypingValue: {
            /** Chars */
            chars: number;
            /** Duration Ms */
            duration_ms: number;
        };
        /** ValidationError */
        ValidationError: {
            /** Context */
            ctx?: Record<string, never>;
            /** Input */
            input?: unknown;
            /** Location */
            loc: (string | number)[];
            /** Message */
            msg: string;
            /** Error Type */
            type: string;
        };
        /** WarmupChoiceIn */
        WarmupChoiceIn: {
            /** Choice Id */
            choice_id: string;
        };
        /** WarmupChoiceOut */
        WarmupChoiceOut: {
            /** Id */
            id: string;
            /** Text */
            text: string;
        };
        /** WarmupOut */
        WarmupOut: {
            /** Choices */
            choices: components["schemas"]["WarmupChoiceOut"][];
            /** Prompt */
            prompt: string;
        };
        /** WarmupSavedOut */
        WarmupSavedOut: {
            /** Choice Id */
            choice_id: string;
            /**
             * Scored
             * @default false
             * @constant
             */
            scored: false;
            /**
             * Submitted At
             * Format: date-time
             */
            submitted_at: string;
        };
        /** WindowSessionOut */
        WindowSessionOut: {
            /**
             * Deadline At
             * Format: date-time
             */
            deadline_at: string;
            prompt: components["schemas"]["PromptOut"];
            /**
             * Session Id
             * Format: uuid
             */
            session_id: string;
            /**
             * Started At
             * Format: date-time
             */
            started_at: string;
            /** Status */
            status: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    login_api_v1_auth_login_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SessionOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    logout_api_v1_auth_logout_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    refresh_api_v1_auth_refresh_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RefreshIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SessionOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    me_api_v1_me_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MeOut"];
                };
            };
        };
    };
    publish_api_v1_publications_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PublishIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublishOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    class_map_api_v1_publications__publication_id__class_map_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                publication_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClassMapOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    monitor_api_v1_publications__publication_id__monitor_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                publication_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MonitorOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    close_api_v1_runs__run_id__close_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                run_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClosedOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    open_lobby_api_v1_runs__run_id__open_lobby_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                run_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LobbyOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    start_api_v1_runs__run_id__start_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                run_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StartedOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    report_api_v1_sessions__session_id__report_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                session_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReportOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    safety_action_api_v1_sessions__session_id__safety_actions_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                session_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SafetyActionIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SafetyActionOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    missions_api_v1_student_missions_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudentMissionsOut"];
                };
            };
        };
    };
    window_session_api_v1_student_publications__publication_id__window_session_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                publication_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WindowSessionOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    join_api_v1_student_runs_join_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["JoinIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["JoinOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    lobby_api_v1_student_runs__run_id__lobby_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                run_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudentLobbyOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    warmup_choice_api_v1_student_runs__run_id__warmup_choice_put: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                run_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["WarmupChoiceIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["WarmupSavedOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    submit_answer_api_v1_student_sessions__session_id__answers_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                session_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AnswerIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AnswerAccepted"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    reflection_api_v1_student_sessions__session_id__reflection_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                session_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReflectionOut"];
                };
            };
            /** @description Evaluation still pending */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    session_state_api_v1_student_sessions__session_id__state_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                session_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StateOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    telemetry_api_v1_student_sessions__session_id__telemetry_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                session_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["TelemetryIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TelemetryAccepted"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    assignments_api_v1_teacher_assignments_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssignmentsOut"];
                };
            };
        };
    };
    publications_api_v1_teacher_publications_get: {
        parameters: {
            query?: {
                class_id?: string | null;
                limit?: number;
                cursor?: string | null;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PublicationsPageOut"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    health_health_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        [key: string]: string;
                    };
                };
            };
        };
    };
    ready_health_ready_get: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
        };
    };
}
