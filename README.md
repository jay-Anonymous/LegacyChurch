# README

Have some (decidely bare-bones) documentation

## Database details

All of the church data is processed by `data/import_church_data.rb`, which takes as its only argument the name of an Excel file to process and insert into the sqlite3 database named `legacy.db` (that DB name is hard-coded).  You can look at the mapping rules from older Excel files to DB columns in `data/db_cols.db`.  

Eventually I will add in rules to tweak bugs and errors that we find in the data.  The goal is to make the entire process of creating the database from the spreadsheets entirely automated and reproducible.  It's not there yet, though ;)

I also include legacy.db in the Git repository so we can always go back to a verified-good version.

Once you have the database set up the way you want it, you'll need to copy (or create a symlink) from `data/legacy.db` to `db/development.sqlite3` -- then all the data should be available for use in the application.

There are two tables in the database, a `churches` table and a `church_data` table; the latter has a many-to-one relationship with the former: each church can have lots of data points, one for each year.  The `churches` table includes "fixed" data such as district, name, and location (yes, I know that's not really fixed -- hence the quotes.  I just took the most recent information from 2014).

## Ruby on Rails details

You need to have Ruby, Gem, and Bundle installed on your system.  Then you can set up the application for the first time by running `bundle install` from the root directory.  Assuming that all goes OK, you should then be able to start up the application by running `bin/rails server`, which will start a local webserver running at `http://localhost:3000`

## Code organization

Ruby uses a Model-View-Controller layout for its application.  I also add in a `lib/queries` directory, which allows you to create custom forms that translate directly into database queries.  Each of these query objects should inherit `AbstractQuery`, and they need a `Template`, which controls how the query is displayed on the website, a `Params` array which translates the template into form elements, and a `self.execute` function which controls SQL query performed on form submission.  Look in the current query types for examples.
