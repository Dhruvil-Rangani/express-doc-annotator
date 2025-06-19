# api/tasks.py
import time
from .models import DocumentJob
import os
import openai
from .models import DocumentJob
from .utils import extract_text_from_file

def process_document_job(job_id):
    print(f"Starting AI processing for job {job_id}...")
    try:
        # Get the job from the database
        job = DocumentJob.objects.get(pk=job_id)
        
        # Check if a document was actually uploaded
        if not job.document:
            raise ValueError("No document found for this job.")
        
        # Update status to PROCESSING
        job.status = DocumentJob.Status.PROCESSING
        job.save()
        print(f"Job {job_id} status updated to PROCESSING.")
        
        # 1. Extract text from the saved file
        full_file_path = job.document.path
        extracted_text = extract_text_from_file(full_file_path)
        
        if not extracted_text:
            raise ValueError("Could not extract text from the document.")
        
        # 2. Call OpenAI API for summary
        print(f"Sending request to OpenAI for job {job_id}...")
        client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        
        try:
            response = client.chat.completions.create(
                model="o4-mini",
                messages= [
                    {"role": "system", "content": "You are a helpful assistant that provides thorough yet concise summaries of documents."},
                    {"role": "user", "content": (
                        "Please provide a detailed summary of the following document, "
                        "about 200-250 words (roughly half a page). "
                        "Focus on the main ideas and key points, and write in clear, well-structured paragraphs.\n\n"
                        f"{extracted_text[:4000]}"
                    )}
                ]
            )
            summary = response.choices[0].message.content
        except Exception as api_error:
            print(f"OpenAI API error for job {job_id}: {api_error}")
            raise
        
        # 3. Save the result and update status
        job.result = summary
        job.status = DocumentJob.Status.SUCCESS
        job.save()
        print(f"Job {job_id} has been successfully processed and summary saved.")

    except DocumentJob.DoesNotExist:
        print(f"Job {job_id} not found.")
    except Exception as e:
        print(f"An error occurred for job {job_id}: {e}")
        # Optionally, update the job status to FAILED
        try:
            job_to_fail = DocumentJob.objects.get(pk=job_id)
            job_to_fail.status = DocumentJob.Status.FAILED
            job_to_fail.result = f"An error occurred during processing: {str(e)}"
            job_to_fail.save()
        except DocumentJob.DoesNotExist:
            pass # Job was deleted or never existed