"""
Django REST views for document ingestion, retrieval, and chat Q&A.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Document, DocumentChunk
from .processors import extract_text_from_pdf, extract_text_from_txt, chunk_text
import os

class DocumentListCreateView(APIView):
    def get(self, request):
        docs = Document.objects.all().order_by('-created_at')
        data = [
            {
                'id': str(d.id),
                'name': d.name,
                'file_type': d.file_type,
                'file_size': d.file_size,
                'status': d.status,
                'chunk_count': d.chunk_count,
                'page_count': d.page_count,
                'created_at': d.created_at.isoformat(),
            }
            for d in docs
        ]
        return Response(data)

    def post(self, request):
        file_obj = request.FILES.get('file')
        if not file_obj:
            return Response({'error': 'No file provided.'}, status=status.HTTP_400_BAD_REQUEST)

        filename = file_obj.name
        ext = filename.split('.')[-1].lower()
        if ext not in ['pdf', 'txt', 'md']:
            return Response({'error': 'Unsupported file format.'}, status=status.HTTP_400_BAD_REQUEST)

        if file_obj.size > 25 * 1024 * 1024:
            return Response({'error': 'File exceeds 25MB limit.'}, status=status.HTTP_400_BAD_REQUEST)

        doc = Document.objects.create(
            name=filename,
            file_type='pdf' if ext == 'pdf' else 'txt',
            file_size=file_obj.size,
            storage_path=file_obj,
            status='extracting'
        )

        try:
            # Process document
            file_path = doc.storage_path.path
            if doc.file_type == 'pdf':
                pages = extract_text_from_pdf(file_path)
            else:
                pages = extract_text_from_txt(file_path)

            doc.page_count = len(pages)
            doc.status = 'chunking'
            doc.save()

            chunks_to_create = []
            chunk_idx = 0
            for page in pages:
                page_chunks = chunk_text(page['text'])
                for p_text in page_chunks:
                    chunks_to_create.append(
                        DocumentChunk(
                            document=doc,
                            chunk_index=chunk_idx,
                            page_number=page['page_number'],
                            text_content=p_text,
                            token_count=len(p_text.split())
                        )
                    )
                    chunk_idx += 1

            DocumentChunk.objects.bulk_create(chunks_to_create)
            doc.chunk_count = len(chunks_to_create)
            doc.status = 'ready'
            doc.save()

            return Response({
                'id': str(doc.id),
                'name': doc.name,
                'status': doc.status,
                'chunk_count': doc.chunk_count,
                'page_count': doc.page_count
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            doc.status = 'failed'
            doc.error_message = str(e)
            doc.save()
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class DocumentDetailView(APIView):
    def get(self, request, pk):
        doc = get_object_or_404(Document, pk=pk)
        return Response({
            'id': str(doc.id),
            'name': doc.name,
            'status': doc.status,
            'chunk_count': doc.chunk_count,
            'page_count': doc.page_count,
            'error_message': doc.error_message,
        })

    def delete(self, request, pk):
        doc = get_object_or_404(Document, pk=pk)
        doc.delete()
        return Response({'success': True}, status=status.HTTP_204_NO_CONTENT)

class ChatAskView(APIView):
    def post(self, request):
        query = request.data.get('query', '').strip()
        if not query:
            return Response({'error': 'Query required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Simple semantic keyword scoring over chunks
        query_words = [w.lower() for w in query.split() if len(w) > 3]
        chunks = DocumentChunk.objects.all()

        scored = []
        for c in chunks:
            text_lower = c.text_content.lower()
            score = sum(text_lower.count(w) for w in query_words)
            if score > 0:
                scored.append((c, score))

        scored.sort(key=lambda x: x[1], reverse=True)
        top_candidates = scored[:5]

        if not top_candidates:
            return Response({
                'answer': "I couldn't find enough information in the uploaded documents to answer this question reliably. Try rephrasing your question or uploading a document that covers this topic.",
                'isAbstention': True,
                'citations': []
            })

        citations = []
        for idx, (c, score) in enumerate(top_candidates):
            citations.append({
                'sourceNumber': idx + 1,
                'documentId': str(c.document.id),
                'documentName': c.document.name,
                'pageNumber': c.page_number,
                'chunkIndex': c.chunk_index,
                'excerpt': c.text_content[:250] + '...',
                'score': min(0.99, score / 10.0)
            })

        answer_lines = [
            f"Based on the retrieved document context:\n",
            *[f"• {c.text_content[:180]}... [Source {idx+1}]" for idx, (c, _) in enumerate(top_candidates[:3])],
            "\n*All statements are strictly grounded in the cited source passages.*"
        ]

        return Response({
            'answer': "\n".join(answer_lines),
            'isAbstention': False,
            'citations': citations
        })
