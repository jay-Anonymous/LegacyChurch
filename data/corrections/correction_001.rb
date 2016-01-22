require 'sqlite3'

def do_correction
	# Open a connection to the database and spreadsheet
	db = SQLite3::Database.new 'legacy.db'

	puts "Swapping data in 2005 for 883520 and 937007..."

	sql = 'update church_data set church_id=111111 where church_id=883520 and year=2005'
	db.execute sql;
	if (db.errcode != 0) then
		puts db.errmsg
		return 1
	end

	sql = 'update church_data set church_id=883520 where church_id=937007 and year=2005'
	db.execute sql;
	if (db.errcode != 0) then
		puts db.errmsg
		return 1
	end

	sql = 'update church_data set church_id=937007 where church_id=111111 and year=2005'
	db.execute sql;
	if (db.errcode != 0) then
		puts db.errmsg
		return 1
	end

	puts "Done!"

	return 0;
end


