terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "ap-south-1" # Mumbai Region
}

# --- VPC ---
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  name   = "propmubi-vpc"
  cidr   = "10.0.0.0/16"

  azs             = ["ap-south-1a", "ap-south-1b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
}

# --- RDS (PostGIS) ---
resource "aws_db_instance" "default" {
  allocated_storage    = 20
  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = "db.t3.micro"
  db_name              = "propmubi"
  username             = "admin"
  password             = "CHANGE_ME_IN_PROD"
  parameter_group_name = "default.postgres15"
  skip_final_snapshot  = true
  
  vpc_security_group_ids = [aws_security_group.db_sg.id]
  db_subnet_group_name   = module.vpc.database_subnet_group
}

# --- Security Group ---
resource "aws_security_group" "db_sg" {
  name        = "allow_api"
  description = "Allow API traffic"
  vpc_id      = module.vpc.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }
}
