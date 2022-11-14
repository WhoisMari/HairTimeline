from asyncore import read
from django.contrib.auth import models
from django.db.models import fields
from rest_framework import serializers
from .models import NewUser as User
from .models import Post, Collection, Follow, Comment, Like, DemoPost, Tag, Color


class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = User
		fields = ("id", "email", "username", "first_name", "last_name", "about", "profile_image", "cover_color", "is_active")

class TagSerializer(serializers.ModelSerializer):
	class Meta:
		model = Tag
		fields = ('id' ,'title')

class ColorSerializer(serializers.ModelSerializer):
	class Meta:
		model = Color
		fields = ('id' ,'hex')

class PostSerializer(serializers.ModelSerializer):
	user = UserSerializer(read_only=True)
	tags = TagSerializer(read_only=True, many=True)
	colors = ColorSerializer(read_only=True, many=True)
	class Meta:
		model = Post
		fields = ('id' ,'user', 'image', 'caption', 'date', 'products', 'timestamp', 'tags', 'colors')

class DemoPostSerializer(serializers.ModelSerializer):
	class Meta:
		model = DemoPost
		fields = ('__all__')

class CommentSerializer(serializers.ModelSerializer):
	user = UserSerializer(read_only=True)
	post = PostSerializer(read_only=True)
	class Meta:
		model = Comment
		fields = ('id' ,'user', 'post', 'body')

class CollectionSerializer(serializers.ModelSerializer):
	user = serializers.StringRelatedField()
	post = PostSerializer(read_only=True, many=True)
	class Meta:
		model = Collection
		fields = ('id', 'title', 'user', 'post', 'timestamp')

class LikeSerializer(serializers.ModelSerializer):
	user = UserSerializer(read_only=True)
	post = PostSerializer(read_only=True)

	class Meta:
		model = Like
		fields = ('id', 'user', 'post')

class FollowSerializer(serializers.ModelSerializer):
	follower = UserSerializer(read_only=True)
	following = UserSerializer(read_only=True)

	class Meta:
		model = Follow
		fields = ('id', 'follower', 'following')