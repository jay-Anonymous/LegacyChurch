#!/usr/bin/env ruby

$: << "." # search the local directory for additional files

require 'roo-xls'
require 'sqlite3'
require 'db_cols'
require 'xls_cols'

db = SQLite3::Database.new "legacy.db"
data = Roo::Spreadsheet.open(ARGV[0], extension: :xls)

pst = db.prepare "select * from church_data limit 1"
year = ARGV[0].scan(/Table1-(\d{4})/)[0][0]

$xlscols = {}
dbcols = pst.columns

data.row(1).each_with_index do |val, index|
	if val == 'ChurchNo'
		$xlscols["church_id"] = index
	else 
		val.match(/.*\(([A-Za-z\/]+)\)/) do |m|
			key = m[1].gsub(/[^A-Za-z]/, '')
			$xlscols[key] = index 
		end
	end
end

dbcols.each do |col|
	unless $xlscols.keys.include? col or check_db_column(col)
		print "Database column #{col} is not present in spreadsheet -- values will be NULL.\n"
	end
end

$xlscols.keys.each do |key|
	unless dbcols.include? key or check_xls_column(key)
		print "Spreadsheet column #{key} is not present in database -- values will be ignored.\n"
	end
end

puts "There are #{data.last_row} rows."
print "Continue? [y/n] "
response = STDIN.gets.chomp

exit unless response[0] == 'y'
puts "Importing..."

def cell_to_int(row, label)
	p label
	p $xlscols[label]
	row[$xlscols[label]].to_i unless row[$xlscols[label]].nil?
end

def sumnil(*summands)
	summation = nil
	summand = summands.shift
	if summand
		if summation.nil? then summation = summand
		else summation += summand
		end
	end
	return summation
end

data.each do |row|
	next unless row[$xlscols["church_id"]].to_i != 0

	hdrs = dbcols.join(",")
	sql = "insert into church_data (#{hdrs}) values (#{('?,' * dbcols.length)[0..-2]})"

	values = []
	dbcols.each do |col|
		value = nil
		if col == "year"
			value = year.to_i
		elsif col == "MISSENGAGE" and !$xlscols.include? col
			# Pre-2008 don't include missions participation
			if $xlscols.include? "MISPAR"
				value = cell_to_int(row, "MISPAR")
			end
		elsif col == "CFCHILD" and !$xlscols.include? col
			cschild = cell_to_int(row, "CSCHILD")
			aochild = nil
			if $xlscols.include? "AOCHILD"
				aochild = cell_to_int(row, "AOCHILD")
			end
			value = sumnil(cschild, aochild)
		elsif col == "CFYOUTH" and !$xlscols.include? col
			csyouth = cell_to_int(row, "CSYOUTH")
			aoyouth = nil
			if $xlscols.include? "AOYOUTH"
				aoyouth = cell_to_int(row, "AOYOUTH")
			end
			value = sumnil(csyouth, aoyouth)
		elsif col == "CFOADLT" and !$xlscols.include? col
			csadult = cell_to_int(row, "CSADULTS")
			aoadult = nil; aoleaders = nil
			if $xlscols.include? "AOADULTS"
				aoadult = cell_to_int(row, "AOADULTS")
			end
			# assume that leaders are adults
			csleaders = cell_to_int(row, "CSLEAD")
			if $xlscols.include? "AOLEAD"
				aoleaders = cell_to_int(row, "AOLEAD")
			end
			# group young adults here for year <= 2008
			value = sumnil(csadult, aoadult, csleaders, aoleaders)
		elsif col == "ONGOCLASS" and !$xlscols.include? col
			# assume that all "other" classes in year <= '08 are ongoing
			if $xlscols.include? "CHOTH"
				choth = cell_to_int(row, "CHOTH")
				yooth = cell_to_int(row, "YOOTH")
				yoadult = cell_to_int(row, "YOADULT")
				value = sumnil(choth, yooth, yoadult)
			end
		elsif col == "OUTSRVD" and !$xlscols.include? col
			if $xlscols.include? "TOTSERV"
				# assume that all service in years <= '08 are "outreach", not "childcare"
				value = cell_to_int(row, "TOTSERV")
			end
		elsif col == "VALPROP" and !$xlscols.include? col
			valchur = cell_to_int(row, "VALCHUR")
			valpars = cell_to_int(row, "VALPARS")
			value = sumnil(valchur, valpars)
		elsif col == "GENADV" and !$xlscols.include? col
			if $xlscols.include? "GASb"
				value = cell_to_int(row, "GASb")
			# pre-2004 combines GAS and WSS
			elsif $xlscols.include? "GASWSS"
				value = cell_to_int(row, "GASWSS")
			end
		elsif col == "WSSPEC" and !$xlscols.include? col
			# WSS is not present in pre-2006
			if $xlscols.include? "WSS"
				value = cell_to_int(row, "WSS")
			end
		elsif col == "OTHDIRECT" and !$xlscols.include? col
			value = cell_to_int(row, "BENOTHER")
		elsif col == "TOTPAST" and !$xlscols.include? col
			if $xlscols.include? "PASTHOUS"
				pasthous = cell_to_int(row, "PASTHOUS")
				asschous = cell_to_int(row, "ASSCHOUS")
				value = sumnil(pasthous, asschous)
			elsif $xlscols.include? "HOUSUTIL"
				value = cell_to_int(row, "HOUSUTIL")
			end
		elsif col == "TOTREMB"
			if $xlscols.include? "PASTREMB"
				pastremb = cell_to_int(row, "PASTREMB")
				asscremb = cell_to_int(row, "ASSCREMB")
				value = sumnil(pastremb, asscremb)
			elsif $xlscols.include? "REIMBURS"
				value = cell_to_int(row, "REIMBURS")
			end
		elsif col == "TOTCASH"
			if $xlscols.include? "OTHCASHA"
				othcasha = cell_to_int(row, "OTHCASHA")
				othcashb = cell_to_int(row, "OTHCASHb")
				value = sumnil(othcasha, othcashb)
			elsif $xlscols.include? "OTHCASH"
				value = cell_to_int(row, "OTHCASH")
			end
		elsif col == "DIACCOMP"
			value = cell_to_int(row, "DEACOMP")
		elsif $xlscols.include? col
			value = cell_to_int(row, col)
		end
		values << value
	end

	db.execute(sql, values)
end

puts "Done!"


