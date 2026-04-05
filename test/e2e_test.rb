require "test/unit"
require "capybara"
require "capybara/dsl"
require "selenium-webdriver"
require "fileutils"
require "rodiff"
require "rodiff/cli"

TEST_DIR        = File.expand_path("..", __FILE__)
BASELINE_DIR    = File.join(TEST_DIR, "snapshots")
CURRENT_DIR     = File.join(TEST_DIR, "snapshots_current")
DIFF_DIR        = File.join(TEST_DIR, "snapshots_diff")
UPDATE_SNAPSHOTS = ARGV.include?("--update") || ARGV.include?("-u")
PORT            = 4000
FLAKY_PAGES     = [
  "/blog/web-component-hand-drawn-checkbox",
  "/blog/the-importance-of-the-main-thread-being-idle",
]
DELAYED_PAGES     = [
  "/blog/animated-nbc-peacock-logo",
]

class E2ETest < Test::Unit::TestCase
  include Capybara::DSL

  def self.startup
    FileUtils.rm_rf(CURRENT_DIR)
    FileUtils.rm_rf(DIFF_DIR)
    FileUtils.mkdir_p(CURRENT_DIR)
    FileUtils.mkdir_p(DIFF_DIR)

    Capybara.default_driver = :selenium_headless
    Capybara.app_host = "http://localhost:#{PORT}"
    Capybara.run_server = false

    Capybara.register_driver :selenium_headless do |app|
      options = Selenium::WebDriver::Chrome::Options.new
      options.add_argument("--headless=new")
      options.add_argument("--no-sandbox")
      options.add_argument("--disable-gpu")
      options.add_argument("--window-size=1400,900")

      Capybara::Selenium::Driver.new(app, browser: :chrome, options: options)
    end
  end

  # def setup
  # end

  # def teardown
  # end

  def test_home
    visit("/")
    take_screenshot('home')
  end

  def test_offline
    path = "/offline/"
    visit(path)
    sleep 5
    take_screenshot(screenshot_name(path))
  end

  def test_404
    path = "/404/"
    visit(path)
    sleep 5
    take_screenshot(screenshot_name(path))
  end

  def test_interactive
    path = "/tags/interactive/"
    visit(path)
    take_screenshot(screenshot_name(path))
  end

  def test_blog_and_posts
    visit("/blog/")
    take_screenshot("blog")

    post_links = page.all("table a").map { |a|
      href = a[:href]
      uri = URI.parse(href)
      uri.path
    }
    assert post_links.length > 0, "No post links found on /blog/"

    post_links.each do |post_path|
      normalized = post_path.sub(%r{/$}, "")
      next if FLAKY_PAGES.include?(normalized)

      visit(post_path)

      sleep 1 if DELAYED_PAGES.include?(normalized)

      basename = screenshot_name(post_path)

      # Screenshot at the top
      take_screenshot(basename)

      # Press Page Down / Space and take a second screenshot
      page.find("body").send_keys(:space)
      sleep 0.3
      take_screenshot("#{basename}_scrolled")
    end
  end

  private def take_screenshot(basename)
    filename = basename + '.png'
    baseline_path = File.join(BASELINE_DIR, filename)
    if UPDATE_SNAPSHOTS || !File.exist?(baseline_path)
      page.save_screenshot(baseline_path)
    else
      current_path = File.join(CURRENT_DIR, filename)
      page.save_screenshot(current_path)

      diff_path = File.join(DIFF_DIR, filename)
      cli = Rodiff::CLI.new
      cli.send(:odiff_exec, baseline_path, current_path, diff_path) do |_stdout, _stderr, status|
        if status.exitstatus == 0
          # Images match — remove the empty diff
          FileUtils.rm_f(diff_path)
        else
          flunk "Visual regression detected for #{filename}. Diff saved to #{diff_path}"
        end
      end
    end
  end

  private def screenshot_name(path)
    name = path
      .sub(%r{^/}, "")
      .sub(%r{/$}, "")
      .gsub("/", "_")
    name
  end
end
