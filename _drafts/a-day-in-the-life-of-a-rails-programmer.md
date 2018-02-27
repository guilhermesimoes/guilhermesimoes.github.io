---
layout:   post
title:    "A Day In The Life Of A Rails Programmer"
---
A client has a Rails CMS and a Rails front-end application.

When stuff is added to the CMS it can then be displayed in the front-end application.

In this CMS, products can have downloads. Downloads can already be added to a product in the CMS.

But the front-end application still isn't displaying those downloads.

Right now I'm changing the front-end application to display those downloads.

From looking at the template that I have to change I know that I have access to the variable `product`.

Let's search the source code for any download related stuff:

```ruby
module Products
  class Product < Base
    # ...
    has_many :global_downloads
    # ...
  end
end
```

Ok, let's try and display a product's `global_downloads`:

```ruby
product.global_downloads #=> NoMethodError: undefined method `global_downloads' for #<Presenters::V4r::Product:0x007fbd06eb5288>
```

Oh, so `product` isn't really a product. `product` is a product presenter. Where is this class defined?

```ruby
product.name #=> "Product Name"
product.method(:name).source_location #=> "../ruby-2.1.10/lib/ruby/gems/2.1.0/bundler/gems/company-cms-abc9c0392d11/common/app/models/presenters/v4r/product.rb"
```

Hm, ok, so this code is inside the CMS gem, not the front-end application. Maybe the applications share some common code. Since I'm working on the front-end application, let's see if I can do this without having to make any changes to the CMS.

Let's search the source code for any download related stuff:

```ruby
def downloads(locale = nil)
  @model.global_downloads(locale).map{|d| Presenters::V4r::GlobalDownload.new(d) }
end
```

Ok, the presenter doesn't delegate `global_downloads` to the product but it has a `downloads` method. Let's try it:

```ruby
product.downloads #=> []
```

It's empty? But I know that the product has downloads...

Let's search the source code for a way to bypass the presenter and use the product directly.

```ruby
module Presenters
  module V4r
    class Product
      # ...
      attr_reader :model
      # ...
      def initialize(product, params = {})
        @model = product
        @params = params
      end
      # ...
    end
  end
end
```

Ok, easy enough:

```ruby
product.model.global_downloads #=> []
```

Empty again? Well, this makes some sense given that the previous method did not work and it `map`ped over the model's downloads.

But what is this model after all?

```ruby
product.model.class #=> Products::Product::Translation
```

Ah, so this still isn't really a product. `product.model` is a product translation. Where is this class defined?

```ruby
product.model.name #=> "Product Name"
product.model.method(:name).source_location  #=> "../ruby-2.1.10/lib/ruby/gems/2.1.0/bundler/gems/company-cms-abc9c0392d11/common/lib/translatable/model.rb"
```

Oh, so this class is created through meta programming... And we're still inside the CMS gem.

Let's search the source code for a way to bypass the translation and use the actual product instance:

```ruby
module Translatable
  class Model
    # ...
    attr_reader :model
    # ...
    def initialize(model, locale, use_fallback=true, expose_i18n_lookup=false)
      @model = model
      # ...
    end
  end
end
```

Oh, it's `model` again. This time around let's confirm that we have an actual reference to a product. Fool me once, shame on me. Fool me twice:

```ruby
product.model.model.class #=> Products::Product
```

Ok! Got it! If this didn't work I probably would have gone for the triple `model` trick without even looking at the source code. Let's get those downloads:

```ruby
product.model.model.global_downloads #=> [#<GlobalDownload>, #<GlobalDownload>, #<GlobalDownload>]
```

Aha! Here they are!

Is this pretty? No.

Is there a better way? Probably.

But the original team has long moved on and there's no documentation...

Afterword | Closing thoughts

I wrote the above in a fit of rage

For more stories from the trenches

https://www.reddit.com/r/rails/comments/78qe4j/times_where_you_discovered_the_code_is_clearly/
