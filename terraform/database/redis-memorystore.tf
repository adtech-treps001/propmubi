resource "google_redis_instance" "cache" {
  name           = "${var.environment}-redis"
  tier           = "BASIC"
  memory_size_gb = 5

  region                  = var.region
  authorized_network      = var.vpc_id
  connect_mode            = "PRIVATE_SERVICE_ACCESS"

  redis_version = "REDIS_7_0"
  display_name  = "Propmubi Redis Cache"
  
  labels = {
    environment = var.environment
  }
}
