#!/usr/bin/env ruby

require 'roo-xls'
require 'sqlite3'

db = SQLite3::Database.new "legacy.db"

pst = db.prepare "select * from church_data limit 1"
dbcols = pst.columns

dbcols.each do |col|
	years = (db.execute "select distinct year from church_data where #{col} not null").flatten
	print "#{col}\n" unless (years.length > 4 or years.sort[0] > 2008)
end



