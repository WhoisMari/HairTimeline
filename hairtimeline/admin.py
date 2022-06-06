from django.contrib import admin
from .models import NewUser as User
from .models import Post, Collection, Follow, Comment, Like, DemoPost, Color, Tag
from django.contrib.auth.admin import UserAdmin
from django.forms import Textarea

class UserAdminConfig(UserAdmin):
	search_fields = ('email', 'username', 'first_name')
	list_filter = ('email', 'username', 'first_name', 'is_active', 'is_staff')
	ordering = ('-date_joined',)
	list_display = ('email', 'username', 'first_name', 'is_active', 'is_staff')

	fieldsets = (
		(None, {'fields': ('email', 'username', 'first_name', 'last_name')}),
		('Permissions', {'fields': ('is_staff', 'is_active')}),
		('Personal', {'fields': ('about', 'profile_image', 'cover_color')}),
	)
	formfield_overrides = {
		User.about: {'widget': Textarea(attrs={'rows': 10, 'cols': 40})},
	}
	add_fieldsets = (
		(None, {
			'classes': ('wide',),
			'fields': ('email', 'username', 'first_name', 'password1', 'password2', 'is_active', 'is_staff', 'profile_image', 'cover_color')}
		),
	)

class PostAdminConfig(admin.ModelAdmin):
	list_display = ('user', 'image', 'timestamp')
	ordering = ('-timestamp',)

class DemoPostAdminConfig(admin.ModelAdmin):
	list_display = ('user', 'image', 'date')
	ordering = ('-timestamp',)

admin.site.register(User, UserAdminConfig)
admin.site.register(Follow)
admin.site.register(Post, PostAdminConfig)
admin.site.register(Color)
admin.site.register(Tag)
admin.site.register(Comment)
admin.site.register(Like)
admin.site.register(Collection)
admin.site.register(DemoPost, DemoPostAdminConfig)
