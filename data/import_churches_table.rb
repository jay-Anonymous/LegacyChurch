#!/usr/bin/env ruby

require 'roo-xls'
require 'sqlite3'

def capitalize_words(str)
	str.split.map(&:capitalize).join(' ')
end

db = SQLite3::Database.new "legacy.db"
data = Roo::Spreadsheet.open(ARGV[0], extension: :xls)

churches = data.parse(:id => 'ChurchNo', :name => 'ChurchName', :district => 'DistNo', 
					  :city => 'City', :state => 'State')

churches.each do |el|
	next unless el[:id].to_i != 0

	id = el[:id].to_i 
	name = capitalize_words(el[:name]) unless el[:name].nil?
	district = el[:district].to_i
	city = capitalize_words(el[:city]) unless el[:city].nil?
	state = el[:state].upcase unless el[:state].nil?

	sql = "insert into churches (id, name, district, city, state) values (?,?,?,?,?)"
	db.execute(sql, [id, name, district, city, state])
end
			   


