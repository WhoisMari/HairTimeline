from rest_framework import status
from django.core.paginator import Paginator
from .models import NewUser as User
from .models import Post, Collection, Comment, Like, Follow, DemoPost, Tag, Color
from .serializers import CommentSerializer, UserSerializer, PostSerializer, CollectionSerializer, LikeSerializer, FollowSerializer, TagSerializer, ColorSerializer
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response

def index(request):
	return PostView()


class CollectionsView(APIView):
	parser_classes = (MultiPartParser, FormParser)
	def get(self, request, *args, **kwargs):
		user = User.objects.get(id=request.user.id) # gets logged in user object
		qs_collections = Collection.objects.filter(user=user).order_by('-timestamp') # gets that user's collection queryset
		serializer = CollectionSerializer(qs_collections, many=True)
		if 'collection_title' in kwargs:
			collection = Collection.objects.get(title=kwargs['collection_title'])
			serializer = CollectionSerializer(collection)
		return Response(serializer.data) # returns JSON serialized data

	def post(self, request, *args, **kwargs):
		valid_actions = ['create', 'delete']
		if kwargs['action'] in valid_actions:
			if request.user.is_authenticated:
				if kwargs['action'] == 'create':
					serializer = CollectionSerializer(data=request.data)
					if serializer.is_valid():
						serializer.save(user=request.user)
						return Response('Collection created successfully!')
				if kwargs['action'] == 'delete' and kwargs['collection_title'] != '':
					collection = Collection.objects.get(title=kwargs['collection_title'])
					if collection.user == request.user:
						collection.delete()
						return Response('Collection deleted successfully.')
					return Response('This is not your collection.')
			return Response('User should be logged in.')
		return Response('Not a valid action', status=status.HTTP_401_UNAUTHORIZED)

	def put(self, request, *args, **kwargs):
		valid_actions = ['add', 'remove']
		message = ''
		if kwargs['action'] in valid_actions:
			collection = Collection.objects.get(id=kwargs['collection_id']) # gets one collection object
			if request.user.is_authenticated and request.user == collection.user :
				if kwargs['action'] == 'add':
					collection.post.add(kwargs['post_id']) # adds post to collection
					message = 'Post added successfully'
				elif kwargs['action'] == 'remove':
					collection.post.remove(kwargs['post_id']) # removes post from collection
					message = 'Post removed successfully'
			else:
				message = f'error: {status.HTTP_401_UNAUTHORIZED}'
			return Response({'message': message})
		return Response('error: not a valid action.', status=status.HTTP_404_NOT_FOUND)


class UserProfileView(APIView):
	parser_classes = (MultiPartParser, FormParser)
	def get(self, request, *args, **kwargs):
		current_user = User.objects.get(username=kwargs['username']) # gets the user, not necessarily logged in
		user_serializer = UserSerializer(current_user)
		followers = Follow.objects.filter(following__username=kwargs['username']) # gets the followers queryset for that user
		follow_serializer = FollowSerializer(followers, many=True)
		return Response({
			'user': user_serializer.data, 
			'follows': follow_serializer.data, 
			'followers': current_user.followersCount(), # return followers total
			'following': current_user.followingCount() # return following total
		}, status=status.HTTP_200_OK)

	def put(self, request, *args, **kwargs): # to edit user's profile
		user = User.objects.get(username=kwargs['username'])
		if request.user.is_authenticated:
			if request.user == user:
				if 'profile_image' in request.data:
					user.profile_image.delete()
				serializer = UserSerializer(user, data=request.data)
				if serializer.is_valid():
					serializer.save()
					return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PostView(APIView):
	parser_classes = (JSONParser, MultiPartParser, FormParser)
	def get(self, request, *args, **kwargs):
		valid_actions = ['timeline', 'explore']

		if kwargs['action'] in valid_actions:
			qs_posts = Post.objects.all() # all posts queryset

			if kwargs['action'] == 'timeline' and kwargs['post_id'] != '':
				qs_posts = Post.objects.filter(user=kwargs['post_id']).order_by('-date') # filtered posts queryset, for a user's timeline
				paginator = Paginator(qs_posts, 20)
				page_number = request.GET.get('page')
				posts = paginator.get_page(page_number)
				has_next = True if posts.has_next() else False
				posts_serializer = PostSerializer(posts, many=True)
				return Response({"posts": posts_serializer.data, "has_next": has_next}, status=status.HTTP_200_OK)

			if request.GET.get('tags') != None and request.GET.get('tags') != '':
				tags = request.GET.get('tags').split(',')
				qs_posts = qs_posts.filter(tags__in=tags).distinct()

			if request.GET.get('colors') != None and request.GET.get('colors') != '':
				colors = request.GET.get('colors').split(',')
				qs_posts = qs_posts.filter(colors__in=colors).distinct()

			qs_posts = qs_posts.order_by('-timestamp')
			paginator = Paginator(qs_posts, 20)
			page_number = request.GET.get('page')
			posts = paginator.get_page(page_number)
			has_next = True if posts.has_next() else False

			posts_serializer = PostSerializer(posts, many=True)

			return Response({"posts": posts_serializer.data, "has_next": has_next}, status=status.HTTP_200_OK)

		return Response('Error: not a valid action.', status=status.HTTP_404_NOT_FOUND)

	def post(self, request, *args, **kwargs):
		valid_actions = ['create', 'delete']
		if kwargs['action'] in valid_actions:
			if request.user.is_authenticated:
				if kwargs['action'] == 'create':
					if request.data['image'] == '':
						return Response('Error: you should provide an image')
					else:
						if request.data['image'].size > 1000000:
							return Response({'error': f'Please keep images size under 1MB. Current filesize {request.data["image"].size}'})
						else:
							posts_serializer = PostSerializer(data=request.data)
							if posts_serializer.is_valid():
								posts_serializer.save(user=request.user) # creates new post with provided data
								new_post = Post.objects.get(id=posts_serializer.data['id'])
								if request.data['colors'] != None or request.data['colors'] != '':
									color = Color.objects.get(hex=request.data['colors'])
									new_post.colors.add(color.id)
								if request.data['tags'] != None or request.data['tags'] != '':
									for tag in request.data['tags']:
										if tag == ',':
											continue
										new_post.tags.add(tag)
								return Response(posts_serializer.data, status=status.HTTP_201_CREATED)
							return Response(posts_serializer.errors, status=status.HTTP_406_NOT_ACCEPTABLE)
				if kwargs['action'] == 'delete' and kwargs['post_id'] != '':
					post = Post.objects.get(id=kwargs['post_id']) # gets one post, which the logged user has created
					post.image.delete() # deletes that post's image, so it also gets deleted on AWS
					post.delete() # deletes the post object
					return Response('Post deleted successfully.')
		return Response({'error': 'Not a valid action'}, status=status.HTTP_404_NOT_FOUND)

	def put(self, request, *args, **kwargs):
		if request.user.is_authenticated:
			post = Post.objects.get(id=kwargs['post_id'])
			if post.user == request.user:
				post.date = request.data['date']
				post.caption = request.data['caption']
				post.products = request.data['products']

				if request.data['tags'] != None or request.data['tags'] != '':
					post.tags.clear()
					for tag in request.data['tags']:
						post.tags.add(tag)

				if request.data['colors'] != None or request.data['colors'] != '':
					post.colors.clear()
					for color in request.data['colors']:
						post.colors.add(color)
				post.save()
				return Response('Post edited successfully.')
			return Response(status=status.HTTP_401_UNAUTHORIZED)
		return Response(status=status.HTTP_404_NOT_FOUND)


class LikeView(APIView):
	parser_classes = (JSONParser, FormParser)
	def get(self, request, *args, **kwargs):
		post = Post.objects.get(id=kwargs['post_id']) # gets the post this user is in
		likes = Like.objects.filter(post=post.id) # gets likes queryset for this post
		user_liked = False
		if request.user.is_authenticated:
			user_liked = post.userLiked(request.user) # checks if user has liked this post
		serializer = LikeSerializer(likes, many=True)
		return Response({'likes': serializer.data, 'user_liked': user_liked}) # returns the likes JSON and if user has liked

	def post(self, request, *args, **kwargs):
		post = Post.objects.get(id=kwargs['post_id'])
		serializer = LikeSerializer(data=request.data)
		if request.user.is_authenticated:
			if serializer.is_valid():
				if kwargs['action'] == 'delete':
					Like.objects.filter(user=request.user, post=post).delete() # deletes like
					return Response('Deleted successfully')
				elif kwargs['action'] == 'create':
					serializer.save(post=post, user=request.user) # creates a like
					return Response(serializer.data, status=status.HTTP_201_CREATED)
			else:
				return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
		else:
			return Response({'message': 'error: user not authenticated',}, status=status.HTTP_401_UNAUTHORIZED)


class PostDetailView(APIView):
	parser_classes = (MultiPartParser, FormParser)
	def get(self, request, *args, **kwargs):
		post = Post.objects.get(id=kwargs['post_id'])
		post_serializer = PostSerializer(post)
		user = User.objects.get(username=post.user)
		user_serializer = UserSerializer(user)
		return Response({'post': post_serializer.data, 'user': user_serializer.data})


class CommentView(APIView):
	parser_classes = (MultiPartParser, FormParser)
	def get(self, request, *args, **kwargs):
		post = Post.objects.get(id=kwargs['post_id'])
		comments = Comment.objects.filter(post=post.id).order_by('-timestamp') # comments queryset for the post we got on the URL, ordered by timestamp
		serializer = CommentSerializer(comments, many=True)
		return Response(serializer.data) # returns JSON serialized comments data

	def post(self, request, *args, **kwargs):
		if request.user.is_authenticated:
			post = Post.objects.get(id=kwargs['post_id'])
			if kwargs['action'] == 'create':
				serializer = CommentSerializer(data=request.data)
				if serializer.is_valid():
					serializer.save(post=post, user=request.user)
					return Response(serializer.data, status=status.HTTP_201_CREATED)
				else:
					return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
			elif kwargs['action'] == 'delete':
				comment = Comment.objects.get(id=kwargs['comment_id'])
				if request.user == comment.user or request.user == post.user:
					comment.delete()
					return Response({'message': 'Comment deleted successfully!'}, status=status.HTTP_200_OK)
				else:
					return Response('You cannot delete this comment.')
		else:
			return Response({'message': 'error: user not authenticated',}, status=status.HTTP_401_UNAUTHORIZED)


class FollowView(APIView):
	parser_classes = (JSONParser, FormParser)
	def post(self, request, *args, **kwargs):
		valid_actions = ['follow', 'unfollow']
		if kwargs['action'] in valid_actions and kwargs['user_id']:
			if request.user.is_authenticated:
				current_user = User.objects.get(id=kwargs['user_id']) # gets current profile user
				if kwargs['action'] == 'unfollow':
					follower = Follow.objects.get(follower=request.user.id, following=current_user.id)
					follower.delete() # deletes logged user's follow
				if kwargs['action'] == 'follow':
					serializer =FollowSerializer(data=request.data)
					following_user = User.objects.get(id=kwargs['user_id'])
					if serializer.is_valid():
						serializer.save(follower=request.user, following=following_user) # creates a follow
				return Response({'followers': current_user.followersCount()}, status=status.HTTP_200_OK) # returns JSON serialized followers total
			return Response('User should be logged in.')
		return Response('error: not a valid action.', status=status.HTTP_404_NOT_FOUND)


class UsersView(APIView):
	parser_classes = (JSONParser, FormParser)
	def get(self, request, *args, **kwargs):
		query = request.GET.get('query')
		qs_users = User.objects.filter(username__icontains=query).exclude(username__in=['demouser', 'demouser2'])
		user_serialize = UserSerializer(qs_users, many=True)
		return Response(user_serialize.data)


class CategoriesView(APIView):
	parser_classes = (MultiPartParser, FormParser)
	def get(self, request, *args, **kwargs):
		qs_tags = Tag.objects.all()
		tags_serializer = TagSerializer(qs_tags, many=True)
		qs_colors = Color.objects.all()
		colors_serializer = ColorSerializer(qs_colors, many=True)
		return Response({'colors': colors_serializer.data, 'tags': tags_serializer.data})


class DemoTimelineView(APIView):
	parser_classes = (MultiPartParser, FormParser)
	def get(self, request, *args, **kwargs):
		user = User.objects.get(username='demouser')
		posts = DemoPost.objects.filter(user=user).order_by('-date')
		serializer = PostSerializer(posts, many=True)
		return Response(serializer.data)