locals {
  topics = [
    "inventory.property.created",
    "inventory.property.updated",
    "inventory.unit.status_changed",
    "lead.created",
    "lead.qualified",
    "lead.assigned",
    "lead.consent_given",
    "buyer.registered",
    "buyer.profile_enriched",
    "agent.assigned",
    "agent.performance_updated",
    "content.generated",
    "content.approved",
    "rera.synced",
    "provider.data_synced",
    "notification.sent"
  ]
}

resource "google_pubsub_topic" "topics" {
  for_each = toset(local.topics)
  name     = "${var.environment}.${each.value}"
  
  labels = {
    environment = var.environment
  }
}
