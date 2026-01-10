FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for PostGIS/GeoAlchemy
RUN apt-get update && apt-get install -y \
    libpq-dev gcc \
    && rm -rf /var/lib/apt/lists/*

# Install Poetry
RUN pip install poetry

# Copy Project Definitions
COPY pyproject.toml poetry.lock* /app/

# Install Dependencies (no-dev for prod)
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Copy Applicaton Code
COPY . /app

# Expose Port
EXPOSE 8000

# Run
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
