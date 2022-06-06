# Hair Timeline

Hair Timeline is a social network for hair lovers. Users can create a timeline to share and keep track of their hairstyles, look for inspiration in other users' journeys, make collections to save their favourite hairstyles, and much more.

For this project, I used Python on top of Django and the Django REST framework for the back-end, and JavaScript, with React's library, as the front-end.

Start your hair tracking journey [here](https://hairtimeline.com/); 

# Main Features 

- Timeline
  - The timeline is where all of one's posts are. It's ordered not by the date you posted but by the date you changed your hair. You can see other users' timelines on their profiles.
- Image upload
  - Users can create "Posts" where they upload an image to their timeline, with a date, a caption, the products and colours used for that hairstyle, and what type of hairstyle it is.
  - Once users select an image to upload, they can already crop their image.
- Collections
  - Every post ever made in Hair Timeline can be saved to a collection(s), that each user can create for themselves.

# Installation

Requirements:
- Django 3.2.8
- Python 3.9.5

Clone this repository and run the commands:
```python
# Clone this repository
$ git clone https://github.com/WhoisMari/HairTimeline.git

# Create a virtualenv (optional) 
$ python -m venv myvirtualenv 

# Activate your just created virtualenv (optional)
$ myvirtualenv\Scripts\activate.bat # On Windows
$ source myvirtualenv/bin/activate # On Unix and MacOs

# Install dependencies 
$ pip install -r requirements.txt

# Install React dependencies
$ npm install
``` 
Create your .env file on Django's project directory (project)
- You should generate a SECRET_KEY for your Django project. It can be done [here](https://djecrety.ir/); 
- Configure the Debug as you wish (True or False); 
- The DATABASE_URL section can be configured using your database; 
- Add your ALLOWED_HOSTS configuration (I used "localhost:800" for production) 

Edit config.json, in the src directory:
```JSON 
{ 
  "SERVER_URL": "http://localhost:8000/api", 
  "WEB_URL": "http://localhost:8000/"
}
```

Set your proxy URL on package.json, also in the src directory:
```JSON 
{ 
  "proxy": "http://localhost:8000", 
}
```

As for the AWS section, if you already have an AWS account and an S3 bucket, great. Just add your credentials, bucket name, and URL.

But if you just want to run it locally, without the AWS storage, you can do so using the following: 
- Go to your Django app (hairtimeline) and in models.py change the following: 
    ```python 
    class NewUser(AbstractBaseUser, PermissionsMixin): 
    profile_image = models.ImageField(upload_to='your_upload_path/', blank=True) 
    cover_image = models.ImageField(upload_to='your_upload_path/', blank=True) 
    class Post(models.Model):
    image = models.ImageField(upload_to='your_upload_path/') 
    ``` 
- Run the migrations: 
    ```python 
    $ python manage.py makemigrations 
    $ python manage.py migrate 
    ``` 
- Go into project/settings.py and change your media root:
     ```python
    MEDIA_URL = '/your_upload_path/'
    MEDIA_ROOT = BASE_DIR / 'your_upload_path' 
    STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage' # delete this line
    ```

And you should be good to go!