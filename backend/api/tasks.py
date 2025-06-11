# api/tasks.py
import time
from .models import DocumentJob

def process_document_job(job_id):
    print(f"Starting processing for job {job_id}...")
    try:
        # Get the job from the database
        job = DocumentJob.objects.get(pk=job_id)

        # Update status to PROCESSING
        job.status = DocumentJob.Status.PROCESSING
        job.save()
        print(f"Job {job_id} status updated to PROCESSING.")

        # Simulate work (e.g., calling an LLM, analyzing a doc)
        time.sleep(5)

        # Update status to SUCCESS and add a result
        job.status = DocumentJob.Status.SUCCESS
        job.result = f"This is the successfully processed summary for job {job_id}."
        job.save()
        print(f"Job {job_id} has been successfully processed.")

    except DocumentJob.DoesNotExist:
        print(f"Job {job_id} not found.")
    except Exception as e:
        print(f"An error occurred for job {job_id}: {e}")
        # Optionally, update the job status to FAILED
        try:
            job = DocumentJob.objects.get(pk=job_id)
            job.status = DocumentJob.Status.FAILED
            job.save()
        except DocumentJob.DoesNotExist:
            pass # Job was deleted or never existed