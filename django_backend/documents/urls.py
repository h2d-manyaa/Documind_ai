from django.urls import path
from .views import DocumentListCreateView, DocumentDetailView, ChatAskView

urlpatterns = [
    path('documents/', DocumentListCreateView.as_view(), name='document-list-create'),
    path('documents/<uuid:pk>/', DocumentDetailView.as_view(), name='document-detail'),
    path('documents/<uuid:pk>/status/', DocumentDetailView.as_view(), name='document-status'),
    path('chat/ask/', ChatAskView.as_view(), name='chat-ask'),
]
