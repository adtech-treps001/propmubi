resource "google_compute_global_address" "private_ip_address" {
  name          = "${var.environment}-private-ip-address"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = var.vpc_id
}

resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = var.vpc_id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]
}

resource "google_sql_database_instance" "main" {
  name             = "${var.environment}-postgres"
  database_version = "POSTGRES_15"
  region           = var.region
  
  depends_on = [google_service_networking_connection.private_vpc_connection]

  settings {
    tier = "db-custom-4-15360" # Matching n1-standard-4 roughly (4 vCPU, 15GB RAM)
    
    ip_configuration {
      ipv4_enabled    = false
      private_network = var.vpc_id
    }

    backup_configuration {
      enabled            = true
      start_time         = "02:00"
      point_in_time_recovery_enabled = true
    }

    maintenance_window {
      day  = 7 # Sunday
      hour = 3
    }

    disk_size = 100
    disk_type = "PD_SSD"
    
    availability_type = "REGIONAL" # High availability with standby in another zone
  }
}

resource "google_sql_database" "database" {
  name     = "propmubi"
  instance = google_sql_database_instance.main.name
}

resource "google_sql_user" "users" {
  name     = "propmubi_admin"
  instance = google_sql_database_instance.main.name
  password = "changeme-use-secrets-manager"
}
