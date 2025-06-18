# Start from an official Python base image
FROM python:3.11-slim

# Set environment variables for Python
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies that might be needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
# We copy the requirements file first to leverage Docker's layer caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend application code into the container
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# The command to run when the container starts
# We use Gunicorn, a production-ready WSGI server, instead of the dev server
# You'll need to add gunicorn to your requirements.txt
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "evenup_project.wsgi:application"]
