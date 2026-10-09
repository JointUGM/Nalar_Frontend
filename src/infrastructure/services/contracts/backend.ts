// Generated from contracts/backend.openapi.json. Do not edit.
export interface paths {
    "/api/v1/auth/activate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Activate */
        post: operations["activate_api_v1_auth_activate_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
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
    "/api/v1/auth/password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Change Password */
        post: operations["change_password_api_v1_auth_password_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/password-reset": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Request Password Reset */
        post: operations["request_password_reset_api_v1_auth_password_reset_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/password-reset/confirm": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Confirm Password Reset */
        post: operations["confirm_password_reset_api_v1_auth_password_reset_confirm_post"];
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
        /** Session */
        post: operations["session_api_v1_auth_refresh_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/session": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Session */
        get: operations["session_api_v1_auth_session_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/client-events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Client Events */
        post: operations["client_events_api_v1_client_events_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/concepts/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Patch Concept */
        patch: operations["patch_concept_api_v1_concepts__item_id__patch"];
        trace?: never;
    };
    "/api/v1/concepts/{item_id}/review": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Review Concept */
        post: operations["review_concept_api_v1_concepts__item_id__review_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/config": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Config */
        get: operations["config_api_v1_config_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/flags/{flag_id}/review": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Review Flag */
        post: operations["review_flag_api_v1_flags__flag_id__review_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/jobs/{job_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Job */
        get: operations["get_job_api_v1_jobs__job_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/knowledge-bases/{kb_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Kb */
        get: operations["get_kb_api_v1_knowledge_bases__kb_id__get"];
        put?: never;
        post?: never;
        /** Archive Kb */
        delete: operations["archive_kb_api_v1_knowledge_bases__kb_id__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/knowledge-bases/{kb_id}/archive": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Archive Kb */
        post: operations["archive_kb_api_v1_knowledge_bases__kb_id__archive_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/knowledge-bases/{kb_id}/concepts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create Concept */
        post: operations["create_concept_api_v1_knowledge_bases__kb_id__concepts_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/knowledge-bases/{kb_id}/concepts/{concept_id}/archive": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Archive Concept */
        post: operations["archive_concept_api_v1_knowledge_bases__kb_id__concepts__concept_id__archive_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/knowledge-bases/{kb_id}/concepts/{concept_id}/misconceptions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create Misconception */
        post: operations["create_misconception_api_v1_knowledge_bases__kb_id__concepts__concept_id__misconceptions_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/knowledge-bases/{kb_id}/materials": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Add Material */
        post: operations["add_material_api_v1_knowledge_bases__kb_id__materials_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/knowledge-bases/{kb_id}/materials/{material_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Delete Material */
        delete: operations["delete_material_api_v1_knowledge_bases__kb_id__materials__material_id__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/knowledge-bases/{kb_id}/materials/{material_id}/file": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Material File */
        get: operations["material_file_api_v1_knowledge_bases__kb_id__materials__material_id__file_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/knowledge-bases/{kb_id}/national-references/{document_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Adopt */
        post: operations["adopt_api_v1_knowledge_bases__kb_id__national_references__document_id__post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/knowledge-bases/{kb_id}/owner": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Transfer Kb */
        post: operations["transfer_kb_api_v1_knowledge_bases__kb_id__owner_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/knowledge-bases/{kb_id}/review-queue": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Review Queue */
        get: operations["review_queue_api_v1_knowledge_bases__kb_id__review_queue_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/knowledge-bases/{kb_id}/sections": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Sections */
        get: operations["list_sections_api_v1_knowledge_bases__kb_id__sections_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/knowledge-bases/{kb_id}/sections/{section_id}/build": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Build Section */
        post: operations["build_section_api_v1_knowledge_bases__kb_id__sections__section_id__build_post"];
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
    "/api/v1/misconceptions/{item_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Patch Misconception */
        patch: operations["patch_misconception_api_v1_misconceptions__item_id__patch"];
        trace?: never;
    };
    "/api/v1/misconceptions/{item_id}/review": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Review Misconception */
        post: operations["review_misconception_api_v1_misconceptions__item_id__review_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/missions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create Mission */
        post: operations["create_mission_api_v1_missions_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/missions/{mission_id}/archive": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Archive Mission */
        post: operations["archive_mission_api_v1_missions__mission_id__archive_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/missions/{mission_id}/generate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Generate Mission */
        post: operations["generate_mission_api_v1_missions__mission_id__generate_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/missions/{mission_id}/versions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Versions */
        get: operations["list_versions_api_v1_missions__mission_id__versions_get"];
        put?: never;
        /** Create Version */
        post: operations["create_version_api_v1_missions__mission_id__versions_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/missions/{mission_id}/versions/{number}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Version */
        get: operations["get_version_api_v1_missions__mission_id__versions__number__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/missions/{mission_id}/versions/{number}/review": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Review Version */
        post: operations["review_version_api_v1_missions__mission_id__versions__number__review_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/notifications": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Notifications */
        get: operations["notifications_api_v1_notifications_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/notifications/{notification_id}/read": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Read Notification */
        post: operations["read_notification_api_v1_notifications__notification_id__read_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/parent/children": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Children */
        get: operations["children_api_v1_parent_children_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/parent/children/{student_id}/progress": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Progress */
        get: operations["progress_api_v1_parent_children__student_id__progress_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/parent/children/{student_id}/reflections": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Reflections */
        get: operations["reflections_api_v1_parent_children__student_id__reflections_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/parent/children/{student_id}/seen": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Mark Seen */
        post: operations["mark_seen_api_v1_parent_children__student_id__seen_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/parent/preferences": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Preferences */
        get: operations["preferences_api_v1_parent_preferences_get"];
        /** Set Preferences */
        put: operations["set_preferences_api_v1_parent_preferences_put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/platform/ai-usage": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Ai Usage */
        get: operations["ai_usage_api_v1_platform_ai_usage_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/platform/audit-log": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Platform Audit */
        get: operations["platform_audit_api_v1_platform_audit_log_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/platform/curriculum-versions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Curriculum Versions */
        get: operations["curriculum_versions_api_v1_platform_curriculum_versions_get"];
        put?: never;
        /** Publish Curriculum */
        post: operations["publish_curriculum_api_v1_platform_curriculum_versions_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/platform/curriculum-versions/{version_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Curriculum Version */
        get: operations["curriculum_version_api_v1_platform_curriculum_versions__version_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/platform/references": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Platform */
        get: operations["list_platform_api_v1_platform_references_get"];
        put?: never;
        /** Upload */
        post: operations["upload_api_v1_platform_references_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/platform/references/{document_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Detail */
        get: operations["detail_api_v1_platform_references__document_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/platform/references/{document_id}/draft": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Request Draft */
        post: operations["request_draft_api_v1_platform_references__document_id__draft_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/platform/references/{document_id}/file": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Source File */
        get: operations["source_file_api_v1_platform_references__document_id__file_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/platform/references/{document_id}/publish": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Publish */
        post: operations["publish_api_v1_platform_references__document_id__publish_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/platform/references/{document_id}/retry": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Retry */
        post: operations["retry_api_v1_platform_references__document_id__retry_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/platform/references/{document_id}/review": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Review */
        put: operations["review_api_v1_platform_references__document_id__review_put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/platform/schools": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Schools */
        get: operations["schools_api_v1_platform_schools_get"];
        put?: never;
        /** Create School */
        post: operations["create_school_api_v1_platform_schools_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/platform/schools/{school_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** School Detail */
        get: operations["school_detail_api_v1_platform_schools__school_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Edit School */
        patch: operations["edit_school_api_v1_platform_schools__school_id__patch"];
        trace?: never;
    };
    "/api/v1/platform/schools/{school_id}/admin": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** School Admin */
        post: operations["school_admin_api_v1_platform_schools__school_id__admin_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/platform/schools/{school_id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** School Status */
        patch: operations["school_status_api_v1_platform_schools__school_id__status_patch"];
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
    "/api/v1/publications/{publication_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Publication Detail */
        get: operations["publication_detail_api_v1_publications__publication_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Edit Publication */
        patch: operations["edit_publication_api_v1_publications__publication_id__patch"];
        trace?: never;
    };
    "/api/v1/publications/{publication_id}/attempt-grants": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Grant Attempt */
        post: operations["grant_attempt_api_v1_publications__publication_id__attempt_grants_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/publications/{publication_id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Cancel Publication */
        post: operations["cancel_publication_api_v1_publications__publication_id__cancel_post"];
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
    "/api/v1/publications/{publication_id}/export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Export Publication */
        get: operations["export_publication_api_v1_publications__publication_id__export_get"];
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
    "/api/v1/publications/{publication_id}/release": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Release */
        post: operations["release_api_v1_publications__publication_id__release_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/publications/{publication_id}/release-preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Preview */
        get: operations["preview_api_v1_publications__publication_id__release_preview_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/roster-imports/{import_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Import */
        get: operations["get_import_api_v1_roster_imports__import_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/roster-imports/{import_id}/errors.csv": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Import Errors */
        get: operations["import_errors_api_v1_roster_imports__import_id__errors_csv_get"];
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
    "/api/v1/runs/{run_id}/participants/{participant_id}/remove": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Remove Participant */
        post: operations["remove_participant_api_v1_runs__run_id__participants__participant_id__remove_post"];
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
    "/api/v1/schools/{school_id}/academic-years": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Academic Years */
        get: operations["academic_years_api_v1_schools__school_id__academic_years_get"];
        put?: never;
        /** Create Year */
        post: operations["create_year_api_v1_schools__school_id__academic_years_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/schools/{school_id}/account-invitations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Invitations */
        get: operations["list_invitations_api_v1_schools__school_id__account_invitations_get"];
        put?: never;
        /** Request Invitations */
        post: operations["request_invitations_api_v1_schools__school_id__account_invitations_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/schools/{school_id}/assignments": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Assignments */
        get: operations["assignments_api_v1_schools__school_id__assignments_get"];
        /** Assign Teacher */
        put: operations["assign_teacher_api_v1_schools__school_id__assignments_put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/schools/{school_id}/audit-log": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** School Audit */
        get: operations["school_audit_api_v1_schools__school_id__audit_log_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/schools/{school_id}/classes": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Classes */
        get: operations["classes_api_v1_schools__school_id__classes_get"];
        put?: never;
        /** Create Class */
        post: operations["create_class_api_v1_schools__school_id__classes_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/schools/{school_id}/classes/{class_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Edit Class */
        patch: operations["edit_class_api_v1_schools__school_id__classes__class_id__patch"];
        trace?: never;
    };
    "/api/v1/schools/{school_id}/classes/{class_id}/students": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Place Students */
        post: operations["place_students_api_v1_schools__school_id__classes__class_id__students_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/schools/{school_id}/curriculum-versions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** School Curriculum Versions */
        get: operations["school_curriculum_versions_api_v1_schools__school_id__curriculum_versions_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/schools/{school_id}/curriculum-versions/{version_id}/subjects/{cp_subject_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** School Cp Subject */
        get: operations["school_cp_subject_api_v1_schools__school_id__curriculum_versions__version_id__subjects__cp_subject_id__get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/schools/{school_id}/knowledge-bases": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Kbs */
        get: operations["list_kbs_api_v1_schools__school_id__knowledge_bases_get"];
        put?: never;
        /** Create Kb */
        post: operations["create_kb_api_v1_schools__school_id__knowledge_bases_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/schools/{school_id}/missions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Missions */
        get: operations["list_missions_api_v1_schools__school_id__missions_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/schools/{school_id}/national-references": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Teacher */
        get: operations["list_teacher_api_v1_schools__school_id__national_references_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/schools/{school_id}/people": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** People */
        get: operations["people_api_v1_schools__school_id__people_get"];
        put?: never;
        /** Create Person */
        post: operations["create_person_api_v1_schools__school_id__people_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/schools/{school_id}/people/{parent_id}/children/{student_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Link Child */
        put: operations["link_child_api_v1_schools__school_id__people__parent_id__children__student_id__put"];
        post?: never;
        /** Unlink Child */
        delete: operations["unlink_child_api_v1_schools__school_id__people__parent_id__children__student_id__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/schools/{school_id}/people/{user_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Edit Person */
        patch: operations["edit_person_api_v1_schools__school_id__people__user_id__patch"];
        trace?: never;
    };
    "/api/v1/schools/{school_id}/people/{user_id}/deactivate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Deactivate Person */
        post: operations["deactivate_person_api_v1_schools__school_id__people__user_id__deactivate_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/schools/{school_id}/people/{user_id}/reactivate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Reactivate Person */
        post: operations["reactivate_person_api_v1_schools__school_id__people__user_id__reactivate_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/schools/{school_id}/roster-imports": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List Imports */
        get: operations["list_imports_api_v1_schools__school_id__roster_imports_get"];
        put?: never;
        /** Upload Roster */
        post: operations["upload_roster_api_v1_schools__school_id__roster_imports_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/schools/{school_id}/subjects": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Subjects */
        get: operations["subjects_api_v1_schools__school_id__subjects_get"];
        put?: never;
        /** Create Subject */
        post: operations["create_subject_api_v1_schools__school_id__subjects_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/schools/{school_id}/subjects/{subject_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Delete Subject */
        delete: operations["delete_subject_api_v1_schools__school_id__subjects__subject_id__delete"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/schools/{school_id}/subjects/{subject_id}/curriculum": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Set Curriculum */
        put: operations["set_curriculum_api_v1_schools__school_id__subjects__subject_id__curriculum_put"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/scores/{score_id}/overrides": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Override Score */
        post: operations["override_score_api_v1_scores__score_id__overrides_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/sessions/{session_id}/end": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** End Session */
        post: operations["end_session_api_v1_sessions__session_id__end_post"];
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
    "/api/v1/sessions/{session_id}/report/export": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Export Report */
        get: operations["export_report_api_v1_sessions__session_id__report_export_get"];
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
    "/api/v1/student/reflections": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Reflections */
        get: operations["reflections_api_v1_student_reflections_get"];
        put?: never;
        post?: never;
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
    "/api/v1/student/runs/{run_id}/leave": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Leave Lobby */
        post: operations["leave_lobby_api_v1_student_runs__run_id__leave_post"];
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
    "/api/v1/teacher/attention": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Attention */
        get: operations["attention_api_v1_teacher_attention_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/teacher/classes/{class_id}/students": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Class Students */
        get: operations["class_students_api_v1_teacher_classes__class_id__students_get"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/teacher/dashboard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Dashboard */
        get: operations["dashboard_api_v1_teacher_dashboard_get"];
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
    "/api/v1/teacher/students/{student_id}/history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Student History */
        get: operations["student_history_api_v1_teacher_students__student_id__history_get"];
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
        /** AcademicYearCreatedOut */
        AcademicYearCreatedOut: {
            /**
             * Academic Year Id
             * Format: uuid
             */
            academic_year_id: string;
        };
        /** AcademicYearIn */
        AcademicYearIn: {
            /** Copy Classes From */
            copy_classes_from?: string | null;
            /**
             * Ends On
             * Format: date
             */
            ends_on: string;
            name: components["schemas"]["Name"];
            /**
             * Starts On
             * Format: date
             */
            starts_on: string;
        };
        /** AcademicYearOut */
        AcademicYearOut: {
            /**
             * Ends On
             * Format: date
             */
            ends_on: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Is Current */
            is_current: boolean;
            /** Name */
            name: string;
            /**
             * Starts On
             * Format: date
             */
            starts_on: string;
        };
        /** ActivateIn */
        ActivateIn: {
            /**
             * Activation Id
             * Format: uuid
             */
            activation_id: string;
            /**
             * Password
             * Format: password
             */
            password: string;
            /**
             * Token Hash
             * Format: password
             */
            token_hash: string;
        };
        /** AdminEmailIn */
        AdminEmailIn: {
            /** Email */
            email: string;
        };
        /** AiUsageOut */
        AiUsageOut: {
            /** Calls */
            calls: number;
            /** Cost Usd */
            cost_usd: number;
            /**
             * Day
             * Format: date
             */
            day: string;
            /** Failed Calls */
            failed_calls: number;
            /** Input Tokens */
            input_tokens: number;
            /** Model */
            model: string;
            /** Output Tokens */
            output_tokens: number;
            /** Purpose */
            purpose: string;
            /** School Id */
            school_id: string | null;
        };
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
        /** AssignmentIn */
        AssignmentIn: {
            /**
             * Class Id
             * Format: uuid
             */
            class_id: string;
            /**
             * School Subject Id
             * Format: uuid
             */
            school_subject_id: string;
            /** Teacher Id */
            teacher_id: string | null;
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
        /** AttemptGrantIn */
        AttemptGrantIn: {
            /** Closes At */
            closes_at?: string | null;
            /** Opens At */
            opens_at?: string | null;
            /** Reason */
            reason: string;
            /**
             * Student Id
             * Format: uuid
             */
            student_id: string;
        };
        /** AttemptGrantOut */
        AttemptGrantOut: {
            /**
             * Grant Id
             * Format: uuid
             */
            grant_id: string;
            /**
             * Run Id
             * Format: uuid
             */
            run_id: string;
        };
        /** AttentionCountsOut */
        AttentionCountsOut: {
            /** Flag */
            flag: number;
            /** Kb Review */
            kb_review: number;
            /** Release Ready */
            release_ready: number;
            /** Safety */
            safety: number;
            /** Total */
            total: number;
        };
        /** AttentionPageOut */
        AttentionPageOut: {
            counts: components["schemas"]["AttentionCountsOut"];
            /** Items */
            items: (components["schemas"]["SafetyAttentionOut"] | components["schemas"]["FlagAttentionOut"] | components["schemas"]["KbReviewAttentionOut"] | components["schemas"]["ReleaseReadyAttentionOut"])[];
            /** Next Cursor */
            next_cursor: string | null;
        };
        /** AuditItemOut */
        AuditItemOut: {
            /** Action */
            action: string;
            /** Actor Id */
            actor_id: string | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Entity Id */
            entity_id: string | null;
            /** Entity Table */
            entity_table: string;
            /** Id */
            id: number;
            /** School Id */
            school_id: string | null;
        };
        /** AuditPageOut */
        AuditPageOut: {
            /** Items */
            items: components["schemas"]["AuditItemOut"][];
            /** Next Cursor */
            next_cursor: number | null;
        };
        /** BankQuestionIn */
        BankQuestionIn: {
            /**
             * Concept Id
             * Format: uuid
             */
            concept_id: string;
            /** Id */
            id: string;
            /** Misconception Id */
            misconception_id?: string | null;
            /** Move */
            move: string;
            /** Text */
            text: string;
        };
        /** BlockerOut */
        BlockerOut: {
            /** Code */
            code: string;
            /** Count */
            count: number;
        };
        /** Body_add_material_api_v1_knowledge_bases__kb_id__materials_post */
        Body_add_material_api_v1_knowledge_bases__kb_id__materials_post: {
            /** File */
            file: string;
        };
        /** Body_create_kb_api_v1_schools__school_id__knowledge_bases_post */
        Body_create_kb_api_v1_schools__school_id__knowledge_bases_post: {
            /** File */
            file: string;
            /**
             * School Subject Id
             * Format: uuid
             */
            school_subject_id: string;
            /** Topic Title */
            topic_title: string;
        };
        /** Body_upload_api_v1_platform_references_post */
        Body_upload_api_v1_platform_references_post: {
            /** File */
            file: string;
            /** Issuer */
            issuer: string;
            /**
             * Kind
             * @enum {string}
             */
            kind: "curriculum" | "guidance";
            /**
             * Source Url
             * Format: uri
             */
            source_url: string;
            /** Title */
            title: string;
        };
        /** Body_upload_roster_api_v1_schools__school_id__roster_imports_post */
        Body_upload_roster_api_v1_schools__school_id__roster_imports_post: {
            /**
             * Academic Year Id
             * Format: uuid
             */
            academic_year_id: string;
            /** File */
            file: string;
        };
        /** BuildQueuedOut */
        BuildQueuedOut: {
            /**
             * Job Id
             * Format: uuid
             */
            job_id: string;
            /**
             * Section Id
             * Format: uuid
             */
            section_id: string;
            /**
             * Status
             * @default queued
             */
            status: string;
        };
        /** ChangedMisconceptionOut */
        ChangedMisconceptionOut: {
            /** Held */
            held: number;
            /**
             * Misconception Id
             * Format: uuid
             */
            misconception_id: string;
            /** Resolved */
            resolved: number;
            /** Statement */
            statement: string;
        };
        /** ClassIn */
        ClassIn: {
            /**
             * Academic Year Id
             * Format: uuid
             */
            academic_year_id: string;
            /** Grade Level */
            grade_level: number;
            /** Homeroom Teacher Id */
            homeroom_teacher_id?: string | null;
            name: components["schemas"]["Name"];
        };
        /** ClassMapEdgeOut */
        ClassMapEdgeOut: {
            /**
             * Concept Id
             * Format: uuid
             */
            concept_id: string;
            /**
             * Prerequisite Id
             * Format: uuid
             */
            prerequisite_id: string;
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
            /** Prerequisites */
            prerequisites?: components["schemas"]["ClassMapEdgeOut"][];
        };
        /** ClassOut */
        ClassOut: {
            /**
             * Academic Year Id
             * Format: uuid
             */
            academic_year_id: string;
            /** Archived At */
            archived_at: string | null;
            /**
             * Class Id
             * Format: uuid
             */
            class_id: string;
            /** Grade Level */
            grade_level: number;
            /** Homeroom Teacher Id */
            homeroom_teacher_id: string | null;
            /** Name */
            name: string;
            /** Student Count */
            student_count: number;
        };
        /** ClassPatchIn */
        ClassPatchIn: {
            /** Academic Year Id */
            academic_year_id?: string | null;
            /** Grade Level */
            grade_level?: number | null;
            /** Homeroom Teacher Id */
            homeroom_teacher_id?: string | null;
            name?: components["schemas"]["Name"] | null;
        };
        /** ClassStudentOut */
        ClassStudentOut: {
            /** Completed At */
            completed_at: string | null;
            concept_counts: components["schemas"]["StudentConceptCountsOut"];
            /** Evaluation Status */
            evaluation_status: ("pending" | "completed" | "failed" | "no_answer") | null;
            /** Full Name */
            full_name: string;
            /** Open Flag Count */
            open_flag_count: number;
            /** Session Id */
            session_id: string | null;
            /** Status */
            status: ("not_started" | "in_progress" | "paused_safety" | "completed" | "timed_out" | "ended_safety") | null;
            /**
             * Student Id
             * Format: uuid
             */
            student_id: string;
        };
        /** ClassStudentsOut */
        ClassStudentsOut: {
            /** Items */
            items: components["schemas"]["ClassStudentOut"][];
            /** Publication Id */
            publication_id: string | null;
        };
        /** ClientEventIn */
        ClientEventIn: {
            /** Code */
            code: string;
            /**
             * Event Id
             * Format: uuid
             */
            event_id: string;
            /**
             * Kind
             * @enum {string}
             */
            kind: "error" | "vital";
            /**
             * Occurred At
             * Format: date-time
             */
            occurred_at: string;
            /** Route */
            route: string;
            /** Value */
            value?: number | null;
        };
        /** ClientEventsIn */
        ClientEventsIn: {
            /** Events */
            events: components["schemas"]["ClientEventIn"][];
        };
        /** ClientEventsOut */
        ClientEventsOut: {
            /** Accepted */
            accepted: number;
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
        /** ConceptCreateIn */
        ConceptCreateIn: {
            description?: components["schemas"]["ItemText"] | null;
            /** Name */
            name: string;
            /** Source Chunk Ids */
            source_chunk_ids?: string[];
        };
        /** ConceptOut */
        ConceptOut: {
            /** Cp Learning Outcome Id */
            cp_learning_outcome_id: string | null;
            /** Description */
            description: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Name */
            name: string;
            /** Review Status */
            review_status: string;
            /** Source Chunk Ids */
            source_chunk_ids: string[];
            /** Sources */
            sources: components["schemas"]["PageSourceOut"][];
        };
        /** ConceptPatchIn */
        ConceptPatchIn: {
            /** Description */
            description?: string | null;
            /** Name */
            name?: string | null;
        };
        /** ConfigOut */
        ConfigOut: {
            /** Account Email Enabled */
            account_email_enabled: boolean;
            /** Password Reset Enabled */
            password_reset_enabled: boolean;
            /** Weekly Digest Enabled */
            weekly_digest_enabled: boolean;
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
        /** CurriculumCreatedOut */
        CurriculumCreatedOut: {
            /**
             * Curriculum Version Id
             * Format: uuid
             */
            curriculum_version_id: string;
        };
        /** CurriculumDetailOut */
        CurriculumDetailOut: {
            /** Decree Code */
            decree_code: string;
            /**
             * Effective On
             * Format: date
             */
            effective_on: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Is Current */
            is_current: boolean;
            /** Name */
            name: string;
            /** Published At */
            published_at: string | null;
            /** School Count */
            school_count: number;
            /**
             * Status
             * @enum {string}
             */
            status: "draft" | "published" | "superseded";
            /** Subjects */
            subjects: components["schemas"]["CurriculumSubjectOut"][];
        };
        /** CurriculumIn */
        CurriculumIn: {
            decree_code: components["schemas"]["Name"];
            /**
             * Effective On
             * Format: date
             */
            effective_on: string;
            /**
             * Is Current
             * @default true
             */
            is_current: boolean;
            name: components["schemas"]["Name"];
            /** Subjects */
            subjects: components["schemas"]["CurriculumSubjectIn"][];
        };
        /** CurriculumMappingIn */
        CurriculumMappingIn: {
            /** Cp Subject Id */
            cp_subject_id?: string | null;
            /**
             * Cp Version Id
             * Format: uuid
             */
            cp_version_id: string;
        };
        /** CurriculumSubjectChoiceOut */
        CurriculumSubjectChoiceOut: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Name */
            name: string;
            /** Phase */
            phase: string;
        };
        /** CurriculumSubjectIn */
        CurriculumSubjectIn: {
            /** Learning Outcomes */
            learning_outcomes: components["schemas"]["LearningOutcomeIn"][];
            name: components["schemas"]["Name"];
            /** Phase */
            phase: string;
        };
        /** CurriculumSubjectOut */
        CurriculumSubjectOut: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Learning Outcomes */
            learning_outcomes: components["schemas"]["LearningOutcomeOut"][];
            /** Name */
            name: string;
            /** Phase */
            phase: string;
        };
        /** CurriculumVersionOut */
        CurriculumVersionOut: {
            /** Decree Code */
            decree_code: string;
            /**
             * Effective On
             * Format: date
             */
            effective_on: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Is Current */
            is_current: boolean;
            /** Name */
            name: string;
            /** Published At */
            published_at: string | null;
            /** School Count */
            school_count: number;
            /**
             * Status
             * @enum {string}
             */
            status: "draft" | "published" | "superseded";
        };
        /** DashboardTrendOut */
        DashboardTrendOut: {
            /** Developing */
            developing: number;
            /** Mastered */
            mastered: number;
            /** Misconception */
            misconception: number;
            /**
             * Week Start
             * Format: date-time
             */
            week_start: string;
        };
        /** DashboardWeekOut */
        DashboardWeekOut: {
            /** Active Misconceptions */
            active_misconceptions: number;
            /** Changed Mind Rate */
            changed_mind_rate: number | null;
            /** Concepts With Misconceptions */
            concepts_with_misconceptions: number;
            /** Open Flags */
            open_flags: number;
            /** Sessions Completed */
            sessions_completed: number;
            /** Students */
            students: number;
            /**
             * Week End
             * Format: date-time
             */
            week_end: string;
            /**
             * Week Start
             * Format: date-time
             */
            week_start: string;
        };
        /** DraftCurriculumOut */
        DraftCurriculumOut: {
            /** Decree Code */
            decree_code: string | null;
            /** Effective On */
            effective_on: string | null;
            /** Is Current */
            is_current: boolean;
            /** Name */
            name: string;
            /** Subjects */
            subjects: components["schemas"]["ReferenceSubjectIn"][];
        };
        /** DraftRejectionOut */
        DraftRejectionOut: {
            /**
             * Kind
             * @enum {string}
             */
            kind: "element" | "statement";
            /** Page End */
            page_end: number;
            /** Page Start */
            page_start: number;
            /**
             * Reason
             * @enum {string}
             */
            reason: "not_in_source" | "outside_element" | "no_statements" | "limit" | "unnamed";
            /** Text */
            text: string;
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
        /** FlagAttentionOut */
        FlagAttentionOut: {
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Flag Id
             * Format: uuid
             */
            flag_id: string;
            /** Flag Type */
            flag_type: string;
            /**
             * Item Id
             * Format: uuid
             */
            item_id: string;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "flag";
            /**
             * Publication Id
             * Format: uuid
             */
            publication_id: string;
            /**
             * Session Id
             * Format: uuid
             */
            session_id: string;
            /** Severity */
            severity: string;
            /** Student Name */
            student_name: string;
        };
        /** FlagReviewIn */
        FlagReviewIn: {
            /**
             * Decision
             * @enum {string}
             */
            decision: "cleared" | "concern_confirmed";
            /** Note */
            note?: string | null;
        };
        /** FlagReviewOut */
        FlagReviewOut: {
            /**
             * Reviewed At
             * Format: date-time
             */
            reviewed_at: string;
            /** Status */
            status: string;
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
        /** HistoryScoreOut */
        HistoryScoreOut: {
            /** Dimension */
            dimension: string;
            /** Final Level */
            final_level: number;
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
            /** Suggestions */
            suggestions?: string[];
        };
        /** InvitationAdmissionOut */
        InvitationAdmissionOut: {
            /** Notification Id */
            notification_id: string | null;
            /** Queued */
            queued: boolean;
            /** Reason */
            reason: string;
            /**
             * User Id
             * Format: uuid
             */
            user_id: string;
        };
        /** InvitationPageOut */
        InvitationPageOut: {
            /** Counts */
            counts: {
                [key: string]: number;
            };
            /** Items */
            items: components["schemas"]["InvitationStatusOut"][];
            /** Next Cursor */
            next_cursor: string | null;
            /** Total */
            total: number;
        };
        /** InvitationRequestIn */
        InvitationRequestIn: {
            /**
             * Resend
             * @default false
             */
            resend: boolean;
            /** User Ids */
            user_ids: string[];
        };
        /** InvitationStatusOut */
        InvitationStatusOut: {
            /** Created At */
            created_at: string | null;
            /** Expires At */
            expires_at: string | null;
            /** Full Name */
            full_name: string;
            /** Notification Id */
            notification_id: string | null;
            /** Reason */
            reason: string | null;
            /** Role */
            role: string;
            /** Sent At */
            sent_at: string | null;
            /**
             * State
             * @enum {string}
             */
            state: "not_requested" | "requires_assistance" | "active" | "pending" | "sent" | "failed" | "expired" | "activated" | "superseded";
            /**
             * User Id
             * Format: uuid
             */
            user_id: string;
        };
        /** InvitationsQueuedOut */
        InvitationsQueuedOut: {
            /** Items */
            items: components["schemas"]["InvitationAdmissionOut"][];
            /** Notification Ids */
            notification_ids: string[];
            /** Queued */
            queued: number;
            /** Skipped */
            skipped: number;
        };
        ItemText: string;
        /** JobOut */
        JobOut: {
            /**
             * Entity Id
             * Format: uuid
             */
            entity_id: string;
            /** Entity Type */
            entity_type: string;
            /** Error Code */
            error_code: string | null;
            generation_result?: components["schemas"]["MissionGenerationResultOut"] | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Kind */
            kind: string;
            /** Status */
            status: string;
            /**
             * Updated At
             * Format: date-time
             */
            updated_at: string;
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
        /** KbDetailOut */
        KbDetailOut: {
            /** Can Edit */
            can_edit: boolean;
            /** Concepts */
            concepts: components["schemas"]["ConceptOut"][];
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Materials */
            materials: components["schemas"]["MaterialOut"][];
            /** Misconceptions */
            misconceptions: components["schemas"]["MisconceptionOut"][];
            /**
             * Owner Teacher Id
             * Format: uuid
             */
            owner_teacher_id: string;
            /** Prerequisites */
            prerequisites: components["schemas"]["PrerequisiteOut"][];
            /** Topic Title */
            topic_title: string;
        };
        /** KbOwnerIn */
        KbOwnerIn: {
            /**
             * Teacher Id
             * Format: uuid
             */
            teacher_id: string;
        };
        /** KbPageOut */
        KbPageOut: {
            /** Items */
            items: components["schemas"]["KbSummaryOut"][];
            /** Next Cursor */
            next_cursor: string | null;
        };
        /** KbReviewAttentionOut */
        KbReviewAttentionOut: {
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Item Id
             * Format: uuid
             */
            item_id: string;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "kb_review";
            /**
             * Knowledge Base Id
             * Format: uuid
             */
            knowledge_base_id: string;
            /** Pending Concepts */
            pending_concepts: number;
            /** Pending Misconceptions */
            pending_misconceptions: number;
            /** Topic Title */
            topic_title: string;
        };
        /** KbSummaryOut */
        KbSummaryOut: {
            /** Approved Concept Count */
            approved_concept_count: number;
            /** Built Section Count */
            built_section_count: number;
            /** Can Edit */
            can_edit: boolean;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Material Count */
            material_count: number;
            /** Owner Name */
            owner_name: string | null;
            /**
             * Owner Teacher Id
             * Format: uuid
             */
            owner_teacher_id: string;
            /** Pending Count */
            pending_count: number;
            /**
             * School Subject Id
             * Format: uuid
             */
            school_subject_id: string;
            /** Topic Key */
            topic_key: string;
            /** Topic Title */
            topic_title: string;
        };
        Label: string;
        /** LearningOutcomeIn */
        LearningOutcomeIn: {
            /** Description */
            description: string;
            element?: components["schemas"]["Name"] | null;
            /**
             * Ordinal
             * @default 0
             */
            ordinal: number;
        };
        /** LearningOutcomeOut */
        LearningOutcomeOut: {
            /** Description */
            description: string;
            /** Element */
            element: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Ordinal */
            ordinal: number;
        };
        /** LinkedPersonOut */
        LinkedPersonOut: {
            /** Full Name */
            full_name: string;
            /**
             * User Id
             * Format: uuid
             */
            user_id: string;
        };
        /** LiveWarmupIn */
        LiveWarmupIn: {
            /** Choices */
            choices: components["schemas"]["nalar__presentation__api__schemas__missions__WarmupChoiceIn"][];
            /** Prompt */
            prompt: string;
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
        /** MaterialFileOut */
        MaterialFileOut: {
            /** Expires In */
            expires_in: number;
            /** Url */
            url: string;
        };
        /** MaterialOut */
        MaterialOut: {
            /** Archived At */
            archived_at: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Page Count */
            page_count: number | null;
            /** Pages Without Text */
            pages_without_text: number[];
            /** Title */
            title: string;
        };
        /** MaterialQueuedOut */
        MaterialQueuedOut: {
            /**
             * Job Id
             * Format: uuid
             */
            job_id: string;
            /**
             * Knowledge Base Id
             * Format: uuid
             */
            knowledge_base_id: string;
            /**
             * Material Id
             * Format: uuid
             */
            material_id: string;
            /**
             * Status
             * @default queued
             */
            status: string;
        };
        /** MeOut */
        MeOut: {
            /** Email */
            email?: string | null;
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
            /**
             * Student Ids
             * @deprecated
             */
            student_ids: string[];
            /** Students */
            students: components["schemas"]["MisconceptionStudentOut"][];
        };
        /** MisconceptionCreateIn */
        MisconceptionCreateIn: {
            correct_understanding: components["schemas"]["ItemText"];
            /** Counter Examples */
            counter_examples?: components["schemas"]["ItemText"][];
            /** Detection Cues */
            detection_cues?: components["schemas"]["ItemText"][];
            /** Source Chunk Ids */
            source_chunk_ids?: string[];
            statement: components["schemas"]["ItemText"];
        };
        /** MisconceptionOut */
        MisconceptionOut: {
            /**
             * Concept Id
             * Format: uuid
             */
            concept_id: string;
            /** Correct Understanding */
            correct_understanding: string;
            /** Counter Examples */
            counter_examples: string[];
            /** Detection Cues */
            detection_cues: string[];
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Review Status */
            review_status: string;
            /** Source Chunk Ids */
            source_chunk_ids: string[];
            /** Sources */
            sources: components["schemas"]["PageSourceOut"][];
            /** Statement */
            statement: string;
        };
        /** MisconceptionPatchIn */
        MisconceptionPatchIn: {
            /** Correct Understanding */
            correct_understanding?: string | null;
            /** Counter Examples */
            counter_examples?: string[] | null;
            /** Detection Cues */
            detection_cues?: string[] | null;
            /** Statement */
            statement?: string | null;
        };
        /** MisconceptionStudentOut */
        MisconceptionStudentOut: {
            /** Name */
            name: string;
            /**
             * Session Id
             * Format: uuid
             */
            session_id: string;
            /**
             * Student Id
             * Format: uuid
             */
            student_id: string;
        };
        /** MissionCardOut */
        MissionCardOut: {
            /** Attempt Number */
            attempt_number: number;
            /** Attempt Status */
            attempt_status: string;
            /** Closes At */
            closes_at: string | null;
            /** Is Granted Attempt */
            is_granted_attempt: boolean;
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
            /**
             * Run Id
             * Format: uuid
             */
            run_id: string;
            /** Run Status */
            run_status: string;
            /** Session Id */
            session_id: string | null;
            /** Subject Name */
            subject_name: string;
            /**
             * Target Duration Minutes
             * @default 15
             */
            target_duration_minutes: number;
        };
        /** MissionCreatedOut */
        MissionCreatedOut: {
            /**
             * Mission Id
             * Format: uuid
             */
            mission_id: string;
        };
        /** MissionGenerationQueuedOut */
        MissionGenerationQueuedOut: {
            /**
             * Job Id
             * Format: uuid
             */
            job_id: string;
            /**
             * Status
             * @default queued
             */
            status: string;
        };
        /** MissionGenerationResultOut */
        MissionGenerationResultOut: {
            /** Ungrounded Concept Ids */
            ungrounded_concept_ids: string[];
            /**
             * Version Id
             * Format: uuid
             */
            version_id: string;
            /** Version Number */
            version_number: number;
        };
        /** MissionIn */
        MissionIn: {
            /**
             * Knowledge Base Id
             * Format: uuid
             */
            knowledge_base_id: string;
            /** Learning Objective */
            learning_objective: string;
            /** Title */
            title: string;
        };
        /** MissionPageOut */
        MissionPageOut: {
            /** Items */
            items: components["schemas"]["MissionSummaryOut"][];
            /** Next Cursor */
            next_cursor: string | null;
        };
        /** MissionSummaryOut */
        MissionSummaryOut: {
            /** Can Edit */
            can_edit: boolean;
            /**
             * Created By
             * Format: uuid
             */
            created_by: string;
            /** Created By Name */
            created_by_name: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Knowledge Base Id
             * Format: uuid
             */
            knowledge_base_id: string;
            latest_version: components["schemas"]["VersionSummaryOut"] | null;
            /** Title */
            title: string;
        };
        /** MonitorOut */
        MonitorOut: {
            run: components["schemas"]["MonitorRunOut"];
            /**
             * Server Now
             * Format: date-time
             */
            server_now: string;
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
            /** Participant Id */
            participant_id: string | null;
            /** Safety Paused */
            safety_paused: boolean;
            /** Session Id */
            session_id: string | null;
            /** Status */
            status: string;
            /**
             * Student Id
             * Format: uuid
             */
            student_id: string;
        };
        Name: string;
        /** NotificationOut */
        NotificationOut: {
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Read At */
            read_at: string | null;
            /** Type */
            type: string;
        };
        /** NotificationsOut */
        NotificationsOut: {
            /** Items */
            items: components["schemas"]["NotificationOut"][];
            /** Next Cursor */
            next_cursor: string | null;
            /** Unread Count */
            unread_count: number;
        };
        /** OpeningGuessOut */
        OpeningGuessOut: {
            /** Choice Id */
            choice_id: string;
            /** Text */
            text: string;
        };
        /** OverrideIn */
        OverrideIn: {
            /** Final Level */
            final_level: number;
            /** Reason */
            reason: string;
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
        /** OverrideResultOut */
        OverrideResultOut: {
            /** Ai Level */
            ai_level: number;
            /** Final Level */
            final_level: number;
            /**
             * Overridden At
             * Format: date-time
             */
            overridden_at: string;
            /**
             * Score Id
             * Format: uuid
             */
            score_id: string;
        };
        /** PageSourceOut */
        PageSourceOut: {
            /** Page End */
            page_end: number;
            /** Page Start */
            page_start: number;
        };
        /** ParentChildOut */
        ParentChildOut: {
            /** Class Name */
            class_name?: string | null;
            /** Last Seen At */
            last_seen_at?: string | null;
            /** Name */
            name: string;
            /** School Id */
            school_id?: string | null;
            /** School Name */
            school_name: string;
            /**
             * Student Id
             * Format: uuid
             */
            student_id: string;
        };
        /** ParentChildrenOut */
        ParentChildrenOut: {
            /** Items */
            items: components["schemas"]["ParentChildOut"][];
            /** Next Cursor */
            next_cursor: string | null;
        };
        /** ParentLinkIn */
        ParentLinkIn: {
            /** Relationship */
            relationship?: ("ayah" | "ibu" | "wali") | null;
        };
        /** ParentPreferencesIn */
        ParentPreferencesIn: {
            /** Weekly Digest Enabled */
            weekly_digest_enabled: boolean;
        };
        /** ParentPreferencesOut */
        ParentPreferencesOut: {
            /** Weekly Digest Enabled */
            weekly_digest_enabled: boolean;
        };
        /** ParentProgressOut */
        ParentProgressOut: {
            /** Concepts Developing */
            concepts_developing: string[];
            /** Concepts Understood */
            concepts_understood: string[];
            /** Sessions Completed */
            sessions_completed: number;
            /** Summaries */
            summaries: components["schemas"]["ParentSummaryOut"][];
        };
        /** ParentReflectionOut */
        ParentReflectionOut: {
            /**
             * Completed At
             * Format: date-time
             */
            completed_at: string;
            /** Content */
            content: string;
            /** Mission Title */
            mission_title: string;
            /**
             * Session Id
             * Format: uuid
             */
            session_id: string;
            /**
             * Subject Name
             * @default
             */
            subject_name: string;
        };
        /** ParentReflectionsOut */
        ParentReflectionsOut: {
            /** Items */
            items: components["schemas"]["ParentReflectionOut"][];
            /** Next Cursor */
            next_cursor: string | null;
        };
        /** ParentSummaryOut */
        ParentSummaryOut: {
            /** Mission Title */
            mission_title: string;
            /**
             * Publication Id
             * Format: uuid
             */
            publication_id: string;
            /**
             * Released At
             * Format: date-time
             */
            released_at: string;
            /** Text */
            text: string;
        };
        /** PasswordChangeIn */
        PasswordChangeIn: {
            /**
             * Current Password
             * Format: password
             */
            current_password: string;
            /**
             * New Password
             * Format: password
             */
            new_password: string;
        };
        /** PasswordResetConfirmIn */
        PasswordResetConfirmIn: {
            /**
             * Password
             * Format: password
             */
            password: string;
            /**
             * Reset Id
             * Format: uuid
             */
            reset_id: string;
            /**
             * Token Hash
             * Format: password
             */
            token_hash: string;
        };
        /** PasswordResetIn */
        PasswordResetIn: {
            /** Email */
            email: string;
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
        /** PeoplePageOut */
        PeoplePageOut: {
            /** Items */
            items: components["schemas"]["PersonOut"][];
            /** Next Cursor */
            next_cursor: string | null;
            /** Total */
            total: number;
        };
        /** PersonCreateIn */
        PersonCreateIn: {
            /** Child Ids */
            child_ids?: string[];
            /** Class Id */
            class_id?: string | null;
            /** Email */
            email?: string | null;
            full_name: components["schemas"]["Name"];
            /**
             * Invite
             * @default false
             */
            invite: boolean;
            /** Nisn */
            nisn?: string | null;
            /** Relationship */
            relationship?: ("ayah" | "ibu" | "wali") | null;
            /**
             * Role
             * @enum {string}
             */
            role: "teacher" | "student" | "parent";
        };
        /** PersonCreatedOut */
        PersonCreatedOut: {
            /**
             * User Id
             * Format: uuid
             */
            user_id: string;
        };
        /** PersonEditIn */
        PersonEditIn: {
            /** Class Id */
            class_id?: string | null;
            full_name?: components["schemas"]["Name"] | null;
        };
        /** PersonOut */
        PersonOut: {
            /**
             * Account State
             * @enum {string}
             */
            account_state: "active" | "inactive" | "pending_activation";
            /** Class Name */
            class_name: string | null;
            /** Email */
            email: string | null;
            /** Full Name */
            full_name: string;
            /** Linked Children */
            linked_children: components["schemas"]["LinkedPersonOut"][];
            /** Linked Parents */
            linked_parents: components["schemas"]["LinkedPersonOut"][];
            /** Nisn */
            nisn: string | null;
            role: components["schemas"]["Role"];
            /** Roles */
            roles: components["schemas"]["Role"][];
            /**
             * User Id
             * Format: uuid
             */
            user_id: string;
        };
        /** PrerequisiteOut */
        PrerequisiteOut: {
            /**
             * Concept Id
             * Format: uuid
             */
            concept_id: string;
            /**
             * Prerequisite Concept Id
             * Format: uuid
             */
            prerequisite_concept_id: string;
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
        /** PublicationDetailOut */
        PublicationDetailOut: {
            /** Cancelled At */
            cancelled_at: string | null;
            /**
             * Class Id
             * Format: uuid
             */
            class_id: string;
            /** Class Name */
            class_name: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /**
             * Knowledge Base Id
             * Format: uuid
             */
            knowledge_base_id: string;
            /**
             * Mission Id
             * Format: uuid
             */
            mission_id: string;
            /** Mission Title */
            mission_title: string;
            /**
             * Mission Version Id
             * Format: uuid
             */
            mission_version_id: string;
            /**
             * Published By
             * Format: uuid
             */
            published_by: string;
            /** Released To Parents At */
            released_to_parents_at: string | null;
            /** Runs */
            runs: components["schemas"]["PublicationRunDetailOut"][];
            /**
             * School Id
             * Format: uuid
             */
            school_id: string;
            /** Version Number */
            version_number: number;
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
            /** Mission Id */
            mission_id?: string | null;
            /** Mission Title */
            mission_title: string;
            /** Mission Version */
            mission_version?: number | null;
            /** Released To Parents At */
            released_to_parents_at: string | null;
            run: components["schemas"]["RunSummaryOut"];
            /**
             * Subject Name
             * @default
             */
            subject_name: string;
        };
        /** PublicationRunDetailOut */
        PublicationRunDetailOut: {
            /** Closes At */
            closes_at: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Join Code */
            join_code: string | null;
            /**
             * Kind
             * @enum {string}
             */
            kind: "primary" | "grant";
            /**
             * Mode
             * @enum {string}
             */
            mode: "live" | "window";
            /** Opens At */
            opens_at: string | null;
            /** Status */
            status: string;
        };
        /** PublicationWindowIn */
        PublicationWindowIn: {
            /**
             * Closes At
             * Format: date-time
             */
            closes_at: string;
            /**
             * Opens At
             * Format: date-time
             */
            opens_at: string;
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
        /** ReferenceAiDraftOut */
        ReferenceAiDraftOut: {
            curriculum: components["schemas"]["DraftCurriculumOut"];
            /** Selected Pages */
            selected_pages: number[];
        };
        /** ReferenceCurriculumIn */
        ReferenceCurriculumIn: {
            decree_code: components["schemas"]["Label"];
            /**
             * Effective On
             * Format: date
             */
            effective_on: string;
            /**
             * Is Current
             * @default true
             */
            is_current: boolean;
            name: components["schemas"]["Label"];
            /** Subjects */
            subjects: components["schemas"]["ReferenceSubjectIn"][];
        };
        /** ReferenceDetailOut */
        ReferenceDetailOut: {
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Curriculum Version Id */
            curriculum_version_id: string | null;
            draft: components["schemas"]["ReferenceAiDraftOut"] | null;
            /** Draft Error */
            draft_error: string | null;
            draft_report: components["schemas"]["ReferenceDraftReportOut"] | null;
            /** Draft Status */
            draft_status: ("pending" | "ready" | "failed" | "skipped") | null;
            /** Error Code */
            error_code: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Issuer */
            issuer: string;
            /** Job Id */
            job_id: string | null;
            /**
             * Kind
             * @enum {string}
             */
            kind: "curriculum" | "guidance";
            /** Pages */
            pages: components["schemas"]["ReferencePageOut"][];
            /** Published At */
            published_at: string | null;
            review: components["schemas"]["ReferenceReviewDraft"] | null;
            /** Revision */
            revision: number;
            /** Sha256 */
            sha256: string;
            /** Source Url */
            source_url: string;
            /**
             * Status
             * @enum {string}
             */
            status: "uploading" | "extracting" | "review" | "indexing" | "published" | "failed";
            /** Title */
            title: string;
        };
        /** ReferenceDraftQueuedOut */
        ReferenceDraftQueuedOut: {
            /**
             * Document Id
             * Format: uuid
             */
            document_id: string;
            /**
             * Job Id
             * Format: uuid
             */
            job_id: string;
        };
        /** ReferenceDraftReportOut */
        ReferenceDraftReportOut: {
            /** Accepted Statements */
            accepted_statements: number;
            /** Pages Considered */
            pages_considered: number;
            /** Rejected */
            rejected: components["schemas"]["DraftRejectionOut"][];
            /** Windows */
            windows: number;
        };
        /** ReferencePageOut */
        ReferencePageOut: {
            /** Page Number */
            page_number: number;
            /** Text */
            text: string;
        };
        /** ReferenceQueuedOut */
        ReferenceQueuedOut: {
            /**
             * Document Id
             * Format: uuid
             */
            document_id: string;
            /**
             * Job Id
             * Format: uuid
             */
            job_id: string;
            /**
             * Status
             * @enum {string}
             */
            status: "extracting" | "indexing";
        };
        /** ReferenceReviewDraft */
        ReferenceReviewDraft: {
            curriculum?: components["schemas"]["ReferenceCurriculumIn"] | null;
            /** Selected Pages */
            selected_pages?: number[];
        };
        /** ReferenceReviewIn */
        ReferenceReviewIn: {
            /** Base Revision */
            base_revision: number;
            curriculum?: components["schemas"]["ReferenceCurriculumIn"] | null;
            /** Selected Pages */
            selected_pages?: number[];
        };
        /** ReferenceRevisionIn */
        ReferenceRevisionIn: {
            /** Base Revision */
            base_revision: number;
        };
        /** ReferenceRevisionOut */
        ReferenceRevisionOut: {
            /** Revision */
            revision: number;
        };
        /** ReferenceSubjectIn */
        ReferenceSubjectIn: {
            /** Elements */
            elements: components["schemas"]["SourceElementIn"][];
            name: components["schemas"]["Label"];
            /**
             * Phase
             * @enum {string}
             */
            phase: "A" | "B" | "C" | "D" | "E" | "F";
        };
        /** ReferenceSummaryOut */
        ReferenceSummaryOut: {
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Curriculum Version Id */
            curriculum_version_id: string | null;
            /** Error Code */
            error_code: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Issuer */
            issuer: string;
            /** Job Id */
            job_id: string | null;
            /**
             * Kind
             * @enum {string}
             */
            kind: "curriculum" | "guidance";
            /** Published At */
            published_at: string | null;
            /** Revision */
            revision: number;
            /** Sha256 */
            sha256: string;
            /** Source Url */
            source_url: string;
            /**
             * Status
             * @enum {string}
             */
            status: "uploading" | "extracting" | "review" | "indexing" | "published" | "failed";
            /** Title */
            title: string;
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
            /**
             * Subject Name
             * @default
             */
            subject_name: string;
        };
        /** ReleaseIn */
        ReleaseIn: {
            /** Expected Eligible Count */
            expected_eligible_count: number;
        };
        /** ReleasePreviewOut */
        ReleasePreviewOut: {
            /** Blockers */
            blockers: components["schemas"]["BlockerOut"][];
            /** Eligible Count */
            eligible_count: number;
            /** Ineligible Count */
            ineligible_count: number;
            /** Ready */
            ready: boolean;
            /** Released At */
            released_at: string | null;
            /** Summaries */
            summaries: components["schemas"]["SummaryPreviewOut"][];
        };
        /** ReleaseReadyAttentionOut */
        ReleaseReadyAttentionOut: {
            /** Class Name */
            class_name: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Eligible Count */
            eligible_count: number;
            /**
             * Item Id
             * Format: uuid
             */
            item_id: string;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "release_ready";
            /** Mission Title */
            mission_title: string;
            /**
             * Publication Id
             * Format: uuid
             */
            publication_id: string;
        };
        /** ReleasedOut */
        ReleasedOut: {
            /**
             * Released To Parents At
             * Format: date-time
             */
            released_to_parents_at: string;
            /** Summary Count */
            summary_count: number;
        };
        /** ReportActivityOut */
        ReportActivityOut: {
            /** Away Seconds */
            away_seconds: number;
            /** Paste Chars */
            paste_chars: number;
            /** Typing Ms */
            typing_ms: number;
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
        /** ReportMissionOut */
        ReportMissionOut: {
            /**
             * Mission Id
             * Format: uuid
             */
            mission_id: string;
            /** Title */
            title: string;
            /** Version Number */
            version_number: number;
        };
        /** ReportOut */
        ReportOut: {
            /** Concept Results */
            concept_results: components["schemas"]["ReportConceptResultOut"][];
            evaluation: components["schemas"]["ReportEvaluationOut"] | null;
            /** Flags */
            flags: components["schemas"]["ReportFlagOut"][];
            mission: components["schemas"]["ReportMissionOut"];
            rubric: components["schemas"]["ReportRubricOut"];
            /** Scores */
            scores: components["schemas"]["ReportScoreOut"][];
            session: components["schemas"]["ReportSessionOut"];
            student: components["schemas"]["ReportStudentOut"];
            /** Turns */
            turns: components["schemas"]["ReportTurnOut"][];
        };
        /** ReportRubricOut */
        ReportRubricOut: {
            /** Claim */
            claim: string[];
            /** Evidence */
            evidence: string[];
            /** Mechanism */
            mechanism: string[];
            /** Transfer */
            transfer: string[];
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
            activity: components["schemas"]["ReportActivityOut"];
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
        /** ReviewIn */
        ReviewIn: {
            /**
             * Review Status
             * @enum {string}
             */
            review_status: "approved" | "rejected";
        };
        /** ReviewOut */
        ReviewOut: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Review Status */
            review_status: string;
            /**
             * Reviewed At
             * Format: date-time
             */
            reviewed_at: string;
        };
        /** ReviewQueueOut */
        ReviewQueueOut: {
            /**
             * Knowledge Base Id
             * Format: uuid
             */
            knowledge_base_id: string;
            /** Pending Concepts */
            pending_concepts: number;
            /** Pending Misconceptions */
            pending_misconceptions: number;
        };
        /** @enum {string} */
        Role: "school_admin" | "teacher" | "student" | "parent";
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
        /** RosterImportOut */
        RosterImportOut: {
            /** Errors */
            errors: components["schemas"]["RowErrorOut"][];
            /** Rows Failed */
            rows_failed: number | null;
            /** Rows Succeeded */
            rows_succeeded: number | null;
            /** Rows Total */
            rows_total: number | null;
            /** Status */
            status: string;
        };
        /** RosterImportSummaryOut */
        RosterImportSummaryOut: {
            /**
             * Academic Year Id
             * Format: uuid
             */
            academic_year_id: string;
            /** Completed At */
            completed_at: string | null;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Import Id
             * Format: uuid
             */
            import_id: string;
            /** Rows Failed */
            rows_failed: number | null;
            /** Rows Succeeded */
            rows_succeeded: number | null;
            /** Rows Total */
            rows_total: number | null;
            /** Status */
            status: string;
        };
        /** RosterImportsPageOut */
        RosterImportsPageOut: {
            /** Items */
            items: components["schemas"]["RosterImportSummaryOut"][];
            /** Next Cursor */
            next_cursor: string | null;
            /** Total */
            total: number;
        };
        /** RosterQueuedOut */
        RosterQueuedOut: {
            /**
             * Import Id
             * Format: uuid
             */
            import_id: string;
            /**
             * Job Id
             * Format: uuid
             */
            job_id: string;
            /**
             * Status
             * @default pending
             */
            status: string;
        };
        /** RowErrorOut */
        RowErrorOut: {
            /** Field */
            field: string;
            /** Message */
            message: string;
            /** Row Number */
            row_number: number;
        };
        /** RubricIn */
        RubricIn: {
            /** Claim */
            claim: string[];
            /** Evidence */
            evidence: string[];
            /** Mechanism */
            mechanism: string[];
            /** Transfer */
            transfer: string[];
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
        /** SafetyAttentionOut */
        SafetyAttentionOut: {
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /**
             * Item Id
             * Format: uuid
             */
            item_id: string;
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            kind: "safety";
            /** Paused At */
            paused_at: string | null;
            /**
             * Publication Id
             * Format: uuid
             */
            publication_id: string;
            /**
             * Session Id
             * Format: uuid
             */
            session_id: string;
            /** Student Name */
            student_name: string;
        };
        /** SchoolAdminOut */
        SchoolAdminOut: {
            /** Pending Activation */
            pending_activation: boolean;
            /**
             * User Id
             * Format: uuid
             */
            user_id: string;
        };
        /** SchoolAssignmentOut */
        SchoolAssignmentOut: {
            /**
             * Academic Year Id
             * Format: uuid
             */
            academic_year_id: string;
            /**
             * Class Id
             * Format: uuid
             */
            class_id: string;
            /** Class Name */
            class_name: string;
            /**
             * School Subject Id
             * Format: uuid
             */
            school_subject_id: string;
            /** Subject Name */
            subject_name: string;
            /** Teacher Id */
            teacher_id: string | null;
            /** Teacher Name */
            teacher_name: string;
        };
        /** SchoolCpSubjectOut */
        SchoolCpSubjectOut: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Learning Outcomes */
            learning_outcomes: components["schemas"]["LearningOutcomeOut"][];
            /** Name */
            name: string;
            /** Phase */
            phase: string;
            /**
             * Version Id
             * Format: uuid
             */
            version_id: string;
        };
        /** SchoolCreatedOut */
        SchoolCreatedOut: {
            /** Pending Activation */
            pending_activation: boolean;
            /**
             * School Id
             * Format: uuid
             */
            school_id: string;
        };
        /** SchoolCurriculumVersionOut */
        SchoolCurriculumVersionOut: {
            /** Decree Code */
            decree_code: string;
            /**
             * Effective On
             * Format: date
             */
            effective_on: string;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Is Current */
            is_current: boolean;
            /** Name */
            name: string;
            /** Published At */
            published_at: string | null;
            /** Subjects */
            subjects: components["schemas"]["CurriculumSubjectChoiceOut"][];
        };
        /** SchoolIn */
        SchoolIn: {
            /** Admin Email */
            admin_email: string;
            city: components["schemas"]["Name"];
            name: components["schemas"]["Name"];
            /** Npsn */
            npsn: string;
        };
        /** SchoolOut */
        SchoolOut: {
            /** Admin Name */
            admin_name: string | null;
            /** City */
            city: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Name */
            name: string;
            /** Npsn */
            npsn: string | null;
            /**
             * Status
             * @enum {string}
             */
            status: "active" | "suspended";
            /** User Count */
            user_count: number;
        };
        /** SchoolPatchIn */
        SchoolPatchIn: {
            /** City */
            city?: string | null;
            /** Name */
            name?: string | null;
            /** Npsn */
            npsn?: string | null;
        };
        /** SchoolStatusIn */
        SchoolStatusIn: {
            /**
             * Status
             * @enum {string}
             */
            status: "active" | "suspended";
        };
        /** SchoolsPageOut */
        SchoolsPageOut: {
            /** Counts */
            counts: {
                [key: string]: number;
            };
            /** Items */
            items: components["schemas"]["SchoolOut"][];
            /** Next Cursor */
            next_cursor: string | null;
            /** Total */
            total: number;
        };
        /** SectionItemOut */
        SectionItemOut: {
            /** Build Status */
            build_status: string;
            /** Built At */
            built_at: string | null;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Level */
            level: number;
            /**
             * Material Id
             * Format: uuid
             */
            material_id: string;
            /** Ordinal */
            ordinal: number;
            /** Page End */
            page_end: number;
            /** Page Start */
            page_start: number;
            /** Parent Section Id */
            parent_section_id: string | null;
            /** Suggested */
            suggested: boolean;
            /** Title */
            title: string;
        };
        /** SectionsOut */
        SectionsOut: {
            /** Items */
            items: components["schemas"]["SectionItemOut"][];
        };
        /** SessionOut */
        SessionOut: {
            /** Expires At */
            expires_at: number;
            /**
             * User Id
             * Format: uuid
             */
            user_id: string;
        };
        /** SourceElementIn */
        SourceElementIn: {
            description: components["schemas"]["Text"];
            element: components["schemas"]["Label"];
            /** Page End */
            page_end: number;
            /** Page Start */
            page_start: number;
            /** Statements */
            statements: components["schemas"]["SourceStatementIn"][];
        };
        /** SourceStatementIn */
        SourceStatementIn: {
            description: components["schemas"]["Text"];
            /** Page End */
            page_end: number;
            /** Page Start */
            page_start: number;
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
             * Server Now
             * Format: date-time
             */
            server_now: string;
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
        /** StudentConceptCountsOut */
        StudentConceptCountsOut: {
            /** Developing */
            developing: number;
            /** Mastered */
            mastered: number;
            /** Misconception */
            misconception: number;
        };
        /** StudentHistoryItemOut */
        StudentHistoryItemOut: {
            /**
             * Academic Year Id
             * Format: uuid
             */
            academic_year_id: string;
            /** Academic Year Name */
            academic_year_name: string;
            /** Attempt Number */
            attempt_number: number;
            /** Class Name */
            class_name: string;
            /** Ended At */
            ended_at: string | null;
            /** Evaluation Status */
            evaluation_status: string | null;
            /** Mission Title */
            mission_title: string;
            /**
             * Publication Id
             * Format: uuid
             */
            publication_id: string;
            /** Scores */
            scores: components["schemas"]["HistoryScoreOut"][];
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
            /** Subject Name */
            subject_name: string;
        };
        /** StudentHistoryOut */
        StudentHistoryOut: {
            /** Items */
            items: components["schemas"]["StudentHistoryItemOut"][];
            /** Next Cursor */
            next_cursor: string | null;
        };
        /** StudentLobbyOut */
        StudentLobbyOut: {
            /** Deadline At */
            deadline_at: string | null;
            /** Participant Status */
            participant_status: string;
            /** Run Status */
            run_status: string;
            /**
             * Server Now
             * Format: date-time
             */
            server_now: string;
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
        /** StudentPlacementIn */
        StudentPlacementIn: {
            /** User Ids */
            user_ids: string[];
        };
        /** StudentReflectionOut */
        StudentReflectionOut: {
            /**
             * Completed At
             * Format: date-time
             */
            completed_at: string;
            /** Content */
            content: string;
            /** Mission Title */
            mission_title: string;
            /**
             * Session Id
             * Format: uuid
             */
            session_id: string;
            /**
             * Subject Name
             * @default
             */
            subject_name: string;
        };
        /** StudentReflectionsOut */
        StudentReflectionsOut: {
            /** Items */
            items: components["schemas"]["StudentReflectionOut"][];
            /** Next Cursor */
            next_cursor: string | null;
        };
        /** SubjectCreateIn */
        SubjectCreateIn: {
            /** Cp Subject Id */
            cp_subject_id?: string | null;
            /**
             * Cp Version Id
             * Format: uuid
             */
            cp_version_id: string;
            /** Name */
            name: string;
        };
        /** SubjectCreatedOut */
        SubjectCreatedOut: {
            /**
             * School Subject Id
             * Format: uuid
             */
            school_subject_id: string;
        };
        /** SubjectKnowledgeBaseOut */
        SubjectKnowledgeBaseOut: {
            /**
             * Knowledge Base Id
             * Format: uuid
             */
            knowledge_base_id: string;
            /** Owner Name */
            owner_name: string | null;
            /**
             * Owner Teacher Id
             * Format: uuid
             */
            owner_teacher_id: string;
            /** Status */
            status: string;
            /** Topic Title */
            topic_title: string;
        };
        /** SubjectOut */
        SubjectOut: {
            /** Cp Subject Id */
            cp_subject_id: string | null;
            /** Cp Version Id */
            cp_version_id: string | null;
            /** Kb Owner Name */
            kb_owner_name: string | null;
            /** Knowledge Bases */
            knowledge_bases: components["schemas"]["SubjectKnowledgeBaseOut"][];
            /** Name */
            name: string;
            /**
             * School Subject Id
             * Format: uuid
             */
            school_subject_id: string;
        };
        /** SummaryPreviewOut */
        SummaryPreviewOut: {
            /** Name */
            name: string;
            /**
             * Student Id
             * Format: uuid
             */
            student_id: string;
            /** Summary Text */
            summary_text: string;
        };
        /** TeacherDashboardOut */
        TeacherDashboardOut: {
            /**
             * As Of
             * Format: date-time
             */
            as_of: string;
            last_week: components["schemas"]["DashboardWeekOut"];
            this_week: components["schemas"]["DashboardWeekOut"];
            /** Timezone */
            timezone: string;
            /** Top Changed */
            top_changed: components["schemas"]["ChangedMisconceptionOut"][];
            /** Trend */
            trend: components["schemas"]["DashboardTrendOut"][];
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
        Text: string;
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
        /** VersionCreatedOut */
        VersionCreatedOut: {
            /**
             * Status
             * @default draft
             */
            status: string;
            /**
             * Version Id
             * Format: uuid
             */
            version_id: string;
            /** Version Number */
            version_number: number;
        };
        /** VersionHistoryOut */
        VersionHistoryOut: {
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
            /** Created By Name */
            created_by_name: string | null;
            /** Locked At */
            locked_at: string | null;
            /** Reviewed At */
            reviewed_at: string | null;
            /** Status */
            status: string;
            /** Version Number */
            version_number: number;
        };
        /** VersionIn */
        VersionIn: {
            /** Anchor Problem */
            anchor_problem: string;
            /** Answer Terms */
            answer_terms: string[];
            /** Base Version Id */
            base_version_id?: string | null;
            live_warmup?: components["schemas"]["LiveWarmupIn"] | null;
            /**
             * Max Duration Minutes
             * @default 20
             */
            max_duration_minutes: number;
            /** Max Turns */
            max_turns: number;
            /** Misconception Ids */
            misconception_ids?: string[];
            /** Question Bank */
            question_bank: components["schemas"]["BankQuestionIn"][];
            /** Reference Reasoning */
            reference_reasoning: string;
            rubric: components["schemas"]["RubricIn"];
            /** Source Chunk Ids */
            source_chunk_ids?: string[];
            /** Target Concept Ids */
            target_concept_ids: string[];
        };
        /** VersionOut */
        VersionOut: {
            /** Anchor Problem */
            anchor_problem: string;
            /** Answer Terms */
            answer_terms: string[];
            /** Can Edit */
            can_edit: boolean;
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Live Warmup */
            live_warmup: {
                [key: string]: unknown;
            } | null;
            /** Max Duration Minutes */
            max_duration_minutes: number;
            /** Max Turns */
            max_turns: number;
            /** Misconception Ids */
            misconception_ids: string[];
            /** Question Bank */
            question_bank: {
                [key: string]: unknown;
            }[];
            /** Reference Reasoning */
            reference_reasoning: string;
            /** Rubric */
            rubric: {
                [key: string]: string[];
            };
            /** Source Chunk Ids */
            source_chunk_ids: string[];
            /** Status */
            status: string;
            /** Target Concept Ids */
            target_concept_ids: string[];
            /** Version Number */
            version_number: number;
        };
        /** VersionReviewedOut */
        VersionReviewedOut: {
            /**
             * Reviewed At
             * Format: date-time
             */
            reviewed_at: string;
            /**
             * Status
             * @default reviewed
             */
            status: string;
            /**
             * Version Id
             * Format: uuid
             */
            version_id: string;
        };
        /** VersionSummaryOut */
        VersionSummaryOut: {
            /**
             * Id
             * Format: uuid
             */
            id: string;
            /** Status */
            status: string;
            /** Version Number */
            version_number: number;
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
        /** WindowStartIn */
        WindowStartIn: {
            /** Run Id */
            run_id?: string | null;
        };
        /** WarmupChoiceIn */
        nalar__presentation__api__schemas__missions__WarmupChoiceIn: {
            /** Id */
            id: string;
            /** Text */
            text: string;
        };
        /** WarmupChoiceIn */
        nalar__presentation__api__schemas__student__WarmupChoiceIn: {
            /** Choice Id */
            choice_id: string;
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
    activate_api_v1_auth_activate_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ActivateIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            204: {
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
    change_password_api_v1_auth_password_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PasswordChangeIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            204: {
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
    request_password_reset_api_v1_auth_password_reset_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PasswordResetIn"];
            };
        };
        responses: {
            /** @description Successful Response */
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
    confirm_password_reset_api_v1_auth_password_reset_confirm_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PasswordResetConfirmIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            204: {
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
    session_api_v1_auth_refresh_post: {
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
                    "application/json": components["schemas"]["SessionOut"];
                };
            };
        };
    };
    session_api_v1_auth_session_get: {
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
                    "application/json": components["schemas"]["SessionOut"];
                };
            };
        };
    };
    client_events_api_v1_client_events_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ClientEventsIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClientEventsOut"];
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
    patch_concept_api_v1_concepts__item_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConceptPatchIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConceptOut"];
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
    review_concept_api_v1_concepts__item_id__review_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReviewIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReviewOut"];
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
    config_api_v1_config_get: {
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
                    "application/json": components["schemas"]["ConfigOut"];
                };
            };
        };
    };
    review_flag_api_v1_flags__flag_id__review_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                flag_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FlagReviewIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FlagReviewOut"];
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
    get_job_api_v1_jobs__job_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                job_id: string;
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
                    "application/json": components["schemas"]["JobOut"];
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
    get_kb_api_v1_knowledge_bases__kb_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                kb_id: string;
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
                    "application/json": components["schemas"]["KbDetailOut"];
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
    archive_kb_api_v1_knowledge_bases__kb_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                kb_id: string;
            };
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
    archive_kb_api_v1_knowledge_bases__kb_id__archive_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                kb_id: string;
            };
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
    create_concept_api_v1_knowledge_bases__kb_id__concepts_post: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                kb_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConceptCreateIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ConceptOut"];
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
    archive_concept_api_v1_knowledge_bases__kb_id__concepts__concept_id__archive_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                kb_id: string;
                concept_id: string;
            };
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
    create_misconception_api_v1_knowledge_bases__kb_id__concepts__concept_id__misconceptions_post: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                kb_id: string;
                concept_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MisconceptionCreateIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MisconceptionOut"];
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
    add_material_api_v1_knowledge_bases__kb_id__materials_post: {
        parameters: {
            query?: never;
            header?: {
                "Idempotency-Key"?: string | null;
            };
            path: {
                kb_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["Body_add_material_api_v1_knowledge_bases__kb_id__materials_post"];
            };
        };
        responses: {
            /** @description Successful Response */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MaterialQueuedOut"];
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
    delete_material_api_v1_knowledge_bases__kb_id__materials__material_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                kb_id: string;
                material_id: string;
            };
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
    material_file_api_v1_knowledge_bases__kb_id__materials__material_id__file_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                kb_id: string;
                material_id: string;
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
                    "application/json": components["schemas"]["MaterialFileOut"];
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
    adopt_api_v1_knowledge_bases__kb_id__national_references__document_id__post: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                kb_id: string;
                document_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MaterialQueuedOut"];
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
    transfer_kb_api_v1_knowledge_bases__kb_id__owner_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                kb_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["KbOwnerIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            204: {
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
    review_queue_api_v1_knowledge_bases__kb_id__review_queue_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                kb_id: string;
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
                    "application/json": components["schemas"]["ReviewQueueOut"];
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
    list_sections_api_v1_knowledge_bases__kb_id__sections_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                kb_id: string;
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
                    "application/json": components["schemas"]["SectionsOut"];
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
    build_section_api_v1_knowledge_bases__kb_id__sections__section_id__build_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                kb_id: string;
                section_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["BuildQueuedOut"];
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
    patch_misconception_api_v1_misconceptions__item_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MisconceptionPatchIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MisconceptionOut"];
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
    review_misconception_api_v1_misconceptions__item_id__review_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                item_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReviewIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReviewOut"];
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
    create_mission_api_v1_missions_post: {
        parameters: {
            query?: never;
            header?: {
                "Idempotency-Key"?: string | null;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MissionIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MissionCreatedOut"];
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
    archive_mission_api_v1_missions__mission_id__archive_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                mission_id: string;
            };
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
    generate_mission_api_v1_missions__mission_id__generate_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                mission_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MissionGenerationQueuedOut"];
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
    list_versions_api_v1_missions__mission_id__versions_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                mission_id: string;
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
                    "application/json": components["schemas"]["VersionHistoryOut"][];
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
    create_version_api_v1_missions__mission_id__versions_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                mission_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["VersionIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VersionCreatedOut"];
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
    get_version_api_v1_missions__mission_id__versions__number__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                mission_id: string;
                number: number;
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
                    "application/json": components["schemas"]["VersionOut"];
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
    review_version_api_v1_missions__mission_id__versions__number__review_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                mission_id: string;
                number: number;
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
                    "application/json": components["schemas"]["VersionReviewedOut"];
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
    notifications_api_v1_notifications_get: {
        parameters: {
            query?: {
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
                    "application/json": components["schemas"]["NotificationsOut"];
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
    read_notification_api_v1_notifications__notification_id__read_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                notification_id: string;
            };
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
    children_api_v1_parent_children_get: {
        parameters: {
            query?: {
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
                    "application/json": components["schemas"]["ParentChildrenOut"];
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
    progress_api_v1_parent_children__student_id__progress_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                student_id: string;
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
                    "application/json": components["schemas"]["ParentProgressOut"];
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
    reflections_api_v1_parent_children__student_id__reflections_get: {
        parameters: {
            query?: {
                limit?: number;
                cursor?: string | null;
            };
            header?: never;
            path: {
                student_id: string;
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
                    "application/json": components["schemas"]["ParentReflectionsOut"];
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
    mark_seen_api_v1_parent_children__student_id__seen_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                student_id: string;
            };
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
    preferences_api_v1_parent_preferences_get: {
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
                    "application/json": components["schemas"]["ParentPreferencesOut"];
                };
            };
        };
    };
    set_preferences_api_v1_parent_preferences_put: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ParentPreferencesIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ParentPreferencesOut"];
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
    ai_usage_api_v1_platform_ai_usage_get: {
        parameters: {
            query: {
                from: string;
                to: string;
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
                    "application/json": components["schemas"]["AiUsageOut"][];
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
    platform_audit_api_v1_platform_audit_log_get: {
        parameters: {
            query?: {
                limit?: number;
                cursor?: number | null;
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
                    "application/json": components["schemas"]["AuditPageOut"];
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
    curriculum_versions_api_v1_platform_curriculum_versions_get: {
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
                    "application/json": components["schemas"]["CurriculumVersionOut"][];
                };
            };
        };
    };
    publish_curriculum_api_v1_platform_curriculum_versions_post: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CurriculumIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CurriculumCreatedOut"];
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
    curriculum_version_api_v1_platform_curriculum_versions__version_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                version_id: string;
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
                    "application/json": components["schemas"]["CurriculumDetailOut"];
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
    list_platform_api_v1_platform_references_get: {
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
                    "application/json": components["schemas"]["ReferenceSummaryOut"][];
                };
            };
        };
    };
    upload_api_v1_platform_references_post: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["Body_upload_api_v1_platform_references_post"];
            };
        };
        responses: {
            /** @description Successful Response */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReferenceQueuedOut"];
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
    detail_api_v1_platform_references__document_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                document_id: string;
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
                    "application/json": components["schemas"]["ReferenceDetailOut"];
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
    request_draft_api_v1_platform_references__document_id__draft_post: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                document_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReferenceDraftQueuedOut"];
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
    source_file_api_v1_platform_references__document_id__file_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                document_id: string;
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
    publish_api_v1_platform_references__document_id__publish_post: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                document_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReferenceRevisionIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReferenceQueuedOut"];
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
    retry_api_v1_platform_references__document_id__retry_post: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                document_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReferenceRevisionIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReferenceQueuedOut"];
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
    review_api_v1_platform_references__document_id__review_put: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                document_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReferenceReviewIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReferenceRevisionOut"];
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
    schools_api_v1_platform_schools_get: {
        parameters: {
            query?: {
                q?: string;
                cursor?: string | null;
                limit?: number;
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
                    "application/json": components["schemas"]["SchoolsPageOut"];
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
    create_school_api_v1_platform_schools_post: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SchoolIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolCreatedOut"];
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
    school_detail_api_v1_platform_schools__school_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                school_id: string;
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
                    "application/json": components["schemas"]["SchoolOut"];
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
    edit_school_api_v1_platform_schools__school_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                school_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SchoolPatchIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolOut"];
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
    school_admin_api_v1_platform_schools__school_id__admin_post: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                school_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AdminEmailIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SchoolAdminOut"];
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
    school_status_api_v1_platform_schools__school_id__status_patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                school_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SchoolStatusIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            204: {
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
    publish_api_v1_publications_post: {
        parameters: {
            query?: never;
            header?: {
                "Idempotency-Key"?: string | null;
            };
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
    publication_detail_api_v1_publications__publication_id__get: {
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
                    "application/json": components["schemas"]["PublicationDetailOut"];
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
    edit_publication_api_v1_publications__publication_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                publication_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PublicationWindowIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            204: {
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
    grant_attempt_api_v1_publications__publication_id__attempt_grants_post: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                publication_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AttemptGrantIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AttemptGrantOut"];
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
    cancel_publication_api_v1_publications__publication_id__cancel_post: {
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
            204: {
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
    export_publication_api_v1_publications__publication_id__export_get: {
        parameters: {
            query?: {
                format?: "csv";
            };
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
                    "text/csv": unknown;
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
            header?: {
                "If-None-Match"?: string | null;
            };
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
                    "Cache-Control"?: string;
                    Date?: string;
                    ETag?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MonitorOut"];
                };
            };
            /** @description Authorized view unchanged; empty body. Use Date for clock synchronization. */
            304: {
                headers: {
                    Date?: string;
                    ETag?: string;
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
    release_api_v1_publications__publication_id__release_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                publication_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReleaseIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReleasedOut"];
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
    preview_api_v1_publications__publication_id__release_preview_get: {
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
                    "application/json": components["schemas"]["ReleasePreviewOut"];
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
    get_import_api_v1_roster_imports__import_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                import_id: string;
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
                    "application/json": components["schemas"]["RosterImportOut"];
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
    import_errors_api_v1_roster_imports__import_id__errors_csv_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                import_id: string;
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
    remove_participant_api_v1_runs__run_id__participants__participant_id__remove_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                run_id: string;
                participant_id: string;
            };
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
    academic_years_api_v1_schools__school_id__academic_years_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                school_id: string;
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
                    "application/json": components["schemas"]["AcademicYearOut"][];
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
    create_year_api_v1_schools__school_id__academic_years_post: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                school_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AcademicYearIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AcademicYearCreatedOut"];
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
    list_invitations_api_v1_schools__school_id__account_invitations_get: {
        parameters: {
            query?: {
                cursor?: string | null;
                limit?: number;
                state?: ("not_requested" | "requires_assistance" | "active" | "pending" | "sent" | "failed" | "expired" | "activated" | "superseded") | null;
            };
            header?: never;
            path: {
                school_id: string;
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
                    "application/json": components["schemas"]["InvitationPageOut"];
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
    request_invitations_api_v1_schools__school_id__account_invitations_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                school_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["InvitationRequestIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["InvitationsQueuedOut"];
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
    assignments_api_v1_schools__school_id__assignments_get: {
        parameters: {
            query?: {
                academic_year_id?: string | null;
            };
            header?: never;
            path: {
                school_id: string;
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
                    "application/json": components["schemas"]["SchoolAssignmentOut"][];
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
    assign_teacher_api_v1_schools__school_id__assignments_put: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                school_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AssignmentIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            204: {
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
    school_audit_api_v1_schools__school_id__audit_log_get: {
        parameters: {
            query?: {
                limit?: number;
                cursor?: number | null;
            };
            header?: never;
            path: {
                school_id: string;
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
                    "application/json": components["schemas"]["AuditPageOut"];
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
    classes_api_v1_schools__school_id__classes_get: {
        parameters: {
            query?: {
                academic_year_id?: string | null;
            };
            header?: never;
            path: {
                school_id: string;
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
                    "application/json": components["schemas"]["ClassOut"][];
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
    create_class_api_v1_schools__school_id__classes_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                school_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ClassIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClassOut"];
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
    edit_class_api_v1_schools__school_id__classes__class_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                school_id: string;
                class_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ClassPatchIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClassOut"];
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
    place_students_api_v1_schools__school_id__classes__class_id__students_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                school_id: string;
                class_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["StudentPlacementIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            204: {
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
    school_curriculum_versions_api_v1_schools__school_id__curriculum_versions_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                school_id: string;
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
                    "application/json": components["schemas"]["SchoolCurriculumVersionOut"][];
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
    school_cp_subject_api_v1_schools__school_id__curriculum_versions__version_id__subjects__cp_subject_id__get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                school_id: string;
                version_id: string;
                cp_subject_id: string;
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
                    "application/json": components["schemas"]["SchoolCpSubjectOut"];
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
    list_kbs_api_v1_schools__school_id__knowledge_bases_get: {
        parameters: {
            query?: {
                school_subject_id?: string | null;
                limit?: number;
                cursor?: string | null;
                q?: string;
                status?: ("empty" | "pending" | "ready" | "building" | "failed" | "archived") | null;
            };
            header?: never;
            path: {
                school_id: string;
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
                    "application/json": components["schemas"]["KbPageOut"];
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
    create_kb_api_v1_schools__school_id__knowledge_bases_post: {
        parameters: {
            query?: never;
            header?: {
                "Idempotency-Key"?: string | null;
            };
            path: {
                school_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["Body_create_kb_api_v1_schools__school_id__knowledge_bases_post"];
            };
        };
        responses: {
            /** @description Successful Response */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MaterialQueuedOut"];
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
    list_missions_api_v1_schools__school_id__missions_get: {
        parameters: {
            query?: {
                school_subject_id?: string | null;
                limit?: number;
                cursor?: string | null;
                q?: string;
                status?: ("draft" | "reviewed" | "locked" | "archived") | null;
            };
            header?: never;
            path: {
                school_id: string;
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
                    "application/json": components["schemas"]["MissionPageOut"];
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
    list_teacher_api_v1_schools__school_id__national_references_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                school_id: string;
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
                    "application/json": components["schemas"]["ReferenceSummaryOut"][];
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
    people_api_v1_schools__school_id__people_get: {
        parameters: {
            query?: {
                role?: components["schemas"]["Role"] | null;
                q?: string;
                cursor?: string | null;
                limit?: number;
            };
            header?: never;
            path: {
                school_id: string;
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
                    "application/json": components["schemas"]["PeoplePageOut"];
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
    create_person_api_v1_schools__school_id__people_post: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                school_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PersonCreateIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["PersonCreatedOut"];
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
    link_child_api_v1_schools__school_id__people__parent_id__children__student_id__put: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                school_id: string;
                parent_id: string;
                student_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ParentLinkIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            204: {
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
    unlink_child_api_v1_schools__school_id__people__parent_id__children__student_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                school_id: string;
                parent_id: string;
                student_id: string;
            };
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
    edit_person_api_v1_schools__school_id__people__user_id__patch: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                school_id: string;
                user_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PersonEditIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            204: {
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
    deactivate_person_api_v1_schools__school_id__people__user_id__deactivate_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                school_id: string;
                user_id: string;
            };
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
    reactivate_person_api_v1_schools__school_id__people__user_id__reactivate_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                school_id: string;
                user_id: string;
            };
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
    list_imports_api_v1_schools__school_id__roster_imports_get: {
        parameters: {
            query?: {
                academic_year_id?: string | null;
                cursor?: string | null;
                limit?: number;
            };
            header?: never;
            path: {
                school_id: string;
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
                    "application/json": components["schemas"]["RosterImportsPageOut"];
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
    upload_roster_api_v1_schools__school_id__roster_imports_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                school_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": components["schemas"]["Body_upload_roster_api_v1_schools__school_id__roster_imports_post"];
            };
        };
        responses: {
            /** @description Successful Response */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RosterQueuedOut"];
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
    subjects_api_v1_schools__school_id__subjects_get: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                school_id: string;
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
                    "application/json": components["schemas"]["SubjectOut"][];
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
    create_subject_api_v1_schools__school_id__subjects_post: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                school_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SubjectCreateIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SubjectCreatedOut"];
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
    delete_subject_api_v1_schools__school_id__subjects__subject_id__delete: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                school_id: string;
                subject_id: string;
            };
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
    set_curriculum_api_v1_schools__school_id__subjects__subject_id__curriculum_put: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                school_id: string;
                subject_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CurriculumMappingIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            204: {
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
    override_score_api_v1_scores__score_id__overrides_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                score_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["OverrideIn"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OverrideResultOut"];
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
    end_session_api_v1_sessions__session_id__end_post: {
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
            204: {
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
    export_report_api_v1_sessions__session_id__report_export_get: {
        parameters: {
            query?: {
                format?: "csv";
            };
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
                    "text/csv": unknown;
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
        requestBody?: {
            content: {
                "application/json": components["schemas"]["WindowStartIn"] | null;
            };
        };
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
    reflections_api_v1_student_reflections_get: {
        parameters: {
            query?: {
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
                    "application/json": components["schemas"]["StudentReflectionsOut"];
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
    leave_lobby_api_v1_student_runs__run_id__leave_post: {
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
            204: {
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
    lobby_api_v1_student_runs__run_id__lobby_get: {
        parameters: {
            query?: never;
            header?: {
                "If-None-Match"?: string | null;
            };
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
                    "Cache-Control"?: string;
                    Date?: string;
                    ETag?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StudentLobbyOut"];
                };
            };
            /** @description Authorized view unchanged; empty body. Use Date for clock synchronization. */
            304: {
                headers: {
                    Date?: string;
                    ETag?: string;
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
                "application/json": components["schemas"]["nalar__presentation__api__schemas__student__WarmupChoiceIn"];
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
            header?: {
                "If-None-Match"?: string | null;
            };
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
                    "Cache-Control"?: string;
                    Date?: string;
                    ETag?: string;
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["StateOut"];
                };
            };
            /** @description Authorized view unchanged; empty body. Use Date for clock synchronization. */
            304: {
                headers: {
                    Date?: string;
                    ETag?: string;
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
    attention_api_v1_teacher_attention_get: {
        parameters: {
            query: {
                school_id: string;
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
                    "application/json": components["schemas"]["AttentionPageOut"];
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
    class_students_api_v1_teacher_classes__class_id__students_get: {
        parameters: {
            query?: {
                publication_id?: string | null;
            };
            header?: never;
            path: {
                class_id: string;
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
                    "application/json": components["schemas"]["ClassStudentsOut"];
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
    dashboard_api_v1_teacher_dashboard_get: {
        parameters: {
            query: {
                school_id: string;
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
                    "application/json": components["schemas"]["TeacherDashboardOut"];
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
    publications_api_v1_teacher_publications_get: {
        parameters: {
            query?: {
                class_id?: string | null;
                limit?: number;
                cursor?: string | null;
                q?: string;
                status?: ("scheduled" | "lobby" | "open" | "closed") | null;
                school_subject_id?: string | null;
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
    student_history_api_v1_teacher_students__student_id__history_get: {
        parameters: {
            query?: {
                limit?: number;
                cursor?: string | null;
            };
            header?: never;
            path: {
                student_id: string;
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
                    "application/json": components["schemas"]["StudentHistoryOut"];
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
