resource "google_container_cluster" "primary" {
  name     = "${var.environment}-gke"
  location = var.region

  # Use Autopilot mode
  enable_autopilot = true

  network    = var.vpc_id
  subnetwork = var.subnet_id

  ip_allocation_policy {
    cluster_secondary_range_name  = "gke-pods"
    services_secondary_range_name = "gke-services"
  }

  # Cost optimization: Enable Vertical Pod Autoscaling
  vertical_pod_autoscaling {
    enabled = true
  }

  # Environment label
  resource_labels = {
    environment = var.environment
  }
}
