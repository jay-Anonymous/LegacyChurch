#!/usr/bin/env ruby

require 'sqlite3'

# Open a connection to the database and spreadsheet
db = SQLite3::Database.new "legacy.db"
pst = db.prepare "select * from church_data limit 1"
db_cols = pst.columns

# Include manual corrections here:

puts "Swap data in 2005 for 883520 and 937007? [y/n]"
response = STDIN.gets.chomp
if response[0] == 'y' then
	sql = 'update church_data set church_id=111111 where church_id=883520 and year=2005'
	db.execute sql;
	sql = 'update church_data set church_id=883520 where church_id=937007 and year=2005'
	db.execute sql;
	sql = 'update church_data set church_id=937007 where church_id=111111 and year=2005'
	db.execute sql;
end

puts "Done!"


