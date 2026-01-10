resource "google_service_account" "microservices" {
  account_id   = "${var.environment}-microservices"
  display_name = "Microservices Service Account"
}

# Granting Pub/Sub Editor role to allow publishing/subscribing
resource "google_project_iam_member" "pubsub_editor" {
  project = var.project_id
  role    = "roles/pubsub.editor"
  member  = "serviceAccount:${google_service_account.microservices.email}"
}

# Granting Storage Object Admin to allow uploads/downloads
resource "google_project_iam_member" "storage_admin" {
  project = var.project_id
  role    = "roles/storage.objectAdmin"
  member  = "serviceAccount:${google_service_account.microservices.email}"
}

# Granting Cloud SQL Client
resource "google_project_iam_member" "cloudsql_client" {
  project = var.project_id
  role    = "roles/cloudsql.client"
  member  = "serviceAccount:${google_service_account.microservices.email}"
}

# Workload Identity binding for GKE
resource "google_service_account_iam_member" "workload_identity_user" {
  service_account_id = google_service_account.microservices.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "serviceAccount:${var.project_id}.svc.id.goog[default/${var.environment}-sa]"
}
