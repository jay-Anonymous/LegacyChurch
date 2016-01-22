#!/usr/bin/env ruby

RUBY = File.join(RbConfig::CONFIG['bindir'], RbConfig::CONFIG['ruby_install_name'])

correction_dir = Dir.new 'corrections'
curr_id_file = File.open 'corrections/.id', 'r+'
curr_id = curr_id_file.read.to_i

puts "Processing corrections greater than #{curr_id}"

correction_dir.each do |file|
	/^correction_(\d{3})\.rb$/.match(file) do |m|
		if (m[1].to_i > curr_id) then
			FileUtils.cp 'legacy.db', ".legacy.db.#{m[1].to_i}"
			success = system(RUBY, '-r', "./corrections/#{file}", '-e', 'do_correction')
			if success then
				curr_id_file.truncate 0
				curr_id_file.rewind
				curr_id_file.write  m[1].to_i
			else 
				puts "Error processing correction: #{file}\n"
				break
			end
		end
	end
end

curr_id_file.close

