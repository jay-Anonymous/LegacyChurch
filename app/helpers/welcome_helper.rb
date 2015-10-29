module WelcomeHelper
	def display(query, name, form_data)
		html = '<p>' + query::Template + '</p>'
		query::Params.each do |key, value|
			el = get_form_element(value[0], name, key, value[1..-1], form_data)
			html.sub!(':' + key.to_s, el)
		end
		html += hidden_field_tag :query_type, query.to_s
		return html.html_safe
	end

	def get_form_element(tag_name, name, key, args, form_data)
		str = "#{tag_name} 'church[#{key}]',"
		case tag_name

		when 'number_field_tag'
			if form_data then
				str += "'#{form_data[key]}'" + ','
			end
			str += args.join(',')

		when 'select_tag'
			if form_data then
				str += "options_for_select(#{args[0]}, '#{form_data[key]}')"
			else
				str += "options_for_select(#{args[0]})"
			end

		end
		return eval str
	end
end
