from celery import shared_task
from django.conf import settings
import anthropic
import json


@shared_task
def calculate_match_score(application_id):
    from .models import Application

    try:
        application = Application.objects.get(id=application_id)
        candidate = application.candidate
        job = application.job

        # Get candidate skills
        candidate_skills = list(
            candidate.candidate_profile.skills.values_list(
                "name", flat=True
            )
        )

        # Get job required skills
        job_skills = list(
            job.required_skills.values_list(
                "name", flat=True
            )
        )

        # Get extracted CV text if available
        active_resume = candidate.resumes.filter(
            is_active=True
        ).first()

        cv_text = ""
        if active_resume:
            cv_text = active_resume.extracted_text

        # Build the prompt
        prompt = f"""
You are an expert technical recruiter analyzing a candidate's fit for a job.

JOB TITLE: {job.title}

JOB DESCRIPTION:
{job.description}

REQUIRED SKILLS FOR JOB:
{', '.join(job_skills) if job_skills else 'None listed'}

CANDIDATE SKILLS:
{', '.join(candidate_skills) if candidate_skills else 'None listed'}

CANDIDATE CV TEXT:
{cv_text if cv_text else 'No CV text available'}

Analyze this candidate's fit for the job and respond with ONLY a JSON object in this exact format:
{{
    "match_score": <number between 0 and 100>,
    "matching_skills": [<list of skills the candidate has that match job requirements>],
    "missing_skills": [<list of required skills the candidate lacks>],
    "summary": "<2-3 sentence assessment of the candidate's fit>",
    "recommendation": "<one of: Strong Match, Good Match, Partial Match, Poor Match>"
}}

Base the match_score on:
- Skills match (50% weight)
- CV text relevance to job description (30% weight)  
- Overall experience fit (20% weight)

Respond with ONLY the JSON object, no other text.
"""

        # Call Claude API
        client = anthropic.Anthropic(
            api_key=settings.ANTHROPIC_API_KEY
        )

        message = client.messages.create(
            model="claude-sonnet-4-6",
            max_tokens=1000,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        # Parse the response
        response_text = message.content[0].text
        match_data = json.loads(response_text)

        # Save results
        application.match_score = match_data.get("match_score", 0)
        application.match_details = match_data
        application.save()

    except Application.DoesNotExist:
        pass
    except json.JSONDecodeError:
        # If Claude returns invalid JSON, fall back to basic matching
        candidate_skills_set = set(candidate_skills)
        job_skills_set = set(job_skills)

        if not job_skills_set:
            score = 0.0
        else:
            matching = candidate_skills_set & job_skills_set
            score = (len(matching) / len(job_skills_set)) * 100

        application.match_score = round(score, 2)
        application.match_details = {
            "matching_skills": list(
                candidate_skills_set & job_skills_set
            ),
            "missing_skills": list(
                job_skills_set - candidate_skills_set
            ),
            "match_score": round(score, 2),
            "summary": "AI analysis unavailable, basic matching used.",
            "recommendation": "Partial Match"
        }
        application.save()