# posts/signals.py
from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import Like, Comment

@receiver(post_delete, sender=Like)
def update_like_count_on_delete(sender, instance, **kwargs):
    instance.post.like_count -= 1
    instance.post.save()

@receiver(post_delete, sender=Comment)
def update_comment_count_on_delete(sender, instance, **kwargs):
    instance.post.comment_count -= 1
    instance.post.save()