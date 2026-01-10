variable "project_id" {
  description = "The GCP project ID to deploy to."
  type        = "string"
  default     = "propmubi-production"
}

variable "region" {
  description = "The GCP region to deploy to."
  type        = "string"
  default     = "asia-south1" # Mumbai for India focus
}

variable "environment" {
  description = "The environment for deployment (e.g., production, staging)."
  type        = "string"
  default     = "production"
}
