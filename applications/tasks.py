from celery import shared_task


@shared_task
def calculate_match_score(application_id):
    from .models import Application

    try:
        application = Application.objects.get(id=application_id)
        candidate = application.candidate
        job = application.job

        candidate_skills = set(
            candidate.candidate_profile.skills.values_list(
                "name", flat=True
            )
        )
        job_skills = set(
            job.required_skills.values_list(
                "name", flat=True
            )
        )

        if not job_skills:
            application.match_score = 0.0
            application.match_details = {
                "matching_skills": [],
                "missing_skills": [],
                "match_score": 0.0,
                "note": "Job has no required skills listed"
            }
            application.save()
            return

        matching_skills = candidate_skills & job_skills
        missing_skills = job_skills - candidate_skills

        score = (len(matching_skills) / len(job_skills)) * 100

        application.match_score = round(score, 2)
        application.match_details = {
            "matching_skills": list(matching_skills),
            "missing_skills": list(missing_skills),
            "match_score": round(score, 2),
        }
        application.save()

    except Application.DoesNotExist:
        pass