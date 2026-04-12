source 'https://rubygems.org'

gem 'jekyll', '~> 4.3'
gem 'kramdown-parser-gfm', '~> 1.1'

# If you have any plugins, put them here!
group :jekyll_plugins do
  gem 'jekyll-feed', '~> 0.15'
  gem 'jekyll-relative-links', '~> 0.6'
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
# and associated library.
install_if -> { RUBY_PLATFORM =~ %r!mingw|mswin|java! } do
  gem 'tzinfo', '~> 1.2'
  gem 'tzinfo-data'
end
