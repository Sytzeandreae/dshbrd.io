module Jekyll
  module RecipeFilters
    # Format time: convert minutes to readable format
    # e.g., 75 -> "1h 15m", 30 -> "30 min"
    def format_time(minutes)
      return "" if minutes.nil? || minutes == 0

      minutes = minutes.to_i
      if minutes < 60
        "#{minutes} min"
      else
        hours = minutes / 60
        mins = minutes % 60
        mins > 0 ? "#{hours}h #{mins}m" : "#{hours}h"
      end
    end

    # Format quantity: convert decimals to fractions
    # e.g., 0.5 -> "1/2", 1.5 -> "1 1/2"
    def format_quantity(num)
      return "" if num.nil?

      # Handle arrays (ranges like [6, 8])
      if num.is_a?(Array)
        return "#{format_quantity(num[0])}-#{format_quantity(num[1])}"
      end

      num = num.to_f

      fractions = {
        0.125 => "1/8",
        0.25 => "1/4",
        0.333 => "1/3",
        0.375 => "3/8",
        0.5 => "1/2",
        0.625 => "5/8",
        0.666 => "2/3",
        0.667 => "2/3",
        0.75 => "3/4",
        0.875 => "7/8"
      }

      whole = num.to_i
      decimal = num - whole

      # Check for common fractions
      fractions.each do |dec, frac|
        if (decimal - dec).abs < 0.02
          return whole > 0 ? "#{whole} #{frac}" : frac
        end
      end

      # Return as-is if no fraction match
      if whole == num
        num.to_i.to_s
      else
        num.round(2).to_s.sub(/\.?0+$/, '')
      end
    end

    # Format unit with optional pluralization
    def format_unit(unit, qty = 1)
      return "" if unit.nil? || unit.empty?

      unit_names = {
        "tbsp" => "tablespoon",
        "tsp" => "teaspoon",
        "cup" => "cup",
        "oz" => "oz",
        "lb" => "lb",
        "g" => "g",
        "kg" => "kg",
        "ml" => "ml",
        "L" => "L",
        "inch" => "inch",
        "clove" => "clove",
        "sprig" => "sprig",
        "can" => "can",
        "piece" => "piece",
        "head" => "head",
        "bunch" => "bunch"
      }

      singular = unit_names[unit] || unit

      # Handle array quantities (use first value)
      effective_qty = qty.is_a?(Array) ? qty[0] : qty
      effective_qty = effective_qty.to_f rescue 1

      # Non-plural units (abbreviations)
      non_plural = ["oz", "lb", "g", "kg", "ml", "L"]

      # Pluralize if needed
      if effective_qty > 1 && singular.length > 2 && !non_plural.include?(unit)
        singular + "s"
      else
        singular
      end
    end

    # Capitalize and replace dashes with spaces
    # e.g., "east-asian" -> "East asian"
    def cuisine_name(str)
      return "" if str.nil?
      str.to_s.gsub("-", " ").capitalize
    end
  end
end

Liquid::Template.register_filter(Jekyll::RecipeFilters)
