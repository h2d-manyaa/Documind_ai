import uuid
from django.db import models

class Document(models.Model):
    STATUS_CHOICES = [
        ('uploading', 'Uploading'),
        ('extracting', 'Extracting Text'),
        ('chunking', 'Chunking Passages'),
        ('indexing', 'Generating Embeddings'),
        ('ready', 'Ready'),
        ('failed', 'Processing Failed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=10, choices=[('pdf', 'PDF'), ('txt', 'TXT')])
    file_size = models.PositiveIntegerField(help_text='Size in bytes')
    storage_path = models.FileField(upload_to='documents/%Y/%m/%d/')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='uploading')
    error_message = models.TextField(blank=True, null=True)
    chunk_count = models.PositiveIntegerField(default=0)
    page_count = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} ({self.status})"

class DocumentChunk(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='chunks')
    chunk_index = models.PositiveIntegerField()
    page_number = models.PositiveIntegerField(default=1)
    text_content = models.TextField()
    token_count = models.PositiveIntegerField(default=0)
    vector_id = models.CharField(max_length=128, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['document', 'chunk_index']

    def __str__(self):
        return f"{self.document.name} [p.{self.page_number} c.{self.chunk_index}]"
