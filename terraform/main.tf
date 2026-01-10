module "network" {
  source      = "./network"
  project_id  = var.project_id
  region      = var.region
  environment = var.environment
}

module "compute" {
  source      = "./compute"
  project_id  = var.project_id
  region      = var.region
  environment = var.environment
  vpc_id      = module.network.vpc_id
  subnet_id   = module.network.subnet_id
}

module "database" {
  source      = "./database"
  project_id  = var.project_id
  region      = var.region
  environment = var.environment
  vpc_id      = module.network.vpc_id
}

module "storage" {
  source      = "./storage"
  project_id  = var.project_id
  region      = var.region
  environment = var.environment
}

module "pubsub" {
  source      = "./pubsub"
  project_id  = var.project_id
  environment = var.environment
}
