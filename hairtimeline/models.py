from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from django.utils import timezone
from django.utils.translation import gettext_lazy as _


class CustomAccountManager(BaseUserManager):
	def create_superuser(self, email, username, password, **other_fields):
		other_fields.setdefault('is_staff', True)
		other_fields.setdefault('is_superuser', True)

		if other_fields.get('is_staff') is not True:
			raise ValueError('Superuser must be assigned to is_staff=True')
		if other_fields.get('is_superuser') is not True:
			raise ValueError('Superuser must be assigned to is_superuser=True')

		return self.create_user(email, username, password, **other_fields)

	def create_user(self, email, username, password=None, **other_fields):
		if not email:
			raise ValueError(_('You must provide an email address'))
		if not username:
			raise ValueError(_('You must provide an username'))

		email = self.normalize_email(email)
		user = self.model(email=email, username=username, **other_fields)
		user.set_password(password)
		user.save()
		return user

class NewUser(AbstractBaseUser, PermissionsMixin):
	email = models.EmailField(_('email address'), unique=True)
	username = models.CharField(max_length=150, unique=True)
	first_name = models.CharField(max_length=150, blank=True)
	last_name = models.CharField(max_length=150, blank=True)
	date_joined = models.DateTimeField(default=timezone.now)
	about = models.TextField(_('about'), max_length=150, blank=True)
	profile_image = models.FileField(blank=True)
	cover_color = models.CharField(max_length=55)
	is_staff = models.BooleanField(default=False)
	is_active = models.BooleanField(default=True)

	objects = CustomAccountManager()

	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['username']

	def __str__(self):
		return self.username

	def followersCount(self):
		return Follow.objects.filter(following=self.id).count()

	def followingCount(self):
		return Follow.objects.filter(follower=self.id).count()

class Follow(models.Model):
	follower = models.ForeignKey(NewUser, on_delete=models.CASCADE, related_name="following")
	following = models.ForeignKey(NewUser, on_delete=models.CASCADE, related_name="follower")

	def __str__(self):
		return f"'{self.follower}' started following '{self.following}'"

class Tag(models.Model):
	title = models.CharField(max_length=64)
	def __str__(self):
		return f"{self.title}"

class Color(models.Model):
	hex = models.CharField(max_length=25)
	def __str__(self):
		return f"{self.hex}"

class Post(models.Model):
	user = models.ForeignKey(NewUser, on_delete=models.CASCADE, related_name="user") 
	image = models.FileField()
	caption = models.CharField(max_length=520, blank=True)
	date = models.DateField(auto_now=False, auto_now_add=False)
	products = models.TextField(blank=True)
	timestamp = models.DateTimeField(auto_now_add=True)

	tags = models.ManyToManyField(Tag)
	colors = models.ManyToManyField(Color)

	def __str__(self):
		return f'{self.id}'

	def likesCount(self):
		return Like.objects.filter(post=self.id).count()

	def userLiked(self, user_id):
		qs_likes = Like.objects.filter(user_id=user_id, post=self.id).count()
		liked = True if qs_likes > 0 else False
		return liked

class Like(models.Model): 
	user = models.ForeignKey(NewUser, on_delete=models.CASCADE)
	post = models.ForeignKey(Post, on_delete=models.CASCADE)

	def __str__(self):
		return f"{self.user} liked {self.post}"

class Collection(models.Model):
	title = models.CharField(max_length=250)
	user = models.ForeignKey(NewUser, on_delete=models.CASCADE)
	post = models.ManyToManyField(Post, blank=True)
	timestamp = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.user} created {self.title}'s collection"

class Comment(models.Model):
	user = models.ForeignKey(NewUser, on_delete=models.CASCADE)
	post = models.ForeignKey(Post, on_delete=models.CASCADE)
	body = models.TextField()
	timestamp = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"{self.user} commented on post {self.post_id}"

class DemoPost(models.Model):
	user = models.ForeignKey(NewUser, on_delete=models.CASCADE) 
	image = models.FileField(upload_to="demo_posts/")
	date = models.DateField(auto_now=False, auto_now_add=False)
	timestamp = models.DateTimeField(auto_now_add=True)

	def __str__(self):
		return f"post: {self.id} - user: {self.user}"