from django.urls import include, path
from . import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
	path('get-posts/timeline/', views.DemoTimelineView.as_view()),
	path('auth/', include('rest_auth.urls')),  
	path('auth/register/', include('rest_auth.registration.urls')),

	path('posts/<str:action>/', views.PostView.as_view()), # create post, explore page
	path('posts/<str:action>/<str:post_id>/', views.PostView.as_view()), # user timeline, delete post
	path('posts/edit/<str:post_id>/', views.PostView.as_view()), # delete post

	path('user/<str:username>/', views.UserProfileView.as_view()),

	path('get-users/', views.UsersView.as_view()),

	
	path('get-categories/', views.CategoriesView.as_view()),

	path('post/<str:post_id>/', views.PostDetailView.as_view()),

	path('like/<str:post_id>/', views.LikeView.as_view()),
	path('like/<str:post_id>/<str:action>/', views.LikeView.as_view()),

	path('comments/<str:post_id>/', views.CommentView.as_view()),
	path('comments/<str:post_id>/<str:action>/', views.CommentView.as_view()),
	path('comments/<str:post_id>/<str:action>/<str:comment_id>/', views.CommentView.as_view()),

	path('collections/', views.CollectionsView.as_view()),
	path('collection/<str:action>/', views.CollectionsView.as_view()),
	path('collection/<str:action>/<str:collection_title>/', views.CollectionsView.as_view()),
	path('collections/<str:collection_title>/', views.CollectionsView.as_view()),
	path('<str:action>/<str:post_id>/<str:collection_id>/', views.CollectionsView.as_view()),

	path('<str:action>/<str:user_id>/', views.FollowView.as_view()),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)