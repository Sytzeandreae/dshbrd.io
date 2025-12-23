# Generate tag pages for each unique tag and cuisine
module Jekyll
  class TagPageGenerator < Generator
    safe true

    def generate(site)
      tags = Set.new
      cuisines = Set.new

      # Collect all tags and cuisines from recipes
      site.collections['recipes'].docs.each do |recipe|
        if recipe.data['tags']
          recipe.data['tags'].each { |tag| tags.add(tag) }
        end
        if recipe.data['cuisine']
          cuisines.add(recipe.data['cuisine'])
        end
      end

      # Generate tag pages
      tags.each do |tag|
        site.pages << TagPage.new(site, tag, 'tag')
      end

      # Generate cuisine pages
      cuisines.each do |cuisine|
        site.pages << TagPage.new(site, cuisine, 'cuisine')
      end
    end
  end

  class TagPage < Page
    def initialize(site, tag, type)
      @site = site
      @base = site.source
      @dir = "tags/#{tag}"
      @name = "index.html"

      self.process(@name)
      self.read_yaml(File.join(@base, '_layouts'), 'tag.html')
      self.data['tag'] = tag
      self.data['tag_type'] = type
      self.data['title'] = tag.gsub("-", " ").split.map(&:capitalize).join(" ")
    end
  end
end
