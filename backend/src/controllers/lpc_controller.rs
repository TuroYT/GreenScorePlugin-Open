use crate::dto::lpc_dto::LastPageConsultedInfos;
use crate::dto::lpc_dto::LastPageConsultedQuery;
use crate::dto::lpc_dto::LastPageConsultedResponse;
use crate::dto::user_full::UserFull;
use crate::error::AppError;
use crate::service::monitored_website_service::MonitoredWebsiteService;
use axum::Json;
use axum::extract::{Query, State};
use sqlx::MySqlPool;
use tower_sessions::Session;

pub async fn lpc(
    State(pool): State<MySqlPool>,
    session: Session,
    Query(params): Query<LastPageConsultedQuery>,
) -> Result<Json<LastPageConsultedResponse>, AppError> {
    let user_id: Option<i64> = session
        .get("user_full")
        .await
        .ok()
        .and_then(|user_full: Option<UserFull>| user_full.map(|u| u.user.id));
    let infos: Option<LastPageConsultedInfos> = params.into_infos();

    let response = MonitoredWebsiteService::lpc(&pool, user_id, infos)
        .await
        .map_err(AppError::from)?;

    Ok(Json(response))
}
