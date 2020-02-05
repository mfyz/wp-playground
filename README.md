# WordPress Playground

To set up wordpress container:
`docker-compose up -d`

Create admin account, install and activate a theme and plugins,
`node install.sh`

To stop and destroy
`docker-compose down -v`

Export database dump
`sh ./export.sh`

#### Other useful wpcli commands

For easy use, define this alias first: `alias wp="docker-compose run --rm wpcli"`

- Users
  - `wp user list`
  - `wp user create bob bob@example.com --role=author`
  - `wp user update 123 --display_name=Mary --user_pass=marypass`
  - `wp user delete 123 --reassign=567`
- Themes
  - `wp theme list`
  - `wp theme activate twentysixteen`
  - `wp theme install twentysixteen --activate`
- Plugins
  - `wp plugin list`
  - `wp plugin activate hello`
  - `wp plugin install bbpress --activate`
- Options/Meta
  - `wp option get siteurl`
  - `wp option add my_option foobar`
  - `wp option update my_option '{"foo": "bar"}' --format=json`
  - `wp option delete my_option`
- Posts/Pages
  - `wp post create --post_type=post --post_title='A sample post'`
  - `wp post update 123 --post_status=draft`
  - `wp post delete 123`
- Comments
  - `wp comment create --comment_post_ID=15 --comment_content="hello blog" --comment_author="wp-cli"`
  - `wp comment delete $(wp comment list --status=spam --format=ids)`
- DB
  - `echo "select now()" | wp db query`
  - `wp db export > export.sql`
  - `wp db import < export.sql`

