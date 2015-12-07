#!/usr/bin/env ruby

require 'sqlite3'

# Open a connection to the database and spreadsheet
db = SQLite3::Database.new "legacy.db"
pst = db.prepare "select * from church_data limit 1"
db_cols = pst.columns

# Include manual corrections here:

puts "Done!"


