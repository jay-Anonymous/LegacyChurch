#!/usr/bin/env ruby

require 'roo-xls'
require 'sqlite3'

db = SQLite3::Database.new "legacy.db"
data = Roo::Spreadsheet.open(ARGV[0], extension: :xls)

churches = data.parse(:id => 'ChurchNo', :name => 'ChurchName', :district => 'DistNo', :city => 'City')

sql = ""
churches.each do |el|
	next unless el[:id].to_i != 0
	id = el[:id].to_i
	name = el[:name] ? el[:name].split.map(&:capitalize).join(' ') : 'null' 
	district = el[:district].to_i
	city = el[:city] ? el[:city].split.map(&:capitalize).join(' ') : 'null' 
	sql << "insert into churches (id, name, district, city) values 
		('#{id}', '#{name}', '#{district}', '#{city}'); "
end
			   
db.execute_batch(sql)


