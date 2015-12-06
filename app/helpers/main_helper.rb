module MainHelper
	def display(query, name, form_data)
		html = query::Template
		query::Params.each do |key, value|
			el = get_form_element(value[0], name, key, value[1..-1], form_data)
			html.sub!(':' + key.to_s, el)
		end
		html += hidden_field_tag :query_type, query.to_s
		return html.html_safe
	end

	def to_id(id)
		id = ActiveSupport::Inflector.demodulize(id)
		id = ActiveSupport::Inflector.underscore(id)
		id = ActiveSupport::Inflector.dasherize(id)
		return id
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


		when 'selectmenu_tag'
			str += "#{args[0]}"
		end
		return eval str
	end

	def selectmenu_tag(id, menu_items)
		id = id.gsub('[', '-').gsub(']', '')
		tag = "<span class=\"#{id}\"><span class=\"first-item\"><a>Choose... 2000</a>"
		tag += "<span class=\"arrow\">▾</span></span>"
		tag += "<ul class=\"query-menu\" style=\"display: none\">"
		menu_items.each do |item|
			tag += print_menu_item(item, true)
		end
		tag += "</ul></span>"
		tag += hidden_field_tag 'church[property]', 'nil', id: nil, class: 'church-property-hidden'
	end

	def print_menu_item(item, top_level)
		item_class = top_level ? 'top-level-item' : 'sub-item';
		item_class << ' leaf-item' if item[1].nil?

		str = "<li class=\"#{item_class}\""
		str += " data-form-value=\"#{item[0][:value]}\"" unless item[0][:value].nil?
		str += ">#{item[0][:descriptor]}"
		if (not item[1].nil?)
			str += "<span class=\"arrow\">▸</span>"
			str += "<ul>"
			str += print_menu_item(item[1], false)
			str += "</ul>"
		end
		str += "</li>"
	end

end
